import jwt from "jsonwebtoken";
import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateNonce, generateState } from "../utils/authUtils.js";
import { db } from "../libs/database.js";


const getJwksClient = () => {
      return getJwksClient({
            jwkUri: process.env.GOOGLE_JWKS_URL,
            cache: true,
            ratelimit: true
      })
};

const getSigningKey = async (kid) => {
      const client = getJwksClient();
      return new Promise((resolve, reject) => {
            client.getSigningKey(kid, (error, key) => {
                  if (error) {
                        console.error("Error getting signing key:", error);
                        return reject(error);
                  }
                  const signingKey = key.getPublicKey();
                  resolve(signingKey);
            });
      });
};

const verifyGoogleToken = async (token) => {
      try {
            const decoded = jwt.decode(token, { complete: true });
            if (!decoded) {
                  throw new ApiError(400, "Invalid token");
            }

            const kid = decoded.header.kid;
            const signingKey = await getSigningKey(kid);

            const verifiedToken = jwt.verify(token, signingKey, {
                  algorithms: ["RS256"],
                  audience: process.env.GOOGLE_CLIENT_ID,
            });
            return verifiedToken;
      } catch (error) {
            console.log("Error verifying token:", error);
            throw new ApiError(400, "Token verification failed");
      }
};

const googleLogin = (req, res) => {
      const state = generateState();
      const nonce = generateNonce();

      res.cookie("oauth_state", state, {
            httpOnly: true,
            maxAge: 600000,
            sameSite: "lax",
      });
      res.cookie("oauth_nonce", nonce, {
            httpOnly: true,
            maxAge: 600000,
            sameSite: "lax",
      });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile%20openid&state=${state}&nonce=${nonce}`;

      res.redirect(googleAuthUrl);
};

const googleCallback = async (req, res) => {
      try {
            const { code, state } = req.query;
            const savedState = req.cookies.oauth_state;
            const savedNonce = req.cookies.oauth_nonce;

            res.clearCookie("oauth_state");
            res.clearCookie("oauth_nonce");

            if (!state || !savedState || state !== savedState) {
                  throw new ApiError(400, "Invalid state parameter");
            }

            const tokenResponse = await axios.post(
                  "https://oauth2.googleapis.com/token",
                  null,
                  {
                        params: {
                              client_id: process.env.GOOGLE_CLIENT_ID,
                              client_secret: process.env.GOOGLE_CLIENT_SECRET,
                              redirect_uri: process.env.GOOGLE_REDIRECT_URI,
                              code,
                              grant_type: "authorization_code",
                        },
                  }
            );

            const { id_token, access_token, refresh_token } = tokenResponse.data;
            if (!id_token) {
                  throw new ApiError(400, "Invalid ID token");
            }

            // Verify the ID token
            const decodedToken = await verifyGoogleToken(id_token);
            if (!decodedToken) {
                  throw new ApiError(400, "Invalid ID token");
            }

            // Check if the nonce matches the one stored in the cookie
            if (!decodedToken.nonce || decodedToken.nonce !== savedNonce) {
                  throw new ApiError(400, "Invalid nonce parameter");
            }

            // Find or create the user in the database
            let user = await db.user.findUnique({ googleId: decodedToken.sub });
            if (!user) {
                  user = await db.user.create({
                        googleId: decodedToken.sub,
                        email: decodedToken.email,
                        name: decodedToken.name,
                        refreshToken: refresh_token || null,
                  });
            } else if (refresh_token) {
                  user.refreshToken = refresh_token;
                  await user.save();
            }

            // Generate our own JWT token for the user
            const accessToken = jwt.sign(
                  { userId: user.id, email: user.email },
                  process.env.JWT_SECRET,
                  { expiresIn: "1h" }
            );

            // Set the JWT token in a cookie
            res.cookie("access_token", accessToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  maxAge: 3600000,
            });

            res.status(201).json(
                  new ApiResponse(
                        201,
                        { user: { id: user.id, email: user.email, name: user.name } },
                        "Login successful"
                  )
            )
      } catch (error) {
            console.error(
                  "OAuth Callback Error:",
                  error.response?.data || error.message
            );
            throw new ApiError(500, "Authentication failed");
      }
};