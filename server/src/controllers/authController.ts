import { RequestHandler, Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../config/env";
import bcrypt from "bcrypt";
import User, { UserCreateInterface } from "../models/User";
import { COUNTRIES } from "../constants/countries";
import { createFakeInvoices } from "../faker/createFakeInvoices";
// import { transporter } from "../config/createMailTransporter";

const ACCESS_TOKEN_EXPIRES: string = "10s";
const REFRESH_TOKEN_EXPIRES: string = "20s";
const COOKIE_MAX_AGE: number = 1000 * 60 * 60 * 48;

export interface AccessTokenPayload {
    UserInfo: ResLocals
}

export interface ResLocals {
    id: string,
    firstName: string,
    roles: string[],
    isVerified: boolean,
}

export interface RefreshTokenPayload {
    UserInfo: {
        id: string
    }
}

const createAccessToken = (payload: AccessTokenPayload) => {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES });
};

const createRefreshToken = (payload: RefreshTokenPayload) => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES });
};

// const createEmailToken = (payload: { userId: string }) => {
//     return jwt.sign(payload, env.EMAIL_TOKEN_SECRET, { expiresIn: "600s" });
// };

export const register = async (req: Request<unknown, unknown, UserCreateInterface, unknown>, res: Response, next: NextFunction) => {
    const { firstName, password, lastName, country, email, phone } = req.body;
    try {
        if (!firstName || !password || !lastName || !country || !email || !phone) throw createHttpError(400, "Please complete all the fields");
        if (!COUNTRIES.includes(country)) throw createHttpError(400, "Include a valid country");
        const duplicate = await User.findOne({ email }).lean().exec();
        if (duplicate) throw createHttpError(401, "Email already used");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            firstName,
            lastName,
            country,
            phone,
            email,
            password: hashedPassword,
        };

        const createdUser = await User.create(newUser);
        if (!createdUser) throw createHttpError(400, "Invalid data received");
        createFakeInvoices(createdUser._id.toString(), next, 15);
        res.status(201).json({ message: `New user ${createdUser.email} created, check email to verify your account.`, });
    }
    catch (error) {
        next(error);
    }
};

interface LoginReqBody {
    email: string;
    password: string;
}

export const login = async (req: Request<unknown, unknown, LoginReqBody, unknown>, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) throw createHttpError(400, "Please complete all the fields");
        const foundUser = await User.findOne({ email }).lean().exec();
        if (!foundUser) throw createHttpError(400, "Incorrect email");
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) throw createHttpError(400, "Incorrect password");
        // if (!foundUser.isVerified) {
        //     const emailToken = createEmailToken({ userId: foundUser._id.toString() });
        //     const currentDomain = env.isDevelopment
        //         ? req.headers.origin
        //         : env.DOMAIN_CLIENT_PROD;
        //     const href = `${currentDomain}/verify/${emailToken}`;
        //     await transporter.sendMail({
        //         to: foundUser.email,
        //         from: env.EMAIL_USER,
        //         subject: `Verification link for ${currentDomain}`,
        //         html: `
        //             <p>Click the link bellow to verify you account.</p>
        //             <br/>
        //             <a href=${href}>${href}</a>
        //         `
        //     });
        //     throw createHttpError(401, "User not verified, check email");
        // }

        const accessToken = createAccessToken({
            UserInfo: {
                id: foundUser._id.toString(),
                firstName: foundUser.firstName,
                roles: foundUser.roles,
                isVerified: foundUser.isVerified,
            }
        });
        const refreshToken = createRefreshToken({
            UserInfo: {
                id: foundUser._id.toString()
            }
        });

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: COOKIE_MAX_AGE
        });

        res.status(200).json({ accessToken });
    }
    catch (error) {
        next(error);
    }
};

export const refresh: RequestHandler = async (req, res, next) => {
    const cookies = req.cookies;
    try {
        if (!cookies?.jwt) throw createHttpError(401, "Session expired, login required");
        const decoded = jwt.verify(cookies.jwt, env.REFRESH_TOKEN_SECRET) as AccessTokenPayload;
        const foundUser = await User.findById(decoded.UserInfo.id).lean().exec();
        if (!foundUser) throw createHttpError(401, "Unauthorized (User doesn't exist)");
        const accessToken = createAccessToken({
            UserInfo: {
                id: foundUser._id.toString(),
                firstName: foundUser.firstName,
                roles: foundUser.roles,
                isVerified: foundUser.isVerified
            }
        });
        res.status(200).json({ accessToken });
    }
    catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = async (req, res, next) => {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt) return res.status(200).json({ message: "Already logged out" });
    try {
        res.clearCookie("jwt", {
            secure: true,
            httpOnly: true,
            sameSite: "none"
        });
        res.status(200).json({ message: "Successfully logged out" });
    }
    catch (error) {
        next(error);
    }
};

export const verifyEmail = async (req: Request<{emailToken: string}, unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    const { emailToken } = req.params;
    try {
        const decoded = jwt.verify(emailToken, env.EMAIL_TOKEN_SECRET) as { userId: string };
        const foundUser = await User.findById(decoded.userId);
        if(!foundUser) throw createHttpError(404, "User not found");
        if(foundUser.isVerified) return res.status(200).json({ message: "Account already verified!" });
        foundUser.isVerified = true;
        await foundUser.save();
        res.status(200).json({ message: "Account verified!" });
    }
    catch(error){
        next(error);
    }
};