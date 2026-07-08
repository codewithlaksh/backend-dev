import {profileModel} from "../models/profile.model.js";
import {userModel} from "../models/user.model.js";
import mongoose from "mongoose";
import {ApiError} from "../utils/ApiError.js";
import {deleteCloudinaryFolderByPrefix, deleteFromCloudinary, uploadToCloudinary} from "../config/cloudinary.config.js";

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

    const profileExists = await profileModel.exists({user: userId});
    if (profileExists) throw new ApiError(409, "User profile already exists!", null);

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

const updateProfile = async (userId, profileId, data, localFilePath) => {
    if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user id!", null);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const exists = await userModel.exists({_id: userObjectId})

    if (!exists) throw new ApiError(404, "User not found!", null);

    if (!mongoose.isValidObjectId(profileId)) throw new ApiError(400, "Invalid profile id!", null);

    let profile = await profileModel.findById(profileId);
    if (!profile) throw new ApiError(404, "Profile not found!", null);

    if (profile.user.toString() !== userId) throw new ApiError(403, "You are not allowed to update this profile!", null);

    profile.phone = data.phone;
    profile.socialLinks = data.socialLinks;
    profile.bio = data.bio;

    let oldProfilePicture = profile.avatar;

    if (localFilePath) {
        try {
            if (oldProfilePicture) await deleteFromCloudinary(oldProfilePicture);
            const uploadResult = await uploadToCloudinary(localFilePath, `avatars/${userId}/`);

            if (uploadResult) profile.avatar = uploadResult.secure_url;
        } catch (error) {
            throw new ApiError(500, "Avatar update failed!");
        }
    }

    await profile.save();

    return profile;
}

const deleteProfile = async (userId, profileId) => {
    if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user id!", null);

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const exists = await userModel.exists({_id: userObjectId})

    if (!exists) throw new ApiError(404, "User not found!", null);

    if (!mongoose.isValidObjectId(profileId)) throw new ApiError(400, "Invalid profile id!", null);

    let profile = await profileModel.findById(profileId);
    if (!profile) throw new ApiError(404, "Profile not found!", null);

    if (profile.user.toString() !== userId) throw new ApiError(403, "You are not allowed to delete this profile!", null);

    await deleteCloudinaryFolderByPrefix(`avatars/${userId}`);

    await profile.deleteOne();
    return true;
}

// TASK: Complete this service
// const updatePassword = async (userId) => {}

export const userService = { me, createProfile, updateProfile, deleteProfile };
