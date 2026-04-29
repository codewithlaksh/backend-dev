import z from "zod";

export const registerSchema = z
  .object({
    name: z.string().nonempty({ error: "Name is required" }),
    username: z
      .string()
      .nonempty({ error: "Username is required" })
      .min(4, { error: "Username must contain atleast 4 characters" })
      .max(12, { error: "Username must contain atmost 12 characters" })
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/, {
        error: "Username must contain both alphabets & number",
      }),
    email: z
      .email({ error: "Invalid email" })
      .nonempty({ error: "Email is required" }),
    password: z
      .string()
      .nonempty({ error: "Password is required" })
      .min(8, { error: "Password must contain atleast 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
        error: "Password is weak",
      }),
    cpassword: z.string().nonempty({ error: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.cpassword, {
    error: "Passwords do not match",
    path: ["cpassword"],
  });
