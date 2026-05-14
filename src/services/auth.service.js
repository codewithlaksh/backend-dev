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

const resendCode = async (email) => {
  let errors = [];
  let user = await userModel.findOne({
    email,
  });

  if (!user) throw new ApiError(404, "User not found");

  if (user.isVerified) throw new ApiError(400, "User already verified");

  const verifyCode = generateCode();
  const verifyCodeExpiry = new Date(Date.now() + 3 * 60 * 60 * 1000);

  await user.updateOne({
    $set: { verifyCode, verifyCodeExpiry },
  });

  try {
    const result = await sendVerificationEmail(
      user.username,
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

const verifyEmail = async (email, code) => {
  let errors = [];
  let user = await userModel.findOne({
    email,
  });

  if (!user) throw new ApiError(404, "User not found");

  if (user.isVerified) throw new ApiError(400, "User already verified");

  const codeHasExpired = new Date() > user.verifyCodeExpiry;

  if (codeHasExpired) {
    errors.push({ field: "body.code", message: "Code has expired" });
    throw new ApiError(400, "Validation failed", errors);
  }

  if (code !== user.verifyCode) {
    errors.push({ field: "body.code", message: "Code is invalid" });
    throw new ApiError(400, "Validation failed", errors);
  }

  await user.updateOne({
    $set: { isVerified: true },
    $unset: { verifyCode: 1, verifyCodeExpiry: 1 },
  });

  return true;
};

export const authService = { registerUser, resendCode, verifyEmail };
