import { Request, Response, NextFunction, RequestHandler } from "express";
import User from "../models/User";
import createHttpError from "http-errors";
import { ResLocals } from "./authController";
import { UserInterface } from "../models/User";
import { ROLES } from "../middleware/verifyRoles";
import { validateObjectId } from "../constants/validateObjectId";

// [GET] ------------------------------------------------------------------------------------[GET]------------------------------------------------------------------------------
interface UserWithIdInterface extends UserInterface {
    _id: string;
}

/**
 * Returns every user without **password**
 */
export const getAllUsers: RequestHandler = async (req, res, next) => {
    try {
        const users = await User.find({})
            .select("-password")    
            .lean()
            .exec();
        if(users.length === 0) throw createHttpError(404, "No users found");
        res.status(200).json({ users });
    }
    catch(error){
        next(error);
    }
};

/**
 * Returns every user that isn't "ADMIN" or "OWNER" and how many users there are
 * 
 * Uses pagination
 */
export const getUsers = async (req: Request<unknown,  unknown, unknown, { limit: string, page: string }>, res: Response, next: NextFunction) => {
    const { limit, page } = req.query;
    let l: number = 20;
    let p: number = 1;
    if(!isNaN(parseInt(limit)) && parseInt(limit) > 0) l = parseInt(limit);
    if(!isNaN(parseInt(page)) && parseInt(page) > 1) p = parseInt(page);
    try {
        const users = await User.find({})
            .limit(l)
            .skip((p-1)*l)
            .lean()
            .exec();
        if (users.length === 0) throw createHttpError(404, "No users found");
        const formatedUsers: Partial<UserWithIdInterface>[] = [];
        users.forEach((user) => {
            if(!user.roles.some((el) => [ROLES.admin, ROLES.owner].includes(el))){
                formatedUsers.push({
                    _id: user._id.toString(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    country: user.country,
                    phone: user.phone,
                    roles: user.roles,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                });
            }
        });
        const usersLength = await User.countDocuments({ roles: { $nin: ["ADMIN", "OWNER"] } });
        res.status(200).json({ users: formatedUsers, usersArrayLength: usersLength });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Returns a users own db entry without **password** and **_id**
 */
export const getProfile = async (req: Request, res: Response<unknown, ResLocals>, next: NextFunction) => {
    try {
        if(!res.locals.id) throw createHttpError(401, "Unauthorized, login required");
        const formatedProfile = await User.findById(res.locals.id)
            .select("-password -_id")
            .lean()
            .exec();
        if(!formatedProfile) throw createHttpError(404, "No such user found");
        res.status(200).json({ profile: formatedProfile });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Using query param, retrieve a users db entry
 * 
 * OWNERS can retrieve any user
 * ADMINS and USERS can only retrieve their own entry
 */
export const getUser = async (req: Request<unknown, unknown, unknown, { userId: string }>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { userId } = req.query;
    const { roles } = res.locals;
    try {
        if(!userId) throw createHttpError(400, "UserId required");
        validateObjectId(userId);
        let allowReq: boolean = false;
        // User isn't admin or owner:
        if(!roles.some((el) => [ROLES.admin, ROLES.owner].includes(el))) {
            // User should be able to access his own DB entry:
            if(res.locals.id === userId) allowReq = true;
        }
        // User is admin/owner ==> can access any DB user's entry:
        else allowReq = true;
        if(!allowReq) throw createHttpError(403, "User doesn't have necessary role");
        const user = await User.findById(userId)
            .select("-password")
            .lean()
            .exec();
        if(!user) throw createHttpError(404, "User not found");
        res.status(200).json({ user });
    }
    catch(error){
        next(error);
    }
};