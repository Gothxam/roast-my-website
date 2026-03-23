import Groq from "groq-sdk";
import { PageMetadata } from "./puppeteer";
import { LighthouseScores } from "./gemini"; 
import { RoastResult } from "./openai";

let groqClient: Groq | null = null;

const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your_groq_api_key_here") return null;
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

export const generateGroqRoast = async (
  metadata: PageMetadata,
  scores: LighthouseScores | null = null
): Promise<RoastResult> => {
  const client = getGroqClient();
  if (!client) throw new Error("Groq API key not configured.");

  const missingAltImages = metadata.images?.filter((img) => !img.alt).length || 0;
  
  const lighthouseSection = scores ? `
Lighthouse Scores:
- Performance: ${scores.performance}/100
- Accessibility: ${scores.accessibility}/100
- Best Practices: ${scores.bestPractices}/100
- SEO: ${scores.seo}/100` : "";

  const prompt = `
You are a senior frontend developer who is tired of seeing bad websites. 
Your goal is to provide a "roast" of the provided website data. 
The tone should be: brutal, witty, sarcastic, but technically accurate.

Website Data:
- Title: ${metadata.title || "Missing"}
- Description: ${metadata.description || "Missing"}
- Headings: ${metadata.headings?.join(", ") || "None"}
- Text Content (Snippet): ${metadata.textContent?.slice(0, 500) || "None"}
- Images: Total ${metadata.images?.length || 0}, Missing alt text: ${missingAltImages}
${lighthouseSection}

Return exactly this JSON format:
{
  "vibeScore": <number 0-100>,
  "roast": "<witty paragraph under 100 words>",
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>", "<suggestion 4>"]
}
`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { 
          role: "system", 
          content: "You are a senior frontend developer roasting websites. You must respond ONLY in valid JSON format. Do not include markdown code blocks." 
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || "{}";
    console.log("[Groq] Raw Response:", content);
    const parsed = JSON.parse(content);

    console.log("[Groq] Success with llama-3.1-8b-instant");
    return {
      score: parsed.vibeScore || 50,
      roast: parsed.roast || "Could not generate roast.",
      suggestions: parsed.suggestions || [],
    };
  } catch (error: any) {
    console.error("[Groq] Error:", error.message);
    throw error;
  }
};
