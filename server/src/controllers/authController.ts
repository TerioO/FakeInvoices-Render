import { RequestHandler, Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import env from "../config/env";
import bcrypt from "bcrypt";
import User, { UserCreateInterface } from "../models/User";
import { COUNTRIES } from "../constants/countries";
import { PASSWORD_REGEX, NAME_REGEX, EMAIL_REGEX } from "../constants/regex";
import { createFakeInvoicesReq } from "../faker/createFakeInvoices";
import { appConfig } from "../config/appConfig";
import { AccessTokenPayload, createAccessToken, createRefreshToken } from "./helpers/createTokens";
import { sendVerificationEmail } from "./helpers/sendEmails";
import { validateEmail } from "../constants/emailDomains";

export const register = async (req: Request<unknown, unknown, UserCreateInterface, unknown>, res: Response, next: NextFunction) => {
    const { firstName, password, lastName, country, email, phone } = req.body;
    try {
        // Validation:
        if (!firstName || !password || !lastName || !country || !email || !phone) throw createHttpError(400, "Please complete all the fields");
        if (!COUNTRIES.includes(country)) throw createHttpError(400, "Include a valid country");
        if (!NAME_REGEX.test(firstName) || !NAME_REGEX.test(lastName)) throw createHttpError(400, "Invalid name");
        if (!PASSWORD_REGEX.test(password)) throw createHttpError(400, "Password not strong enough");
        if (!EMAIL_REGEX.test(email)) throw createHttpError(400, "Invalid email format");
        if (!validateEmail(email)) throw createHttpError(400, "Invalid email provider, check allowed list");

        // Duplicate check:
        const duplicate = await User.findOne({ email }).lean().exec();
        if (duplicate) throw createHttpError(400, "Email already used");

        // New user:
        const hashedPassword = await bcrypt.hash(password, appConfig.saltRounds);
        const newUser: UserCreateInterface = {
            firstName,
            lastName,
            country,
            phone,
            email,
            password: hashedPassword,
            verification: {
                isVerified: false
            }
        };

        // Adding to db:
        const createdUser = await User.create(newUser);
        if (!createdUser) throw createHttpError(400, "Invalid data received");

        // Creating fake invoices & response:
        createFakeInvoicesReq(createdUser._id.toString(), createdUser.role, next, appConfig.random_invoices_to_generate);
        res.status(201).json({ message: `New user ${createdUser.email} created, account needs to be verified through email.`, });
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
        // Validation:
        if (!email || !password) throw createHttpError(400, "Please complete all the fields");
        const foundUser = await User.findOne({ email });
        if (!foundUser) throw createHttpError(400, "Incorrect email");
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) throw createHttpError(400, "Incorrect password");

        // Send verification email:
        if (!foundUser.verification.isVerified) {
            const response = await sendVerificationEmail(foundUser, req as Request);
            if (response?.status === 200) {
                foundUser.verification.emailSentAt = new Date();
                await foundUser.save();
                throw createHttpError(400, response.message);
            }
            else if (response?.status === 400) throw createHttpError(400, response.message);
        }

        // Response:
        const accessToken = createAccessToken({
            UserInfo: {
                id: foundUser._id.toString(),
                firstName: foundUser.firstName,
                role: foundUser.role,
                isVerified: foundUser.verification.isVerified,
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
            maxAge: appConfig.cookie_max_age
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
                role: foundUser.role,
                isVerified: foundUser.verification.isVerified
            }
        });
        res.status(200).json({ accessToken });
    }
    catch (error) {
        if (error instanceof TokenExpiredError) return next(createHttpError(403, "Refresh token expired"));
        else if (error instanceof JsonWebTokenError) return next(createHttpError(403, "JWT tampered with"));
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

export const verifyEmail = async (req: Request<{ emailToken: string }, unknown, unknown, unknown>, res: Response, next: NextFunction) => {
    const { emailToken } = req.params;
    try {
        const decoded = jwt.verify(emailToken, env.EMAIL_TOKEN_SECRET) as { userId: string };
        const foundUser = await User.findById(decoded.userId);
        if (!foundUser) throw createHttpError(404, "User not found");
        if (foundUser.verification.isVerified) return res.status(200).json({ message: "Account already verified!" });
        foundUser.verification.isVerified = true;
        await foundUser.save();
        res.status(200).json({ message: "Account verified!" });
    }
    catch (error) {
        if(error instanceof TokenExpiredError) return next(createHttpError(400, "Link expired, try another login and a new verification link will be sent"));
        else if(error instanceof JsonWebTokenError) return next(createHttpError(400, "JWT tampered with"));
        next(error);
    }
};