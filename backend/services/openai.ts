import OpenAI from 'openai';
import { PageMetadata } from './puppeteer';
import { LighthouseScores } from './gemini';

let openaiClient: OpenAI | null = null;

const getOpenAIClient = () => {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') return null;
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
};

export interface RoastResult {
  score: number;
  roast: string;
  suggestions: string[];
}

export const generateRoast = async (
  metadata: PageMetadata,
  scores: LighthouseScores | null = null
): Promise<RoastResult> => {
  const isMock = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here';

  if (isMock) {
    return {
      score: 72,
      roast: "I couldn't fully roast your website — running in mock mode. Add a GEMINI_API_KEY or OPENAI_API_KEY to your .env for real feedback!",
      suggestions: [
        "Set a GEMINI_API_KEY in .env to enable real AI roasting.",
        "Ensure your site is publicly accessible.",
        "Make sure headings and meta descriptions are present."
      ]
    };
  }

  const missingAltImages = metadata.images?.filter(img => !img.alt).length || 0;
  const scoreSection = scores ? `
Lighthouse Scores (Mobile):
- Performance: ${scores.performance}/100
- Accessibility: ${scores.accessibility}/100
- Best Practices: ${scores.bestPractices}/100
- SEO: ${scores.seo}/100` : '';

  const prompt = `
You are a senior frontend developer giving harsh but constructive feedback.

Website Data:
Title: ${metadata.title || 'Missing'}
Meta Description: ${metadata.description || 'Missing'}
Headings: ${metadata.headings?.join(', ') || 'None'}
Buttons: ${metadata.buttons?.join(', ') || 'None'}
Images total: ${metadata.images?.length || 0}, Missing alt text: ${missingAltImages}
Sample content: ${metadata.textContent?.slice(0, 400) || 'None'}
${scoreSection}

Provide a design score 0-100, a short funny roast (under 120 words), and 4 actionable suggestions.
Respond ONLY as JSON: { "designScore": 65, "roast": "...", "suggestions": ["..."] }
`;

  try {
    const openai = getOpenAIClient();
    if (!openai) throw new Error('OpenAI client not initialized.');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      score: result.designScore || 50,
      roast: result.roast || 'Could not generate roast.',
      suggestions: result.suggestions || []
    };
  } catch (error: any) {
    console.error('OpenAI error:', error.message);
    return {
      score: 0,
      roast: `Failed to generate roast: ${error.message}`,
      suggestions: ['Check your OPENAI_API_KEY in .env.']
    };
  }
};
