import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes Imports
import healthcheckRoute from "./routes/healthcheck.routes.js";
import authRoute from "./routes/auth.routes.js";

app.use("/api/v1/healthcheck", healthcheckRoute);
app.use("/api/v1/auth", authRoute);


export default app;