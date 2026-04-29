import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerValidator } from "../validators/auth.validator.js";

const router = Router();

router
  .route("/register")
  .post(validate(registerValidator), authController.registerUser);

export { router as authRouter };
