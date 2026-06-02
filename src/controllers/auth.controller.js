import { authService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NODE_ENV } from "../constants.js";
import {ApiError} from "../utils/ApiError.js";

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

const loginUser = asyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body;
  const { access_token, refresh_token } = await authService.loginUser(
    identifier,
    password,
  );

  res.cookie("refresh_token", refresh_token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: NODE_ENV === "production",
    httpOnly: true,
  });

  res
    .status(200)
    .json(new ApiResponse(200, { access_token }, "Logged in successfully!"));
});

const refreshAccessToken = asyncHandler(
    async (req, res, next) => {
      const refresh_token = req.cookies['refresh_token'];

      if (!refresh_token) throw new ApiError(401, "Unauthorized access!");

      const result = await authService.refreshAccessToken(refresh_token);

      res
          .status(200)
          .json(new ApiResponse(200, {access_token: result}, "Refreshed access token"));
    }
);

const logoutUser = asyncHandler(
    async (req, res, next) => {
      const result = authService.logoutUser(req, res);

      res
          .status(200)
          .json(new ApiResponse(200, null, "Logged out successfully"));
    }
)

export const authController = {
  registerUser,
  resendCode,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  logoutUser
};
