/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { ResLocals } from "../controllers/authController";
import createHttpError from "http-errors";

export const ROLES = {
    owner: "OWNER",
    admin: "ADMIN",
    user: "USER"
};

export const verifyRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response<unknown, ResLocals>, next: NextFunction) => {
        if (!res.locals.roles) {
            return next(createHttpError(403, "Forbidden: user doesn't have roles assigned"));
        }
        const userRoles = [...res.locals.roles];
        const allowed = userRoles.some((el) => allowedRoles.includes(el));
        if(!allowed) return next(createHttpError(403, "Forbidden: user doesn't have the necessary role to access resource"));
        next();
    };
};