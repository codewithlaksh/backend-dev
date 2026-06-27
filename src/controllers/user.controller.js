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

export const userController = { me };