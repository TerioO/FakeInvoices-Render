import { Request, Response, NextFunction } from "express";
import Invoice from "../models/Invoice";
import createHttpError from "http-errors";
import { ResLocals } from "./helpers/createTokens";
import { ROLES } from "../middleware/verifyRoles";
import { validateObjectId } from "../constants/validateObjectId";
import PdfPrinter from "pdfmake";
import User from "../models/User";
import { pdfmakeFonts } from "../constants/fonts";
import { createInvoicePDF } from "./helpers/createInvoicePDF";
import env from "../config/env";
import { validateEmail } from "../constants/emailDomains";

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

/**
 * Using query param **invoiceId** and **res.locals** allow:
 * - USERs to retrieve their own invoice
 * - READERs to retrieve other USERs invoices
 * - OWNERs to retrieve any invoice
 */
export const getInvoice = async (req: Request<unknown, unknown, unknown, { invoiceId: string }>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { invoiceId } = req.query;
    const { role, id } = res.locals;
    try {
        // Validation:
        if (!invoiceId) throw createHttpError(400, "invoiceId required");
        validateObjectId(invoiceId);

        // Searching:
        const foundInvoice = await Invoice.findById(invoiceId).lean().exec();
        if (!foundInvoice) throw createHttpError(404, "Invoice not found");

        // Permission check:
        if (role === ROLES.user) {
            if (id != foundInvoice.user.id.toString()) throw createHttpError(400, `Your role: ${role} isn't allowed to read other peoples invoices`);
        }
        else if (role === ROLES.reader) {
            if (foundInvoice.user.role === ROLES.owner ||
                (foundInvoice.user.role === ROLES.reader && foundInvoice.user.id.toString() != id))
                throw createHttpError(400, `Your role: ${role} can read his invoice or any ${ROLES.user}s invoices`);
        }
        res.status(200).json({ invoice: foundInvoice });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Returns all invoices, uses pagination, allow
 * - USERs no access
 * - READERs to retrieve USERs invoices
 * - OWNERs to retrieve USERs, READERs invoices
 */
export const getAllInvoices = async (req: Request<unknown, unknown, unknown, { limit: string, page: string }>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { limit, page } = req.query;
    let l: number = 20;
    let p: number = 1;
    if (!isNaN(parseInt(limit)) && parseInt(limit) > 0) l = parseInt(limit);
    if (!isNaN(parseInt(page)) && parseInt(page) > 1) p = parseInt(page);
    try {
        let query = {};
        if (res.locals.role === ROLES.owner) {
            query = { "user.role": { $ne: ROLES.owner } };
        }
        else if (res.locals.role === ROLES.reader) {
            query = { "user.role": { $eq: ROLES.user } };
        }
        const invoices = await Invoice.find(query)
            .limit(l)
            .skip((p - 1) * l)
            .lean()
            .exec();
        if (invoices.length === 0) throw createHttpError(404, "No invoice found");
        const invoicesArrayLen = await Invoice.countDocuments(query);
        res.status(200).json({ invoices, invoicesArrayLen });
    }
    catch (error) {
        next(error);
    }
};

/**
 * Uses query param **userId** to retrieve a users invoices
 * - USERs no access
 * - READERs to retrieve any USERs invoices
 * - OWNERs to retrieve any USERs, READERs invoices
 */
export const getUsersInvoices = async (req: Request<unknown, unknown, unknown, { userId: string }>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { userId } = req.query;
    const { role } = res.locals;
    try {
        // Validation:
        if (!userId) throw createHttpError(400, "userId required");
        validateObjectId(userId);

        // Permission check:
        let query = {};
        if (role === ROLES.user) throw createHttpError(400, `Your role: ${role} cannot access this route`);
        else if (role === ROLES.reader) {
            query = {
                $and: [
                    { "user.role": ROLES.user },
                    { "user.id": userId }
                ]
            };
        }
        else if (role === ROLES.owner) {
            query = {
                $and: [
                    { "user.role": { $in: [ROLES.user, ROLES.reader] } },
                    { "user.id": userId }
                ]
            };
        }

        // Response:
        const invoices = await Invoice.find(query).lean().exec();
        if (invoices.length === 0) throw createHttpError(404, "Invoices not found");
        res.status(200).json({ invoices });
    }
    catch (error) {
        next(error);
    }
};


/**
 * Uses **res.locals** to retrieve my invoices
 */
export const getMyInvoices = async (req: Request, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { id } = res.locals;
    try {
        // Validation:
        if (!id) throw createHttpError(401, "Not logged in");
        validateObjectId(id);

        // Searching & response:
        const invoices = await Invoice.find({ "user.id": id })
            .lean()
            .exec();
        if (invoices.length === 0) throw createHttpError(404, "No invoices found");
        res.status(200).json({ invoices });
    }
    catch (error) {
        next(error);
    }
};

export const getInvoicePDF = async (req: Request<unknown, unknown, unknown, { invoiceId: string; userId: string }>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { invoiceId, userId } = req.query;
    const { id, role } = res.locals;
    try {
        if (!invoiceId) throw createHttpError(400, "invoiceId required");
        if (!id) throw createHttpError(401, "User not authenitcated");

        const user = await User.findById(userId).lean().exec();
        if (!user) throw createHttpError(404, "User not found");

        const invoice = await Invoice.findById(invoiceId).lean().exec();
        if (!invoice) throw createHttpError(404, "Invoice not found");
        if (invoice.user.id.toString() !== userId) throw createHttpError(400, "Invalid userId-invoiceId pair");

        if (role === ROLES.user) {
            if (user._id.toString() !== id) throw createHttpError(400, "User not found");
            if (invoice.user.id.toString() !== id) throw createHttpError(400, "Invoice not found");
        }
        else if (role === ROLES.reader) {
            if (user.role === ROLES.owner || user.role === ROLES.reader && user._id.toString() !== id) throw createHttpError(400, "User not found");
            if (invoice.user.role === ROLES.owner || invoice.user.role === ROLES.reader && invoice.user.id.toString() !== id) throw createHttpError(400, "Invoice not found");
        }

        // PDF creation:
        const printer = new PdfPrinter(pdfmakeFonts);
        const docDefinition = createInvoicePDF(user, invoice);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(res);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");
        // End the response after piping the PDF
        pdfDoc.end();
    }
    catch (error) {
        next(error);
    }
};

export const getInvoicePDFtoEmail = async (req: Request<unknown, unknown, unknown, { invoiceId: string; userId: string }>, res: Response<unknown, ResLocals>, next: NextFunction) => {
    const { invoiceId, userId } = req.query;
    const { id, role } = res.locals;
    try {
        if (!invoiceId) throw createHttpError(400, "invoiceId required");
        if (!id) throw createHttpError(401, "User not authenitcated");

        const user = await User.findById(userId).lean().exec();
        if (!user) throw createHttpError(404, "User not found");
        // For fake users:
        if (!validateEmail(user.email)) throw createHttpError(400, "Invalid email");

        const invoice = await Invoice.findById(invoiceId).lean().exec();
        if (!invoice) throw createHttpError(404, "Invoice not found");
        if (invoice.user.id.toString() !== userId) throw createHttpError(400, "Invalid userId-invoiceId pair");

        if (role === ROLES.user) {
            if (user._id.toString() !== id) throw createHttpError(400, "User not found");
            if (invoice.user.id.toString() !== id) throw createHttpError(400, "Invoice not found");
        }
        else if (role === ROLES.reader) {
            if (user.role === ROLES.owner || user.role === ROLES.reader && user._id.toString() !== id) throw createHttpError(400, "User not found");
            if (invoice.user.role === ROLES.owner || invoice.user.role === ROLES.reader && invoice.user.id.toString() !== id) throw createHttpError(400, "Invoice not found");
        }

        const docDefinition = createInvoicePDF(user, invoice);

        const printer = new PdfPrinter(pdfmakeFonts);
        const pdfBuffer = await new Promise<Buffer>((resolve) => {
            const chunks: Uint8Array[] = [];
            const pdfDoc = printer.createPdfKitDocument(docDefinition);
            pdfDoc.on("data", (chunk) => chunks.push(chunk));
            pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
            pdfDoc.end();
        });

        // Convert PDF buffer to base64
        const pdfBase64 = pdfBuffer.toString("base64");

        const payload = {
            sender: {
                name: "Terio - Fake Invoices",
                email: env.EMAIL_USER
            },
            to: [{
                name: user.firstName,
                email: user.email
            }],
            subject: "PDF document of your invoice",
            textContent: "The PDF document you requested:",
            attachment: [
                {
                    content: pdfBase64,
                    name: `Invoice_${invoice._id.toString().substring(18)}.pdf`
                }
            ]
        };

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            headers: {
                "Content-Type": "application/json",
                "api-key": env.EMAIL_API_KEY,
                "Accept": "application/json"
            },
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (!response.ok) return res.status(400).json({ message: "Failed to send email" });

        res.status(200).json({ message: "PDF sent to email, check inbox/spam" });
    }
    catch (error) {
        next(error);
    }
};