import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    phone: {
      type: String,
    },
    socialLinks: [
      {
        name: String,
        website: String,
      },
    ],
    bio: {
      type: String,
      default: "No bio",
    },
    avatar: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const profileModel = mongoose.model("Profile", profileSchema);
