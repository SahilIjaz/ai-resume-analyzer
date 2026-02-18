import axios from "axios";

console.log("✓ AI service loaded");
console.log(
  "ANTHROPIC_API_KEY is",
  !!process.env.ANTHROPIC_API_KEY ? "configured" : "NOT SET",
);

export const analyzeResumeWithGemini = async (prompt: string) => {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
    }

    console.log("\n🔐 Claude API Call Details:");
    console.log("   URL: https://api.anthropic.com/v1/messages");
    console.log("   Model: claude-haiku-4-5-20251001");
    console.log("   Prompt length:", prompt.length, "characters");

    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content:
              "You are a strict professional resume evaluator.\n\n" + prompt,
          },
        ],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ Claude API Success!");
    console.log("   Status:", response.status);

    // Normalize response to match what resume-routes.ts expects
    return {
      candidates: [
        {
          content: {
            parts: [
              {
                text: response.data.content[0].text,
              },
            ],
          },
        },
      ],
    };
  } catch (error: any) {
    console.error("\n❌ Claude API Error:");
    console.error("   Status Code:", error.response?.status);
    console.error("   Error Message:", error.message);
    console.error("   API Response:", error.response?.data);

    throw new Error(
      `Gemini API Error (${
        error.response?.status || "Unknown"
      }): ${error.response?.data?.error?.message || error.message}`,
    );
  }
};
