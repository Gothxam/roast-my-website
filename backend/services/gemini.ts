// @ts-nocheck
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PageMetadata } from "./puppeteer";
import { RoastResult } from "./openai";

let genAI: GoogleGenerativeAI | null = null;

const getGeminiClient = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') return null;
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export const generateGeminiRoast = async (
  metadata: PageMetadata,
  scores: LighthouseScores | null = null
): Promise<RoastResult> => {
  const client = getGeminiClient();
  if (!client) throw new Error("Gemini API key not configured.");

  const modelsToTry = [
    "gemma-3-27b-it",
    "gemini-2.0-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro"

  ];

  const missingAltImages = metadata.images?.filter(img => !img.alt).length || 0;
  const totalImages = metadata.images?.length || 0;

  const lighthouseSection = scores ? `
**Lighthouse Scores (Mobile):**
- Performance: ${scores.performance}/100
- Accessibility: ${scores.accessibility}/100
- Best Practices: ${scores.bestPractices}/100
- SEO: ${scores.seo}/100
` : '';

  const prompt = `
You are a senior frontend developer reviewing a website's structure, content, and performance.

The tone should be: humorous, insightful, slightly sarcastic, but NEVER insulting. Always constructive.

Website Data:
**Title:** ${metadata.title || 'Missing!'}
**Meta Description:** ${metadata.description || 'Missing!'}

**Headings (H1–H6):**
${metadata.headings?.length ? metadata.headings.join('\n') : 'No headings found!'}

**Buttons:** ${metadata.buttons?.length ? metadata.buttons.join(', ') : 'None found'}
**Images:** Total ${totalImages}, Missing alt text: ${missingAltImages}
**Sample Visible Text:** ${metadata.textContent?.slice(0, 500) || 'None'}
**Links on page:** ${metadata.links?.length || 0}
${lighthouseSection}
Provide:
1. A "Design Score" from 0–100. Calculate this YOURSELF based on the evidence above — do NOT use the example number. Low score if major issues found, high if everything looks good.
2. A punchy roast paragraph (funny but helpful, under 120 words).
3. 4–5 actionable, specific suggestions based on what you found.

IMPORTANT: The designScore must reflect your ACTUAL analysis, not the example number.

Return ONLY valid JSON (no code block, no markdown):
{
  "designScore": <YOUR_CALCULATED_SCORE_0_TO_100>,
  "roast": "...",
  "suggestions": ["...", "...", "...", "..."]
}
`;

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`[Gemini] Trying model: ${modelName}`);
      const model = client.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(text);

      console.log(`[Gemini] Success with: ${modelName}`);
      return {
        score: parsed.designScore || 50,
        roast: parsed.roast || 'Could not generate roast.',
        suggestions: parsed.suggestions || []
      };
    } catch (error: any) {
      console.warn(`[Gemini] Model ${modelName} failed:`, error.message);
      lastError = error;
      const msg = error.message?.toLowerCase() || '';
      if (msg.includes('429') || msg.includes('quota') || msg.includes('exhausted') || msg.includes('404') || msg.includes('not found')) {
        continue;
      }
    }
  }

  throw new Error(`All Gemini models exhausted. Last: ${lastError?.message || 'Unknown'}`);
};
