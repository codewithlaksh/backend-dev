import crypto from "node:crypto";

export const generateCode = () =>
  crypto.randomBytes(3).toString("hex").toUpperCase();
