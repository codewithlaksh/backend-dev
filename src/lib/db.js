import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "../constants.js";

export const connectDB = async () => {
  if (!MONGODB_URI) throw new Error("Error: Please provide MongoDB uri!");
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    if (NODE_ENV !== "production")
      console.log(
        `Connected to MongoDB !! Host: ${connection.connections[0].host}`,
      );
  } catch (error) {
    throw error;
  }
};
