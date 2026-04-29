import z from "zod";
import { registerSchema } from "./schemas/auth.schema.js";

export const registerValidator = z.object({
  body: registerSchema,
});
