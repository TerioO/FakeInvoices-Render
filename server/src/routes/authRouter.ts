import express from "express";
import * as handlers from "../controllers/authController";

const router = express.Router();

router.route("/login")
    .post(handlers.login);

router.route("/register")
    .post(handlers.register);

router.route("/logout")
    .get(handlers.logout);

router.route("/refresh")
    .get(handlers.refresh);

export default router;