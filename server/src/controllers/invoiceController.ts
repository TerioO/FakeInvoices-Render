import { Request, Response, NextFunction } from "express";
import Invoice, { InvoiceCreateInterface } from "../models/Invoice";
import createHttpError from "http-errors";
import User from "../models/User";
import { ResLocals } from "./authController";
import { ROLES } from "../middleware/verifyRoles";
import { validateObjectId } from "../constants/validateObjectId";

export const createInvoice = async (req: Request<unknown, unknown, InvoiceCreateInterface, unknown>, res: Response, next: NextFunction) => {
    const { userId, isPaid, dueDate } = req.body;
    try {
        if (!userId || !isPaid || !dueDate) throw createHttpError(400, "Please fill all the fields");
        validateObjectId(userId);
        const foundUser = await User.findById(userId).lean().exec();
        if (!foundUser) throw createHttpError(404, "User not found");
        await Invoice.create({
            userId,
            userEmail: foundUser.email,
            userCountry: foundUser.country,
            dueDate,
            isPaid
        });
        res.status(201).json({ message: "New invoice created!" });
    }
    catch (error) {
        next(error);
    }
};

interface InvoiceUpdateReq {
    invoiceId: string;
    isPaid: boolean
}

export const updateInvoice = async (req: Request<unknown, unknown, InvoiceUpdateReq, unknown>, res: Response, next: NextFunction) => {
    const { invoiceId, isPaid } = req.body;
    try {
        if (!invoiceId || isPaid) throw createHttpError(400, "Request body required");
        validateObjectId(invoiceId);
        const foundInvoice = await Invoice.findById(invoiceId);
        if (!foundInvoice) throw createHttpError(404, "Invoice not found");
        foundInvoice.isPaid = isPaid;
        await foundInvoice.save();
        res.status(200).json({ message: "Invoice updated" });
    }
    catch (error) {
        next(error);
    }
};

// [GET] ------------------------------------------------------------------------------- [GET] -----------------------------------------------------------------------------------------------------------
export const getInvoice = async (req: Request<unknown, unknown, unknown, { invoiceId: string }>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { invoiceId } = req.query;
    const { roles, id } = res.locals;
    try {
        let isAdminOrOnwer: boolean = false;
        // User isn't admin or owner:
        if (roles.some((el) => [ROLES.admin, ROLES.owner].includes(el))) {
            isAdminOrOnwer = true;
        }
        if (!invoiceId) throw createHttpError(400, "InvoiceId required");
        validateObjectId(invoiceId);
        const foundInvoice = await Invoice.findById(invoiceId)
            .lean()
            .exec();
        if (!foundInvoice) throw createHttpError(404, "Invoice not found");
        // Users should be able to retrieve only their own invoices:
        if (!isAdminOrOnwer && id !== foundInvoice.userId.toString()) throw createHttpError(400, "User doesn't have required role");
        res.status(200).json({ invoice: foundInvoice });
    }
    catch (error) {
        next(error);
    }
};

export const getAllInvoices = async (req: Request<unknown, unknown, unknown, { limit: string, page: string }>, res: Response, next: NextFunction) => {
    const { limit, page } = req.query;
    let l: number = 20;
    let p: number = 1;
    if (!isNaN(parseInt(limit)) && parseInt(limit) > 0) l = parseInt(limit);
    if (!isNaN(parseInt(page)) && parseInt(page) > 1) p = parseInt(page);
    try {
        const invoices = await Invoice.find({})
            .limit(l)
            .skip((p - 1) * l)
            .lean()
            .exec();
        if (invoices.length === 0) throw createHttpError(404, "No invoice found");
        const invoicesArrayLen = await Invoice.countDocuments({});
        res.status(200).json({ invoices, invoicesArrayLen });
    }
    catch (error) {
        next(error);
    }
};

export const getUsersInvoices = async (req: Request<unknown, unknown, unknown, { userId: string }>, res: Response, next: NextFunction) => {
    const { userId } = req.query;
    try {
        if (!userId) throw createHttpError(400, "UserId required");
        validateObjectId(userId);
        const invoices = await Invoice.find({ userId })
            .lean()
            .exec();
        if (invoices.length === 0) throw createHttpError(404, "Invoices not found");
        res.status(200).json({ invoices });
    }
    catch (error) {
        next(error);
    }
};


export const getMyInvoices = async (req: Request, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { id } = res.locals;
    try {
        if (!id) throw createHttpError(401, "Not logged in");
        validateObjectId(id);
        const invoices = await Invoice.find({ userId: id })
            .lean()
            .exec();
        if (invoices.length === 0) throw createHttpError(404, "No invoices found");
        res.status(200).json({ invoices });
    }
    catch (error) {
        next(error);
    }
};