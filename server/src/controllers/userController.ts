import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/User";
import createHttpError from "http-errors";
import { ResLocals } from "./helpers/createTokens";
import { ROLES } from "../middleware/verifyRoles";
import { validateObjectId } from "../constants/validateObjectId";

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
        if(role === ROLES.owner) query = { role: { $in: [ROLES.user, ROLES.reader ]}};
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
        if(role === ROLES.user && res.locals.id !== userId) throw createHttpError(400, `${ROLES.user} can't access other users entries`);
        else if(role === ROLES.reader){
            if([ROLES.owner].includes(user.role)){
                throw createHttpError(400, "Access not allowed by user role");
            }
            else if([ROLES.reader].includes(user.role) && userId != id){
                throw createHttpError(400, "Access not allowed by user role");
            }
        }
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
};