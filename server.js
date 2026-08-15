import "dotenv/config";

import express from "express";
import { connectDB } from "./src/lib/db.js";
import { errorHandler } from "./src/middlewares/error-handler.middleware.js";
import { authRouter } from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";
import {userRouter} from "./src/routes/user.route.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.use(cors({
      origin: process.env.FRONTEND_ORIGIN,
      credentials: true
    }));  // * (default) --> allow all origins to request

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser());

    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/users", userRouter);

    // Global error handler
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Auth backend listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(`Error: ${error.message || "Something went wrong!"}`);
    process.exit(1);
  });
