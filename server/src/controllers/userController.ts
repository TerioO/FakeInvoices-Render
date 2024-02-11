import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/User";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { ResLocals } from "./helpers/createTokens";
import { ROLES } from "../middleware/verifyRoles";
import { validateObjectId } from "../constants/validateObjectId";
import { appConfig } from "../config/appConfig";
import { PASSWORD_REGEX } from "../constants/regex";
import Invoice from "../models/Invoice";

// [GET] ------------------------------------------------------------------------------------[GET]------------------------------------------------------------------------------

/**
 * Returns every user without **password** field
 */
export const getAllUsers: RequestHandler = async (req, res, next) => {
    try {
        const users = await User.find({})
            .select("-password")
            .lean()
            .exec();
        if (users.length === 0) throw createHttpError(404, "No users found");
        res.status(200).json({ users });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Returns every user that has **role=ROLES.user**
 * - Should only be accessed by READERs and OWNERs
 * - Uses pagination
 */
export const getUsers = async (req: Request<unknown, unknown, unknown, { limit: string, page: string }>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { limit, page } = req.query;
    const { role } = res.locals;
    let l: number = 20;
    let p: number = 1;
    if (!isNaN(parseInt(limit)) && parseInt(limit) > 0) l = parseInt(limit);
    if (!isNaN(parseInt(page)) && parseInt(page) > 1) p = parseInt(page);
    try {
        let query = { role: { $in: [ROLES.user] } };
        if (role === ROLES.owner) query = { role: { $in: [ROLES.user, ROLES.reader] } };
        const users = await User.find(query)
            .limit(l)
            .skip((p - 1) * l)
            .select("-password")
            .lean()
            .exec();
        if (users.length === 0) throw createHttpError(404, "No users found");

        const usersLength = await User.countDocuments(query);
        res.status(200).json({ users, usersArrayLength: usersLength });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Returns a users entire DB entry using **res.locals**
 */
export const getProfile = async (req: Request, res: Response<unknown, ResLocals>, next: NextFunction) => {
    try {
        if (!res.locals.id) throw createHttpError(401, "Unauthorized, login required");
        const user = await User.findById(res.locals.id).lean().exec();
        if (!user) throw createHttpError(404, "No such user found");
        res.status(200).json({ profile: user });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Using query param **userId** and **res.locals** allow:
 * - USERs to access their own entry
 * - READERs to access USERs entries
 * - OWNERs to access every READER, USER
 */
export const getUser = async (req: Request<unknown, unknown, unknown, { userId: string }>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { userId } = req.query;
    const { role, id } = res.locals;
    try {
        // Validation:
        if (!userId) throw createHttpError(400, "userId required");
        validateObjectId(userId);

        // Searching:
        const user = await User.findById(userId)
            .select("-password")
            .lean()
            .exec();
        if (!user) throw createHttpError(404, "User not found");

        // Permission check:
        if (role === ROLES.user && res.locals.id !== userId) throw createHttpError(400, `${ROLES.user} can't access other users entries`);
        else if (role === ROLES.reader) {
            if ([ROLES.owner].includes(user.role)) {
                throw createHttpError(400, "Access not allowed by user role");
            }
            else if ([ROLES.reader].includes(user.role) && userId != id) {
                throw createHttpError(400, "Access not allowed by user role");
            }
        }
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
};

// [PATCH] ------------------------------------------------------------------------------------[PATCH]------------------------------------------------------------------------------

interface UpdateUserReqBody {
    userId: string;
    role: string;
    password: string;
    email: string;
}

/**
 * Update a user, should only be available for OWNERs
 */
export const updateUser = async (req: Request<unknown, unknown, UpdateUserReqBody, unknown>, res: Response, next: NextFunction) => {
    const { userId, role, email, password } = req.body;
    try {
        // Validation:
        if (!userId) throw createHttpError(400, "userId required");
        validateObjectId(userId);
        if (!role && !password && !email) throw createHttpError(400, "role or email or password required");

        const foundUser = await User.findById(userId);
        if (!foundUser) throw createHttpError(404, "User not found");
        if (foundUser.role === ROLES.owner) throw createHttpError(400, "Cannot update this user");
        if (Object.values(ROLES).includes(role)){
            foundUser.role = role;
            await Invoice.updateMany({ "user.id": userId }, { $set: { "user.role": role }});
        }
        if (password) {
            const newPass = await bcrypt.hash(password, appConfig.saltRounds);
            foundUser.password = newPass;
        }
        if (email) {
            const alreadyUsed = await User.findOne({ email }).lean().exec();
            if(alreadyUsed) throw createHttpError(400, "Email already used");
            foundUser.email = email;
            foundUser.verification.isVerified = false;
        }
        await foundUser.save();
        res.status(200).json({ message: `User - ${foundUser._id.toString()} updated!` });
    }
    catch (error) {
        next(error);
    }
};

interface UpdateMyAccountReqBody {
    newPassword: string;
    currentPassword: string;
}

export const updateMyAccount = async (req: Request<unknown, unknown, UpdateMyAccountReqBody, unknown>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { id } = res.locals;
    const { newPassword, currentPassword } = req.body;
    try {
        if (!id) throw createHttpError(401, "Not logged in");
        if (!newPassword || !currentPassword) throw createHttpError(400, "newPassword, currentPassword required");
        if (!PASSWORD_REGEX.test(newPassword)) throw createHttpError(400, "Password not strong enough");

        const foundUser = await User.findById(id);
        if (!foundUser) throw createHttpError(404, "User not found");

        const passwordMatch = await bcrypt.compare(currentPassword, foundUser.password);
        if (!passwordMatch) throw createHttpError(400, "Current Password doesn't match original");

        const newPass = await bcrypt.hash(newPassword, appConfig.saltRounds);
        foundUser.password = newPass;
        await foundUser.save();
        res.status(200).json({ message: "Account updated!" });
    }
    catch (error) {
        next(error);
    }
};