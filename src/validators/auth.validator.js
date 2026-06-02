import z from "zod";
import {
  registerSchema,
  resendCodeSchema,
  verifyEmailSchema,
  loginSchema,
} from "./schemas/auth.schema.js";

export const registerValidator = z.object({
  body: registerSchema,
});

export const resendCodeValidator = z.object({
  body: resendCodeSchema,
});

export const verifyEmailValidator = z.object({
  body: verifyEmailSchema,
});

export const loginValidator = z.object({
  body: loginSchema,
});
