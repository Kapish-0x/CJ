import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import userRouter from "./routes/userRoutes.js";
import problemRouter from "./routes/problemRouter.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import noteRouter from "./routes/noteRoutes.js";
import moduleRouter from "./routes/moduleRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://codejudge-teal.vercel.app",
      "https://codejudge-2adpqlfer-kapish-0xs-projects.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", userRouter);
app.use("/api/users", userRouter);
app.use("/api/problems", problemRouter);
app.use("/api/submissions", submissionRoutes);
app.use("/api/notes", noteRouter);          // #4 — per-problem notes
app.use("/api/modules", moduleRouter);      // #5 — learning modules
app.use("/api/ai", aiRouter);               // #6 — AI DSA mentor (Groq)

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Path ${req.url} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation error", error: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Cast error", error: err.message });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "Duplicate error",
      error: `${field} "${value}" already exists`,
    });
  }

  res.status(500).json({ message: "Server error" });
});

// Connect DB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });