import dotenv from "dotenv";

dotenv.config();

// Verify critical environment variables
if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️  WARNING: GEMINI_API_KEY is not set in environment variables");
}
