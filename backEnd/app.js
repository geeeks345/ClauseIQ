import express from "express";
import cors from "cors";

import contractRoutes from "./routes/contractRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const allowedOrigins = (
  process.env.CORS_ORIGINS ??
  "http://localhost:3000,http://127.0.0.1:3000,https://code-sandbox-bundler.myanatomy.in"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Auth-Token"],
    credentials: true,
  })
);

app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ClauseIQ Backend Running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/contracts", contractRoutes);
app.use("/api/reports", reportRoutes);

export default app;
