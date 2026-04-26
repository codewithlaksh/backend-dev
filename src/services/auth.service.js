import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../models/user.model.js";

const registerUser = async (name, username, email, password, cpassword) => {
  if ([name, username, email, password, cpassword].some((c) => c === ""))
    throw new ApiError(400, "All fields are required!");

  let newUser = await userModel.create({ name, username, email, password });

  return true;
};

export const authService = { registerUser };
