import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { db } from "../libs/database.js";

export const authMiddleware = async (req, res, next) => {
      try {
            const token = req.cookies.token;
            if (!token) {
                  throw new ApiError(401, "Unauthorized - No token found");
            };

            let decoded;

            try {
                  decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                  throw new ApiError(401, "Unauthorized - Invalid token");
            };

            const user = await db.user.findUnique({
                  where: {
                        id: decoded.id
                  },
                  select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        avatar: true,
                        role: true
                  }
            });

            if (!user) {
                  throw new ApiError(401, "Unauthorized - User not found");
            };

            req.user = user;
            next();

      } catch (error) {
            throw new ApiError(401, error?.message || "Error authenticating user");
      }
};

export const isAdmin = async (req, res, next) => {
      try {
            const userId = req.user.id;
            const user = await db.user.findUnique({
                  where: {
                        id: userId
                  },
                  select: {
                        role: true
                  }
            })

            if (!user || user.role !== "ADMIN") {
                  throw new ApiError(403, "This is protected route for admins only");
            }

            next();
      } catch (error) {
            throw new ApiError(403, error?.message || "Admin Role Can't be Verified");
      }
}