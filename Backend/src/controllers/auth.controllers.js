import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { db } from "../libs/database.js"
import { Role } from "../generated/prisma/index.js";

const register = async (req, res) => {
      const { name, username, email, password } = req.body;

      if ([name, username, email, password].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
      };

      try {
            const existingUser = await db.user.findUnique({
                  where: {
                        email,
                        username
                  }
            });

            if (existingUser) {
                  throw new ApiError(400, "User already exists");
            };

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await db.user.create({
                  data: {
                        name,
                        username,
                        email,
                        password: hashedPassword,
                        role: Role.USER
                  }
            });

            const { password: _password, ...createdUser } = user;

            if (!createdUser) {
                  throw new ApiError(400, "User not created");
            };

            const token = jwt.sign(
                  { id: user.id },
                  process.env.JWT_SECRET,
                  { expiresIn: "7d" }
            );

            const cookieOptions = {
                  httpOnly: true,
                  secure: process.env.NODE_ENV !== "development",
                  maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            };

            res.cookie("token", token, cookieOptions);

            res.status(201).json(
                  new ApiResponse(
                        201,
                        createdUser,
                        "User created successfully"
                  )
            )

      } catch (error) {
            throw new ApiError(500, error?.message || "Error creating user");
      }
};

const login = async (req, res) => {

};

const logout = async (req, res) => {

};

const check = async (req, res) => {

};

export {
      register,
      login,
      logout,
      check
};