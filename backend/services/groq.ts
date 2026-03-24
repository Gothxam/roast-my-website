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
You are a Senior Engineering Director and UX Critic. You've seen a thousand landing pages and you have zero patience for generic, pretentious, or technically broken sites.

Your task is to perform a deep-dive "roast" of the provided website data. 

### STYLE GUIDE:
- **Tone**: Brutally honest, technically cynical, but brilliant. Use metaphors (e.g., "this layout has the structural integrity of a wet napkin").
- **Depth**: Don't just say "Performance is bad." Say "Your site loads slower than a senior dev's motivation on a Friday afternoon."
- **Specifics**: Quote the Title, Meta Description, or Headings directly to mock them if they are too "poetic" or lack clarity.
- **Conversion**: If there are 0 buttons, mock the lack of a Call To Action.
- **Vibe**: Is it trying too hard to be "Wes Anderson"? Does it read like a perfume ad? Call it out.

Website Data:
**Title:** ${metadata.title || 'Missing!'}
**Meta Description:** ${metadata.description || 'Missing!'}

**Headings (H1–H6):**
${metadata.headings?.length ? metadata.headings.join('\n') : 'No headings found!'}

**Buttons:** ${metadata.buttons?.length ? metadata.buttons.join(', ') : 'None found'}
**Images:** Total ${totalImages}, Missing alt text: ${missingAltImages}
**Sample Visible Text:** ${metadata.textContent?.slice(0, 600) || 'None'}
**Links on page:** ${metadata.links?.length || 0}
${lighthouseSection}

### EXPECTED OUTPUT (JSON ONLY):
1. **vibeScore**: (0-100) Be critical. A 90+ is nearly impossible. A generic site is a 40.
2. **roast**: An elaborate, detailed critique (under 250 words) that specifically mentions the copy's tone and the technical structure.
3. **suggestions**: 4-5 highly technical and specific improvements.

Return ONLY valid JSON:
{
  "vibeScore": <number>,
  "roast": "...",
  "suggestions": ["...", "...", "..."]
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
