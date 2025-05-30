import jwt from "jsonwebtoken";
import { User } from "../model/User.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "Please login first",
                success: false
            });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userID;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({
                message: "User not found",
                success: false
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Authentication failed",
            success: false,
            error: error.message
        });
    }
};



export { isAuthenticated };
