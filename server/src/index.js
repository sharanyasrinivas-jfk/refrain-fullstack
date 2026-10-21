import "dotenv/config";
import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { requireAuth } from "./middleware/auth.js";
import checkins from "./routes/checkins.js";
import insights from "./routes/insights.js";
import { attachRealtime } from "./realtime.js";

const app = express();
app.use(helmet(), cors({ origin: process.env.CLIENT_ORIGIN }), express.json({ limit: "10kb" }));
app.use("/api", rateLimit({ windowMs: 60000, max: 120 }), requireAuth);
app.use("/api/checkins", checkins);
app.use("/api/insights", insights);

const server = http.createServer(app);
attachRealtime(server, process.env.CLIENT_ORIGIN);
await mongoose.connect(process.env.MONGO_URI);
server.listen(process.env.PORT, () => console.log("API on", process.env.PORT));
