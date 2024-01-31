import express from "express";
import * as handlers from "../controllers/authController";

const router = express.Router();

router.post("/login", handlers.login);
router.post("/register", handlers.register);
router.get("/logout", handlers.logout);
router.get("/refresh", handlers.refresh);
router.get("/verify/:emailToken", handlers.verifyEmail); 

export default router;