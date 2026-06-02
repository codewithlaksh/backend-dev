import jwt from "jsonwebtoken";
import {ApiError} from "../utils/ApiError.js";
import {ACCESS_TOKEN_SECRET} from "../constants.js";

export const checkAuth = (req, res, next) => {
    const headers = req.headers;

    if (!headers['authorization']) {
        throw new ApiError(401, "Unauthorized access!");
    } else {
        const [scheme, access_token] = headers['authorization'].split(' ');
        if (scheme !== 'Bearer' || !access_token) {
            throw new ApiError(401, "Unauthorized access!");
        }

        try {
            const decoded = jwt.verify(access_token, ACCESS_TOKEN_SECRET);
            req.user = {id: decoded.id, username: decoded.username};

            next();
        } catch (error) {
            console.log(`Error: ${error.message}`)
            throw new ApiError(401, "Invalid or expired token");
        }
    }
}