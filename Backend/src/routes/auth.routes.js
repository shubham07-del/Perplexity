import { Router } from "express";
import { register, verifyEmail, login, getMe, logout, googleLogin } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const authRouter = Router();

/**
 * @route POST /api/auth/register
 */
authRouter.post("/register", registerValidator, register);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/login", loginValidator, login)
authRouter.post("/google", googleLogin)
authRouter.get("/get-me", authMiddleware,getMe)
authRouter.get("/logout", logout)

export default authRouter;
