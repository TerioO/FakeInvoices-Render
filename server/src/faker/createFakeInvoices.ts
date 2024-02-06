import { NextFunction } from "express";
import { validateObjectId } from "../constants/validateObjectId";
import createHttpError from "http-errors";
import User from "../models/User";
import { createFakeInvoices } from "./createFakeUsers";

/**
 * Should be used inside try catch block
 */
export const createFakeInvoicesReq = async (userId: string, userRole: string, next: NextFunction, N: number) => {
    // Validation:
    if (!userId) return next(createHttpError(400, "Please fill all the fields"));
    validateObjectId(userId);
    const foundUser = await User.findById(userId).lean().exec();
    if (!foundUser) throw createHttpError(404, "User not found");
    // 
    createFakeInvoices(userId, userRole, N);
};