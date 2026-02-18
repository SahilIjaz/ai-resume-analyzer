import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  analyzeResumeWithGemini,
} from "../services/grok-service";
import { ResumeAnalysis } from "../types/resume-types";

console.log("✓ Resume routes module imported successfully");

// Import pdfjs-dist
import * as pdfjsLib from "pdfjs-dist";

// Set the worker path - go up 2 directories from src/routes to project root
const workerPath = path.join(__dirname, "../../node_modules/pdfjs-dist/build/pdf.worker.min.js");
pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;

const router = express.Router();
const upload = multer({ dest: "uploads/" });

console.log("✓ Resume routes loaded");

// Debug middleware
router.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n${"=".repeat(60)}`);
  console.log(`📍 [${timestamp}] ${req.method} ${req.path}`);

  const originalJson = res.json.bind(res);
  const originalStatus = res.status.bind(res);
  let statusCode = 200;

  res.status = function (code: number) {
    statusCode = code;
    return originalStatus(code);
  };

  res.json = function (data: any) {
    console.log(`✅ Response Status: ${statusCode}`);
    console.log(`${"=".repeat(60)}\n`);
    return originalJson(data);
  };

  next();
});

router.post(
  "/analyze",
  upload.single("resume"),
  async (req: Request, res: Response) => {
    console.log("🔍 /analyze endpoint handler started");

    try {
      // 1. Validations
      if (!req.file) {
        return res.status(400).json({ error: "Resume file required" });
      }
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files are supported" });
      }
      if (!req.body.role) {
        return res.status(400).json({ error: "Target role is required" });
      }

      console.log(
        `📖 Processing: ${req.file.originalname} for Role: ${req.body.role}`,
      );

      // 2. Read file to buffer
      const fileBuffer = fs.readFileSync(req.file.path);
      
      // Convert Buffer to Uint8Array for pdfjs-dist
      const uint8Array = new Uint8Array(fileBuffer);

      // 3. Parse PDF with pdfjs-dist
      let resumeText = "";
      try {
        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
        const pageCount = pdf.numPages;
        
        for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Extract text from the page
          const pageText = textContent.items
            .filter((item: any) => item.str)
            .map((item: any) => item.str)
            .join(" ");
          
          resumeText += pageText + "\n";
        }
        
        console.log(`✓ PDF parsed. Text length: ${resumeText.length}`);
        if (resumeText.length === 0) {
          throw new Error("No text content extracted from PDF");
        }
      } catch (pdfError: any) {
        console.error("❌ PDF Parsing Error Details:", {
          message: pdfError.message,
          name: pdfError.name,
          code: pdfError.code
        });
        return res.status(400).json({
          error: "Failed to parse PDF file",
          details: pdfError.message || "The file might be corrupted or password protected.",
        });
      }

      const targetRole = req.body.role;
      const trimmedResume = resumeText.slice(0, 8000);

      // 4. Construct Prompt
      const prompt = `
You MUST return ONLY valid JSON.
Format:
{
  "score": number (0-100),
  "missing_skills": [],
  "improvement_plan": [],
  "rewrite_suggestions": []
}
Analyze this resume for role: ${targetRole}
Resume:
${trimmedResume}
      `;

      // 5. AI Analysis (Gemini)
      console.log("🚀 Calling Gemini API...");
      const geminiResponse = await analyzeResumeWithGemini(prompt);
      console.log("Prompt sent to Gemini API:", prompt);

      const content: string =
        geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // 6. Parse LLM JSON
      let parsed: ResumeAnalysis;
      try {
        // Handle cases where LLM might wrap JSON in markdown blocks
        const cleanJson = content.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error("❌ JSON Parse Error from LLM");
        return res.status(500).json({
          error: "AI returned invalid JSON format",
          raw: content,
        });
      }

      return res.json(parsed);
    } catch (error: any) {
      console.error("🔴 Server Error:", error.message);
      return res.status(500).json({
        error: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
      });
    } finally {
      // 7. Cleanup: Always delete the file regardless of success or failure
      if (req.file && fs.existsSync(req.file.path)) {
        try {
          fs.unlinkSync(req.file.path);
          console.log("🗑️ Temporary file cleaned up");
        } catch (unlinkError) {
          console.error("⚠️ Failed to delete temp file:", unlinkError);
        }
      }
    }
  },
);

export default router;
