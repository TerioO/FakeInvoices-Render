import { NextFunction } from "express";
import Invoice from "../models/Invoice";
import { validateObjectId } from "../constants/validateObjectId";
import createHttpError from "http-errors";
import User from "../models/User";

/**
 * Should be used inside try catch block
 */
export const createFakeInvoices = async (userId: string, next: NextFunction, N: number) => {
    if (!userId) return next(createHttpError(400, "Please fill all the fields"));
    validateObjectId(userId);
    const foundUser = await User.findById(userId).lean().exec();
    if (!foundUser) throw createHttpError(404, "User not found");


    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    let month = currentMonth;
    let year = currentYear;
    const limit = N || 12;
    for (let j = 0; j < limit; j++) {
        if (month == 0) {
            month = 12;
            year -= 1;
        }
        await Invoice.create({
            userId,
            userEmail: foundUser.email,
            userCountry: foundUser.country,
            dueDate: new Date(`${year}-${month}-27`),
            isPaid: true
        });
        month -= 1;
    }
};