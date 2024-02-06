/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import { ResLocals } from "../controllers/helpers/createTokens";
import createHttpError from "http-errors";

export const ROLES = {
    owner: "OWNER",
    reader: "READER",
    user: "USER"
};

export const verifyRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response<unknown, ResLocals>, next: NextFunction) => {
        const userRole = res.locals.role;
        if (!userRole) {
            return next(createHttpError(403, "Forbidden: user doesn't have role assigned"));
        }
        const allowed = allowedRoles.includes(userRole);
        if(!allowed) return next(createHttpError(400, "Forbidden: user doesn't have the necessary role to access resource"));
        next();
    };
};