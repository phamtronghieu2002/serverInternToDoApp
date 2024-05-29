import express from "express";
const router = express.Router();
import * as authController from "../controllers/authController";
import { veryfyUser } from "../middlewares/authMiddleware";
router.post("/register", authController.handleRegister);
router.post("/login", authController.handleLogin);


router.get("/profile",veryfyUser, authController.handeleGetProfile);
router.post("/refresh_token", authController.handle_refresh_token);
router.post("/logout", authController.handleLogout);
export default router;
