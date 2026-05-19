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

export const resendCodeSchema = z.object({
  email: z
    .email({ error: "Invalid email" })
    .nonempty({ error: "Email is required" }),
});

export const verifyEmailSchema = z.object({
  email: z
    .email({ error: "Invalid email" })
    .nonempty({ error: "Email is required" }),
  code: z.string().nonempty({ error: "Code is required" }),
});

export const loginSchema = z
  .object({
    identifier: z.string().nonempty({ error: "Identifier is required" }),
    password: z.string().nonempty({ error: "Password is required" }),
  })
  .refine(
    (data) => {
      const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      return (
        data.identifier.match(usernameRegex) ||
        data.identifier.match(emailRegex)
      );
    },
    {
      error: "Identifier is invalid",
      path: ["identifier"],
    },
  );
