import express from "express";
import * as handlers from "../controllers/invoiceController";
import { verifyJWT } from "../middleware/verifyJWT";
import { verifyRoles, ROLES } from "../middleware/verifyRoles";
import { checkEnv } from "../middleware/checkDev";

const router = express.Router();

router.route("/create")
    .post(checkEnv, handlers.createInvoice);

router.use(verifyJWT);

router.get("/single", handlers.getInvoice);
router.get("/all", verifyRoles([ROLES.admin, ROLES.owner]), handlers.getAllInvoices);
router.get("/users-invoices", verifyRoles([ROLES.admin, ROLES.owner]), handlers.getUsersInvoices);
router.get("/my-invoices", handlers.getMyInvoices);

export default router;