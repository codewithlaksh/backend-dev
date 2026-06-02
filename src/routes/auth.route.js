import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  registerValidator,
  resendCodeValidator,
  verifyEmailValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import {checkAuth} from "../middlewares/check-auth.middleware.js";

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

router.route("/login").post(validate(loginValidator), authController.loginUser);

router
    .route("/refresh")
    .post(authController.refreshAccessToken)

router
    .route("/logout")
    .post(checkAuth, authController.logoutUser);

export { router as authRouter };
