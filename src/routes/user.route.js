import {Router} from "express";
import {checkAuth} from "../middlewares/check-auth.middleware.js";
import {userController} from "../controllers/user.controller.js";
const router = Router();

router.route('/me').get(checkAuth, userController.me)

export {router as userRouter};