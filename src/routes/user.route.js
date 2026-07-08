import fs from "fs";
import {Router} from "express";
import {checkAuth} from "../middlewares/check-auth.middleware.js";
import {userController} from "../controllers/user.controller.js";
import {validate} from "../middlewares/validate.middleware.js";
import {
    createProfileValidator,
    deleteProfileValidator,
    updateProfileValidator
} from "../validators/profile.validator.js";
import {upload} from "../middlewares/multer.middleware.js";
const router = Router();

const validateAndCleanupFile = (validator) => {
    const validateMiddleware = validate(validator);

    return (req, res, next) => {
        validateMiddleware(req, res, (error) => {
            if (error && req.file?.path && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            next(error);
        });
    };
};

router.route('/me').get(checkAuth, userController.me);
router.route('/')
    .post(checkAuth, upload.single('avatar'), validateAndCleanupFile(createProfileValidator), userController.createProfile)
    .patch(checkAuth, upload.single('avatar'), validateAndCleanupFile(updateProfileValidator), userController.updateProfile)
    .delete(checkAuth, validate(deleteProfileValidator), userController.deleteProfile)
// TASK: Complete this route
// router.route('/update-password').patch(
//     // create a validator for password update
//     userController.updatePassword
// )

export {router as userRouter};