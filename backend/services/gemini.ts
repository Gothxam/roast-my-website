import { GoogleGenerativeAI } from "@google/generative-ai";
import { PageMetadata } from "./puppeteer";
import { LighthouseScores } from "./lighthouse";
import { RoastResult } from "./openai";

let genAI: GoogleGenerativeAI | null = null;

const getGeminiClient = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return null;
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

export const generateGeminiRoast = async (
  metadata: PageMetadata,
  scores: LighthouseScores | null
): Promise<RoastResult> => {
  const client = getGeminiClient();

  if (!client) {
    throw new Error("Gemini API key not configured.");
  }

  // Use gemini-flash-lite-latest (Lower resource usage, often better free tier availability)
  const model = client.getGenerativeModel({
    model: "gemini-flash-lite-latest",
  });

  const prompt = `
You are a senior frontend developer reviewing a website.

Your job is to give honest, witty, slightly sarcastic but constructive feedback about the site — similar to a senior developer doing a code review.

The tone should be:
• humorous
• insightful
• slightly sarcastic
• but NEVER insulting or disrespectful

Your goal is to help the website owner understand what works, what doesn't, and how they can improve it.

Website Data:

Title: ${metadata.title}
Description: ${metadata.description}

Headings (H1/H2/H3):
${metadata.headings.join('\n')}

Lighthouse Audit Scores:
Performance: ${scores?.performance || 'N/A'}
Accessibility: ${scores?.accessibility || 'N/A'}
Best Practices: ${scores?.bestPractices || 'N/A'}
SEO: ${scores?.seo || 'N/A'}

Analyze the website and provide:

1. A "Design Score" from 0–100 based on the structure, metadata quality, and likely UX clarity.
2. A short roast paragraph that is funny but constructive.
3. 3–5 actionable suggestions to improve the website.

Important rules:
• Focus on real UX, design, SEO, and performance insights.
• Make the roast entertaining but helpful.
• Do NOT insult the developer.
• Do NOT exaggerate problems.
• Keep the roast under 120 words.

Return ONLY valid JSON.

JSON format:
{
  "designScore": 65,
  "roast": "Constructive roast here...",
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}
`;

  // List of models to try in order based on user's available quota
  const modelsToTry = [
    "gemini-2.0-flash",           // First choice, often good availability
    "gemini-2.5-flash-lite",      // Second choice, lite models have generous limits
    "gemini-2.5-pro",             // Third choice, powerful but might have stricter rate limits
    "gemma-3-27b-it"              // Fallback to Gemma
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Gemini] Attempting generation with model: ${modelName}`);
      const model = client.getGenerativeModel({ model: modelName });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean up markdown code blocks if the model returns them
      text = text.replace(/```json|```/g, '').trim();

      const parsed = JSON.parse(text);
      
      console.log(`[Gemini] Successfully generated roast using ${modelName}`);

      return {
        score: parsed.designScore || 50,
        roast: parsed.roast || 'Could not generate roast.',
        suggestions: parsed.suggestions || ['Check console logs.']
      };
    } catch (error: any) {
      console.warn(`[Gemini] Model ${modelName} failed:`, error.message || error);
      lastError = error;
      
      // If it's a quota error (429) or resource exhausted, continue to the next model.
      // If we see 404, we also continue as the model might not be accessible.
      if (
        error.message?.includes('429') || 
        error.message?.includes('quota') ||
        error.message?.includes('exhausted') ||
        error.message?.includes('404') ||
        error.message?.includes('not found')
      ) {
         console.log(`[Gemini] Trying next fallback model...`);
         continue; 
      }
      
      // For other critical errors (like invalid API key 401), we might want to just break out,
      // but to be safe we'll keep trying others just in case it's model-specific.
    }
  }

  // If we exhausted all models
  console.error('[Gemini] All Gemini models failed. Last error:', lastError?.message || lastError);
  throw new Error(`All Gemini models exhausted. Last error: ${lastError?.message || 'Unknown'}`);
};
