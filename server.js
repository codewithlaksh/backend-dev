import "dotenv/config";

import express from "express";
const app = express();
const port = process.env.PORT || 8080;

app.get("/api/v1/hello", (req, res) => {
  res.status(200).json({
    message: "Hello World!",
  });
});

app.listen(port, () => {
  console.log(`Auth backend listening on port ${port}`);
});
