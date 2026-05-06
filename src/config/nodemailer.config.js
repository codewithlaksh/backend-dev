import nodemailer from "nodemailer";
import {
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_USER,
  NODEMAILER_PASS,
} from "../constants.js";

if (
  !NODEMAILER_HOST ||
  !NODEMAILER_PORT ||
  !NODEMAILER_USER ||
  !NODEMAILER_PASS
)
  throw new Error("Nodemailer missing params!");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: NODEMAILER_HOST,
  port: +NODEMAILER_PORT,
  auth: {
    user: NODEMAILER_USER,
    pass: NODEMAILER_PASS,
  },
});

export { transporter };
