import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { db } from "../libs/database.js"
import { Role } from "../generated/prisma/index.js";
import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import { OAUTH_EXCHANGE_EXPIRY } from "../constants.js";
import { google } from "../libs/oAuth/google.js";
import { createUserWithOAuth, getUserWithOAuthId, linkUserWithOAuth } from "../services/auth.services.js";

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
                  sameSite: "strict",
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
      const { email, password } = req.body;

      if ([email, password].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
      };

      try {
            const user = await db.user.findUnique({
                  where: {
                        email
                  }
            });

            const { password: _password, ...createdUser } = user;

            if (!createdUser) {
                  throw new ApiError(400, "User not created");
            };

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                  throw new ApiError(401, "Invalid credentials");
            };

            const token = jwt.sign(
                  { id: user.id },
                  process.env.JWT_SECRET,
                  { expiresIn: "7d" }
            );

            const cookieOptions = {
                  httpOnly: true,
                  sameSite: "strict",
                  secure: process.env.NODE_ENV !== "development",
                  maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            };

            res.cookie("token", token, cookieOptions);

            res.status(200).json(
                  new ApiResponse(
                        200,
                        createdUser,
                        "User logged in successfully"
                  )
            )

      } catch (error) {
            throw new ApiError(500, error?.message || "Error logging in user");
      }
};

const logout = async (req, res) => {
      try {
            const cookieOptions = {
                  httpOnly: true,
                  sameSite: "strict",
                  secure: process.env.NODE_ENV !== "development",
            };
            res.clearCookie("jwt", cookieOptions);

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "User logged out successfully"
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error logging out user");
      }
};

const getMe = async (req, res) => {
      try {
            res.status(200).json(
                  new ApiResponse(
                        200,
                        { user: req.user },
                        "User fetched successfully"
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error fetching user");
      }
};

const getAllProblemsSolvedByUser = async (req, res) => {
      try {
            const problems = await db.problem.findMany({
                  where: {
                        solvedBy: {
                              some: {
                                    userId: req.user.id
                              }
                        }
                  },
                  include: {
                        solvedBy: {
                              where: {
                                    userId: req.user.id
                              }
                        }
                  }
            });

            if (!problems) {
                  throw new ApiError(404, "User not Solved any problem");
            };

            res.status(200).json(
                  new ApiResponse(
                        200,
                        "Problems fetched successfully",
                        problems
                  )
            )
      } catch (error) {
            throw new ApiError(500, error?.message || "Error fetching problems");
      }
};

const loginWithGoogle = async (req, res) => {
      if (!req.user) {
            throw new ApiError(400, "User not found");
      };

      const state = generateState();
      const codeVerifier = generateCodeVerifier();
      const url = google.createAuthorizationURL(state, codeVerifier, [
            "openid",
            "email",
            "profile"
      ]);

      const cookieConfig = {
            httpOnly: true,
            secure: true,
            maxAge: OAUTH_EXCHANGE_EXPIRY,
            sameSite: "lax"
      }

      res.cookie("oauth_state", state, cookieConfig);
      res.cookie("oauth_code_verifier", codeVerifier, cookieConfig);

      res.redirect(url.toString());
};

const getGoogleLoginCallback = async (req, res) => {
      const { state, code } = req.query;
      console.log("State: ", state);
      console.log("Code: ", code);

      const {
            google_oauth_state: storedState,
            google_code_verifier: codeVerifier
      } = req.cookies;

      if (!code || !state || !storedState || !codeVerifier || state !== storedState) {
            throw new ApiError(400, "Couldn't login with google because of invalid login attempt. Please try again");
            return res.redirect("/login");
      };

      let tokens;
      try {
            tokens = await google.validateAuthorizationCode(code, codeVerifier);
      } catch (error) {
            throw new ApiError(400, "Couldn't login with google because of invalid login attempt. Please try again");
            return res.redirect("/login");
      };

      console.log("Google tokens: ", tokens);

      const claims = decodeIdToken(tokens.idToken());
      const { sub: googleUserId, email, name } = claims;

      let user = await getUserWithOAuthId({
            email,
            provider: "google",
      });

      if (user && !user.providerId) {
            await linkUserWithOAuth({
                  userId: user.id,
                  provider: "google",
                  providerId: googleUserId
            })
      }

      if (!user) {
            user = await createUserWithOAuth({
                  name,
                  email,
                  provider: "google",
                  providerId: googleUserId
            })
      }

      
}

export {
      register,
      login,
      logout,
      getMe,
      getAllProblemsSolvedByUser,
      loginWithGoogle,
      getGoogleLoginCallback
};