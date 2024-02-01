import { Request, Response, NextFunction } from "express";
import { isHttpError } from "http-errors";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Unexpected Error";
    if(isHttpError(error)){
        statusCode = error.statusCode;
        message = error.message;
    }
    else if(error instanceof JsonWebTokenError){
        statusCode = 403;
        message = error.message;
    }
    else if(error instanceof TokenExpiredError){
        statusCode = 403;
        message = error.message;
        console.log(statusCode);
    }
    else if(error instanceof Error){
        statusCode = 400;
        message = "Unknown error";
    }
    console.log(error);
    res.status(statusCode).json({ message, isError: true });
};