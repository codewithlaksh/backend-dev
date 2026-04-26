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
    .json(new ApiResponse(201, null, "User created successfully!"));
});

export const authController = { registerUser };
