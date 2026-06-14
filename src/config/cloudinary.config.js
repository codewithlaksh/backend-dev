import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';
import {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME} from "../constants.js";

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (localFilePath) => {
    if (!localFilePath) throw new Error("Please provide local path to file!");

    try {
        return await cloudinary.uploader.upload(
            localFilePath,
            {
                resource_type: "auto"
            }
        );
    } catch (error) {
        console.log("Error uploading file: " + error.message);
    } finally {
        fs.unlinkSync(localFilePath);
    }
}
