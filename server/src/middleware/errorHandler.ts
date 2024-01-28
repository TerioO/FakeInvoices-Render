import { Request, Response, NextFunction } from "express";
import { isHttpError } from "http-errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: unknown, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = "Unexpected Error";
    if(isHttpError(error)){
        statusCode = error.statusCode;
        message = error.message;
    }
    else if(error instanceof Error){
        statusCode = 400;
        message = error.message;
    }
    console.log(error);
    res.status(statusCode).json({ message, isError: true });
};