import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res
      .status(err.statusCode)
      .json(new ApiResponse(err.statusCode, err.errors || null, err.message));
  } else {
    res
      .status(500)
      .json(new ApiResponse(500, null, err.message || "Something went wrong!"));
  }
};
