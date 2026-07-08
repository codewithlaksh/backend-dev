import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';
import {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME} from "../constants.js";
import {extractCloudinaryPublicId} from "../utils/extractCloudinaryPublicId.js";

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const CLOUDINARY_FOLDER_PREFIX = "SecureXBackend/";

const normalizeCloudinaryPrefix = (prefix) => {
    if (!prefix) throw new Error("Please provide folder prefix!");

    return `${CLOUDINARY_FOLDER_PREFIX}${prefix}`
        .replace(/\/+/g, "/")
        .replace(/\/$/, "");
};

export const uploadToCloudinary = async (localFilePath, folder) => {
    if (!localFilePath) throw new Error("Please provide local path to file!");
    const folderPath = `${CLOUDINARY_FOLDER_PREFIX}/${folder}`;
    try {
        return await cloudinary.uploader.upload(
            localFilePath,
            {
                folder: folderPath,
                resource_type: "auto"
            }
        );
    } catch (error) {
        console.log("Error uploading file: " + error.message);
    } finally {
        fs.unlinkSync(localFilePath);
    }
}

export const deleteFromCloudinary = async (url, resourceType = "image") => {
    if (!url) throw new Error("Please provide url!");

    try {
        const publicId = extractCloudinaryPublicId(url);
        return await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
    } catch (error) {
        console.log("Error deleting file from Cloudinary: " + error.message);
        throw error;
    }
};

export const deleteCloudinaryFolderByPrefix = async (prefix, resourceType = "image") => {
    const folderPrefix = normalizeCloudinaryPrefix(prefix);

    try {
        await cloudinary.api.delete_resources_by_prefix(folderPrefix, {
            resource_type: resourceType,
        });

        return await cloudinary.api.delete_folder(folderPrefix);
    } catch (error) {
        console.log("Error deleting Cloudinary folder by prefix: " + error.message);
        throw error;
    }
};