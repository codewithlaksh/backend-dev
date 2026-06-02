import { parseAsync, ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate = (schema) => {
  return async (req, _res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return next(new ApiError(400, "Validation failed!", formattedErrors));
      }

      next(error);
    }
  };
};
