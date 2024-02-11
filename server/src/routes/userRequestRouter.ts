import express from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import * as handlers from "../controllers/userRequestController";
import { verifyRoles, ROLES } from "../middleware/verifyRoles";

const router = express.Router();

router.use(verifyJWT);
router.post("/", verifyRoles([ROLES.reader, ROLES.user]), handlers.createUserRequest);
router.delete("/", verifyRoles([ROLES.reader, ROLES.user]), handlers.deleteRequest);
router.patch("/", verifyRoles([ROLES.owner]), handlers.updateRequest);
router.get("/all-requests", verifyRoles([ROLES.owner]), handlers.getRequests);
router.get("/my-requests", verifyRoles([ROLES.user, ROLES.reader]), handlers.getMyRequests);


export default router;