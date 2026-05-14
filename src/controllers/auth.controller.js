import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, username, email, password, cpassword } = req.body;
  const result = await authService.registerUser(
    name,
    username,
    email,
    password,
    cpassword,
  );

  res
    .status(201)
    .json(new ApiResponse(201, null, "Verification code sent to email!"));
});

const resendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const result = await authService.resendCode(email);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Verification code resent to email!"));
});

const verifyEmail = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;
  const result = await authService.verifyEmail(email, code);

  res.status(200).json(new ApiResponse(200, null, "Verification successful!"));
});

export const authController = { registerUser, resendCode, verifyEmail };
