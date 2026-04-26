import "dotenv/config";

import express from "express";
import { connectDB } from "./src/lib/db.js";
const app = express();
const port = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.get("/api/v1/hello", (req, res) => {
      res.status(200).json({
        message: "Hello World!",
      });
    });

    app.listen(port, () => {
      console.log(`Auth backend listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(`Error: ${error.message || "Something went wrong!"}`);
    process.exit(1);
  });
