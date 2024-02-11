import express from "express";
import * as handlers from "../controllers/userController";
import { verifyJWT } from "../middleware/verifyJWT";
import { verifyRoles, ROLES } from "../middleware/verifyRoles";
import { checkEnv } from "../middleware/checkEnv";

const router = express.Router();

router.route("/allUsers")
    .get(checkEnv, handlers.getAllUsers);

router.use(verifyJWT);

router.get("/all-users-owner", verifyRoles([ROLES.owner]), handlers.getAllUsers);
router.get("/all-users", verifyRoles([ROLES.reader, ROLES.owner]), handlers.getUsers);
router.get("/single-user", handlers.getUser);
router.get("/profile", handlers.getProfile);

router.patch("/update-user", verifyRoles([ROLES.owner]), handlers.updateUser);
router.patch("/update-my-account", handlers.updateMyAccount);

export default router;