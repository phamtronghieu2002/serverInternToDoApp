import express from "express";
const router = express.Router();
import * as authController from "../controllers/authController";

router.post("/register", authController.handleRegister);
router.post("/login", authController.handleLogin);

export default router;
