import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import env from "../config/env";
import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { AccessTokenPayload, ResLocals } from "../controllers/helpers/createTokens";

export const verifyJWT = async (req: Request, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const authorization = req.headers.authorization;
    try {
        if (!authorization) throw createHttpError(401, "Unauthorized, please login");
        if (!authorization.startsWith("Bearer ")) throw createHttpError(401, "Invalid authorization");
        const token = authorization.split(" ")[1];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;
        res.locals.id = decoded.UserInfo.id;
        res.locals.firstName = decoded.UserInfo.firstName;
        res.locals.role = decoded.UserInfo.role;
        res.locals.isVerified = decoded.UserInfo.isVerified;
        next();
    }
    catch (error) {
        if(error instanceof TokenExpiredError) return next(createHttpError(403, "Login session expired"));
        else if(error instanceof JsonWebTokenError) return next(createHttpError(403, "JWT tampered with"));
        next(error);
    }
};