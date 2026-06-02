import mongoose, { Schema } from "mongoose";
import argon2 from "argon2"; // hashing passwords & verify hashed passwords
import jwt from "jsonwebtoken"; // sign and verify auth tokens
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      minLength: [4, "Username must contain atleast 4 characters"],
      maxLength: [12, "Username must contain atmost 12 characters"],
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    verifyCode: {
      type: String,
    },
    verifyCodeExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await argon2.hash(this.password);
});

// Custom methods on schema
userSchema.method({
  async verifyPassword(candidatePassword) {
    if (!this.password) {
      throw new Error("Password field not selected - use .select('+password')");
    }
    const result = await argon2.verify(this.password, candidatePassword);
    return result;
  },

  generateAccessToken() {
    const payload = {
      id: this._id.toString(),
      username: this.username,
    };

    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
  },

  generateRefreshToken() {
    const payload = {
      id: this._id.toString(),
    };

    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
  },
});

export const userModel = mongoose.model("User", userSchema);
