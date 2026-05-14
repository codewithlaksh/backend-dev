import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerValidator,
  resendCodeValidator,
  verifyEmailValidator,
} from "../validators/auth.validator.js";

const router = Router();

router
  .route("/register")
  .post(validate(registerValidator), authController.registerUser);

router
  .route("/resend-code")
  .patch(validate(resendCodeValidator), authController.resendCode);

router
  .route("/verify")
  .post(validate(verifyEmailValidator), authController.verifyEmail);

export { router as authRouter };
