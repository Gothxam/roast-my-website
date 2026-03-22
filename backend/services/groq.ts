import Groq from "groq-sdk";
import { PageMetadata } from "./puppeteer";
import { LighthouseScores } from "./gemini";
import { RoastResult } from "./openai";

let groqClient: Groq | null = null;

const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;
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
1. A "Design Score" from 0–100.
2. A punchy roast paragraph (funny but helpful, under 120 words).
3. 4–5 actionable, specific suggestions.

Return ONLY valid JSON:
{
  "designScore": <number>,
  "roast": "...",
  "suggestions": ["...", "...", "...", "..."]
}
`;

  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
      response_format: { type: "json_object" },
    });

    const parsed = JSON.parse(chatCompletion.choices[0]?.message?.content || "{}");

    return {
      score: parsed.designScore || 50,
      roast: parsed.roast || 'Could not generate roast.',
      suggestions: parsed.suggestions || []
    };
  } catch (error: any) {
    console.error("[Groq] Error:", error.message);
    throw error;
  }
};
