import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../models/user.model.js";

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

  let newUser = await userModel.create({ name, username, email, password });

  return true;
};

export const authService = { registerUser };
