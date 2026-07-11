import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import { registerValidator } from "../validators/auth.validator.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 */
authRouter.post("/register", registerValidator, register);

export default authRouter;
