import express from "express";
import * as handlers from "../controllers/invoiceController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.use(verifyJWT);

router.get("/single", handlers.getInvoice);
router.get("/all", handlers.getAllInvoices);
router.get("/users-invoices", handlers.getUsersInvoices);
router.get("/my-invoices", handlers.getMyInvoices);
router.get("/invoice-pdf", handlers.getInvoicePDF);

export default router;