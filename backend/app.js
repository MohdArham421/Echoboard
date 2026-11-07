import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import profileRoutes from "./routes/profile.routes.js";

import errorHandler from "./middleware/error.middleware.js";

const app = express();

const clientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const allowedOrigins = [
  "https://echoboard-pi.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  ...clientUrls,
];

// CORS must be first before any other middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
  })
);

// Core Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiter
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// Global Error Handler
app.use(errorHandler);

export default app;