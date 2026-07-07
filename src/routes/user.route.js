import {Router} from "express";
import {checkAuth} from "../middlewares/check-auth.middleware.js";
import {userController} from "../controllers/user.controller.js";
import {validate} from "../middlewares/validate.middleware.js";
import {createProfileValidator, updateProfileValidator} from "../validators/profile.validator.js";
import {upload} from "../middlewares/multer.middleware.js";
const router = Router();

router.route('/me').get(checkAuth, userController.me);
router.route('/')
    .post(checkAuth, upload.single('avatar'), validate(createProfileValidator), userController.createProfile)
    .patch(checkAuth, upload.single('avatar'), validate(updateProfileValidator), userController.updateProfile)

export {router as userRouter};