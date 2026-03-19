import OpenAI from 'openai';
import { PageMetadata } from './puppeteer';
import { LighthouseScores } from './lighthouse';

let openaiClient: OpenAI | null = null;

const getOpenAIClient = () => {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      console.log('No OpenAI API key found, using mock mode.');
      return null;
    }
    console.log(`Using API Key ending in: ...${apiKey.slice(-4)}`);
    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
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
  scores: LighthouseScores | null
): Promise<RoastResult> => {
  const isMock = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here';

  if (isMock) {
    // Mock response if no API key is set
    return {
      score: 72,
      roast: "This website looks like it was built in 2010 and forgotten. The padding is all over the place, and I can almost hear the dial-up modem when loading the images. Setup an OpenAI API Key in your .env file and restart the server to get a real roast!",
      suggestions: [
        "Add some breathing room (padding/margin) to your containers.",
        "Optimize your images to improve performance.",
        "Include a valid OpenAI API key in your .env to get real feedback."
      ]
    };
  }

  const prompt = `
You are a senior frontend developer who gives harsh but extremely accurate and constructive feedback ("roasts") on websites. 
I have scraped a website and run an audit on it.

Website Title: ${metadata.title}
Description: ${metadata.description}
Headings (H1/H2/H3):
${metadata.headings.join('\n')}

Lighthouse Audit Scores:
- Performance: ${scores?.performance || 'N/A'}
- Accessibility: ${scores?.accessibility || 'N/A'}
- Best Practices: ${scores?.bestPractices || 'N/A'}
- SEO: ${scores?.seo || 'N/A'}

Based on this information, provide:
1. An overall "Design" score out of 100 based on your impression of the structure and metadata (since you can't see the full CSS, make an educated guess based on the quality of the headings and description).
2. A brutal, funny, but ultimately helpful "roast" paragraph.
3. A list of 3-5 actionable suggestions to improve the site.

Respond EXACTLY in this JSON format:
{
  "designScore": 65,
  "roast": "Your roast text here...",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}
  `;

  try {
    const openai = getOpenAIClient();
    if (!openai) throw new Error('OpenAI client not initialized. Check your API key.');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const resultText = response.choices[0].message.content;
    if (!resultText) throw new Error('Empty response from OpenAI');

    const result = JSON.parse(resultText);
    
    return {
      score: result.designScore || 50,
      roast: result.roast || 'Could not generate roast.',
      suggestions: result.suggestions || ['Check console logs.']
    };
  } catch (error: any) {
    console.error('OpenAI service error:', error.message || error);
    return {
      score: 0,
      roast: `Failed to generate roast: ${error.message || 'API error'}`,
      suggestions: ['Check your OPENAI_API_KEY in .env and ensure you have enough credits.']
    };
  }
};
