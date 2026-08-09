import reportRoutes from "./routes/reportRoutes.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

connectDB();

// app.use(
//   cors({
//     origin: "https://code-sandbox-bundler.myanatomy.in",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "*",
//     "Access-Control-Allow-Headers": "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'"
//   })
// );
app.get("/",(req,resp)=>resp.send("Hello js"))
app.use(
  cors({
    origin: "https://code-sandbox-bundler.myanatomy.in",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Auth-Token"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  console.log(req.body);
  next();
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ClauseIQ Backend Running",
  });

});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ClauseIQ Backend Started Successfully`);
  console.log(`API Version : v1`);
  console.log(`Listening on Port : ${PORT}`);
});