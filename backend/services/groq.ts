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
You are a brutally honest but experienced senior frontend developer reviewing a website.
Your job is to roast the website in a way that is direct, conversational, slightly sarcastic, and grounded in real observations.

DO NOT sound like an AI.
DO NOT use poetic metaphors or dramatic comparisons.
DO NOT write like an essay.
Write like a real developer giving blunt feedback.

STYLE RULES:
- Use a mix of short and medium sentences.
- Break flow naturally (like how people actually talk).
- Add occasional pauses like: "...", "wait", "seriously".
- It should feel like someone thinking while talking.
- Avoid fancy vocabulary and over-explaining.

TONE:
- Be honest, slightly savage, but not toxic.
- It should feel critical, not abusive.
- No cringe jokes, no try-hard humor, no corporate tone.

CONTENT RULES:
- ALWAYS reference real data from the input (scores, missing elements, structure issues).
- Call out specific problems clearly (missing buttons, alt text, etc).
- Avoid generic advice like "improve SEO" or "enhance UX".

Website Data:
- Title: ${metadata.title || 'Missing!'}
- Meta Description: ${metadata.description || 'Missing!'}
- Headings: ${metadata.headings?.join('\n') || 'None'}
- Buttons: ${metadata.buttons?.join(', ') || 'None found'}
- Images: Total ${totalImages}, Missing alt text: ${missingAltImages}
- Sample Visible Text: ${metadata.textContent?.slice(0, 600) || 'None'}
${lighthouseSection}

STRUCTURE: Write 1–2 paragraphs total for the roast.

EXPECTED JSON OUTPUT:
{
  "vibeScore": <number 0-100, be critical>,
  "roast": "<1-2 paragraphs of blunt, conversational feedback>",
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
