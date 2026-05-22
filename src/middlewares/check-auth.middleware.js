import jwt from "jsonwebtoken";
import {ApiError} from "../utils/ApiError.js";
import {ACCESS_TOKEN_SECRET} from "../constants.js";

export const checkAuth = (req, res, next) => {
    const headers = req.headers;

    if (!headers['Authorization']) {
        throw new ApiError(401, "Unauthorized access!");
    } else {
        const access_token = headers['Authorization'].split('Bearer ');

        try {
            const decoded = jwt.verify(access_token, ACCESS_TOKEN_SECRET);
            req.user = {id: decoded.id, username: decoded.username};

            next();
        } catch (error) {
            console.log(`Error: ${error.message}`)
            throw new ApiError(500, "Invalid or expired token");
        }
    }
}