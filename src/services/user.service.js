import {profileModel} from "../models/profile.model.js";
import {userModel} from "../models/user.model.js";
import mongoose from "mongoose";
import {ApiError} from "../utils/ApiError.js";
import {uploadToCloudinary} from "../config/cloudinary.config.js";

const me = async (userId) => {
    if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user id!", null);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const exists = await userModel.exists({_id: userObjectId})

    if (!exists) throw new ApiError(404, "User not found!", null);

    const profile = await profileModel.findOne({user: userId}).populate('user');

    if (!profile) throw new ApiError(404, "Profile not found!", null);

    return profile;
}

const createProfile = async (userId, data, localFilePath) => {
    if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user id!", null);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const exists = await userModel.exists({_id: userObjectId})

    if (!exists) throw new ApiError(404, "User not found!", null);

    let profile = new profileModel({
        user: userId,
        ...data
    });

    if (localFilePath) {
        try {
            const uploadResult = await uploadToCloudinary(localFilePath, `avatars/${userId}/`);

            if (uploadResult) profile.avatar = uploadResult.secure_url;
        } catch (error) {
            throw new ApiError(500, "Avatar upload failed!");
        }
    }

    await profile.save();

    return profile;
}

export const userService = { me, createProfile };
