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

  const totalImages = metadata.images?.length || 0;
  const missingAltImages = metadata.images?.filter((img) => !img.alt).length || 0;

  const lighthouseSection = scores ? `
**Lighthouse Scores (Mobile):**
- Performance: ${scores.performance}/100
- Accessibility: ${scores.accessibility}/100
- Best Practices: ${scores.bestPractices}/100
- SEO: ${scores.seo}/100
` : '';

  const prompt = `
You are a brutally honest senior frontend developer who gives sharp, witty feedback.
Your tone is conversational, slightly sarcastic, and naturally funny (not trying too hard).

STYLE RULES:
- Mix short and medium sentences with punchy one-liners.
- Occasionally exaggerate slightly for humor.
- Use casual phrases like: "bro", "wait", "seriously", "no way", "RIP".
- It should feel like a smart dev roasting your site in a group chat.

HUMOR RULES:
- Add 2–4 sharp, memorable lines (these are the punchlines).
- Keep humor short, not long jokes.
- No poetic metaphors, no corporate tone, no over-politeness.

CONTENT RULES:
- Use actual data (scores, missing elements, structure issues) to fuel the roast.
- Call things out directly. Focus on real problems.

Website Data:
- Title: ${metadata.title || 'Missing!'}
- Meta Description: ${metadata.description || 'Missing!'}
- Headings: ${metadata.headings?.join('\n') || 'None'}
- Buttons: ${metadata.buttons?.join(', ') || 'None found'}
- Images: Total ${totalImages}, Missing alt text: ${missingAltImages}
- Sample Visible Text: ${metadata.textContent?.slice(0, 600) || 'None'}
${lighthouseSection}

STRUCTURE: Write 1–2 paragraphs total. Keep it tight. Sprinkle punchlines inside naturally.

EXPECTED JSON OUTPUT:
{
  "vibeScore": <0-100, be brutally critical>,
  "roast": "<1-2 paragraphs of sharp, group-chat style feedback>",
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>", "<suggestion 4>"]
}
`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a world-class UI/UX critic and Senior Developer. You provide long, detailed, and witty JSON roasts. You never output markdown code blocks."
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
