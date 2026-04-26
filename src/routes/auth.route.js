import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(authController.registerUser);

export { router as authRouter };
