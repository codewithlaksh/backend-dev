import {asyncHandler} from "../utils/asyncHandler.js";
import {userService} from "../services/user.service.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const me = asyncHandler(
    async (req, res) => {
        const result = await userService.me(req.user.id);

        return res
            .status(200)
            .json(new ApiResponse(200, result, "User profile fetched!"))
    }
)

const createProfile = asyncHandler((
    async (req, res) => {
        const data = {
            phone: req.body.phone,
            socialLinks: JSON.parse(req.body.socialLinks),
            bio: req.body.bio
        }
        const localFilePath = req.file?.path;

        const result = await userService.createProfile(req.user.id, data, localFilePath);

        return res
            .status(201)
            .json(new ApiResponse(201, result, "User profile created!"))
    }
))

const updateProfile = asyncHandler((
    async (req, res) => {
        const data = {
            phone: req.body.phone,
            socialLinks: JSON.parse(req.body.socialLinks),
            bio: req.body.bio
        }
        const localFilePath = req.file?.path;

        const result = await userService.updateProfile(req.user.id, req.query.profileId, data, localFilePath);

        return res
            .status(200)
            .json(new ApiResponse(200, result, "User profile created!"))
    }
))

const deleteProfile = asyncHandler(
    async (req, res) => {
        const userId = req.user.id;
        const profileId = req.query.profileId;

        const result = await userService.deleteProfile(userId, profileId);

        return res
            .status(204)
            .json(new ApiResponse(204, null, "User profile deleted!"))
    }
)

// TASK: Complete this controller
// const updatePassword = asyncHandler(
//     async (req, res) => {}
// )

export const userController = { me, createProfile, updateProfile, deleteProfile };