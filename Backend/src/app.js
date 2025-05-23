import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes Imports
import healthcheckRoute from "./routes/healthcheck.routes.js";
import authRoute from "./routes/auth.routes.js";
import problemRoute from "./routes/problem.routes.js";
import executeCodeRoute from "./routes/executeCode.routes.js";
import submissionRoute from "./routes/submission.routes.js";

app.use("/api/v1/healthcheck", healthcheckRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/problem", problemRoute);
app.use("/api/v1/execute-code", executeCodeRoute);
app.use("/api/v1/submission", submissionRoute);

export default app;