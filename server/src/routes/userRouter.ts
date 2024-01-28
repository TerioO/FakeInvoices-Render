import express from "express";
import * as handlers from "../controllers/userController";
import { verifyJWT } from "../middleware/verifyJWT";
import { verifyRoles, ROLES } from "../middleware/verifyRoles";
import { checkEnv } from "../middleware/checkDev";

const router = express.Router();

router.route("/allUsers")
    .get(checkEnv, handlers.getAllUsers);

router.use(verifyJWT);

router.get("/all-users-owner", verifyRoles([ROLES.owner]), handlers.getAllUsers);
router.get("/all-users", verifyRoles([ROLES.admin, ROLES.owner]), handlers.getUsers);
router.get("/single-user", handlers.getUser); // Role verification done in req handler bcs a "USER" should be able to get this.
router.get("/profile", handlers.getProfile);


export default router;