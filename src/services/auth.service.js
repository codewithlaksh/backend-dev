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

const loginUser = async (identifier, password) => {
  let errors = [];
  const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let user;

  if (identifier.match(usernameRegex)) {
    user = await userModel.findOne({ username: identifier }).select('+password');
  } else {
    user = await userModel.findOne({ email: identifier }).select('+password');
  }

  if (!user) {
    errors.push({ field: "body.identifier", message: "User not found" });
    throw new ApiError(404, "Validation failed", errors);
  }

  const result = await user.verifyPassword(password);

  if (!result) {
    errors.push({ field: "body.password", message: "Invalid password" });
    throw new ApiError(400, "Validation failed", errors);
  }

  /*
    access tokens -> session management, authorization of APIs
    refresh tokens -> rotate access token [, refresh token]
  */

  return {
    access_token: user.generateAccessToken(),
    refresh_token: user.generateRefreshToken(),
  };
};

export const authService = { registerUser, resendCode, verifyEmail, loginUser };
