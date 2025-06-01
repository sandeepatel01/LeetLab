import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const corsOptions = {
      origin: process.env.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes Imports
import healthcheckRoute from "./routes/healthcheck.routes.js";
import authRoute from "./routes/auth.routes.js";
import problemRoute from "./routes/problem.routes.js";
import executeCodeRoute from "./routes/executeCode.routes.js";
import submissionRoute from "./routes/submission.routes.js";
import playlistRoute from "./routes/playlist.routes.js";

app.use("/api/v1/healthcheck", healthcheckRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/problem", problemRoute);
app.use("/api/v1/execute-code", executeCodeRoute);
app.use("/api/v1/submission", submissionRoute);
app.use("/api/v1/playlist", playlistRoute);

export default app;