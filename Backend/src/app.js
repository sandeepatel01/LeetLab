import express from "express";

const app = express();

// Routes Imports
import healthcheckRoute from "./routes/healthcheck.routes.js";
import authRoute from "./routes/auth.routes.js";

app.use("/api/v1/healthcheck", healthcheckRoute);
app.use("/api/v1/auth", authRoute);


export default app;