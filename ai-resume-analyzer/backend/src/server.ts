import dotenv from "dotenv";
dotenv.config();

import "./config/env";
import express from "express";
import cors from "cors";
import resumeRoute from "./routes/resume-routes";

const app = express();

console.log("\n" + "=".repeat(60));
console.log("🚀 SERVER INITIALIZATION");
console.log("=".repeat(60));
console.log("✓ Server starting...");
console.log("✓ Environment variables loaded");
console.log("✓ GEMINI_API_KEY is", process.env.GEMINI_API_KEY ? "✅ SET" : "❌ NOT SET");
console.log("=".repeat(60) + "\n");

// CRITICAL: Log EVERY single request BEFORE any other middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n${"*".repeat(70)}`);
  console.log(`🔴 [${timestamp}] INCOMING REQUEST`);
  console.log(`   Method: ${req.method}`);
  console.log(`   URL: ${req.url}`);
  console.log(`   Full Path: ${req.path}`);
  console.log(`${"*".repeat(70)}`);
  next();
});

// CORS must be before routes
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check endpoint
app.get("/api/health", (_req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`💚 [${timestamp}] Health check request - Sending response...`);
  const response = {
    status: "ok",
    message: "Server is running",
    timestamp,
    apiKeyConfigured: !!process.env.GEMINI_API_KEY
  };
  console.log(`   Response:`, response);
  res.json(response);
});

app.use("/api", resumeRoute);

app.get("/", (_req, res) => {
  res.send("AI Resume Analyzer TS Running...");
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const timestamp = new Date().toISOString();
  console.error(`\n❌ [${timestamp}] Server Error:`, err.message);
  res.status(500).json({ 
    error: err.message,
    timestamp
  });
});

// 404 handler
app.use((_req, res) => {
  const timestamp = new Date().toISOString();
  console.log(`⚠️  [${timestamp}] 404 - Endpoint not found: ${_req.method} ${_req.path}`);
  res.status(404).json({ error: "Endpoint not found" });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Main URL: http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Analyze: POST http://localhost:${PORT}/api/analyze`);
  console.log("=".repeat(60) + "\n");
});

// Log when server closes
server.on("error", (err) => {
  console.error("🔴 Server error:", err);
});
