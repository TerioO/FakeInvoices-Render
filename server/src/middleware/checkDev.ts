import createHttpError from "http-errors";
import env from "../config/env";
import { RequestHandler } from "express";

export const checkEnv: RequestHandler = (req, res, next) => {
    if(env.NODE_ENV === "development") return next();
    else return next(createHttpError(500, "Not in development mode."));
};