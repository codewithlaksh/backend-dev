import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../models/user.model.js";
import { generateCode } from "../lib/generate-code.js";
import { sendVerificationEmail } from "../mails/send-verification-email.js";

const registerUser = async (name, username, email, password, cpassword) => {
  let errors = [];
  let user = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (user) {
    if (user.username === username)
      errors.push({
        field: "body.username",
        message: "Username is already taken",
      });
    else if (user.email === email)
      errors.push({
        field: "body.email",
        message: "Email is already taken",
      });
    throw new ApiError(400, "Validation failed", errors);
  }

  const verifyCode = generateCode();
  const verifyCodeExpiry = new Date(Date.now() + 3 * 60 * 60 * 1000);

  let newUser = new userModel({
    name,
    username,
    email,
    password,
    verifyCode,
    verifyCodeExpiry,
  });
  await newUser.save();

  try {
    const result = await sendVerificationEmail(
      username,
      email,
      "Email Verification Code - SecureX",
      verifyCode,
    );

    return true;
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Failed to send verification code!",
    );
  }
};

export const authService = { registerUser };
