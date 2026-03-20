import dotenv from 'dotenv';
dotenv.config({ override: true });

process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err);
  // Optional: process.exit(1); depending on if you want it to restart
});

import express, { Request, Response } from 'express';
import cors from 'cors';
import { fetchPageMetadata } from './services/puppeteer';
import { generateRoast } from './services/openai';
import { generateGeminiRoast } from './services/gemini';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Roast My Website backend is running!' });
});

const apiRouter = express.Router();

// Fetch Lighthouse scores from Browserless.io
const fetchLighthouseScores = async (url: string) => {
  const token = process.env.BROWSERLESS_API_KEY;
  if (!token) {
    console.log('[Lighthouse] BROWSERLESS_API_KEY not set, skipping scores.');
    return null;
  }
  try {
    console.log(`[Lighthouse] Requesting scores from Browserless.io for ${url}...`);
    const resp = await fetch(`https://chrome.browserless.io/lighthouse?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        format: 'json',
      }),
    });

    if (!resp.ok) throw new Error(`Browserless responded with ${resp.status}`);
    
    const result = await resp.json() as any;
    const { categories } = result;

    const scores = {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
    };

    console.log('[Lighthouse] Scores received:', scores);
    return scores;
  } catch (err: any) {
    console.warn('[Lighthouse] Failed, continuing without scores:', err.message || err);
    return null;
  }
};

apiRouter.post('/analyze', async (req: Request, res: Response): Promise<any> => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Step 1: Scrape rich page data via Browserless (no local Chrome)
    console.log(`[1/3] Fetching metadata for ${url}...`);
    const metadata = await fetchPageMetadata(url);

    if (metadata.loadError && metadata.title === '') {
      return res.status(400).json({ error: `Failed to fetch URL: ${metadata.loadError}` });
    }

    // Step 2: Optional Lighthouse scores from external worker
    console.log(`[2/3] Fetching Lighthouse scores...`);
    const scores = await fetchLighthouseScores(url);

    // Step 3: Generate roast with AI (Gemini → OpenAI → Mock)
    console.log(`[3/3] Generating roast...`);
    let roastData;

    const hasGeminiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';

    if (hasGeminiKey) {
      try {
        console.log('Attempting Gemini for roast generation...');
        roastData = await generateGeminiRoast(metadata, scores);
      } catch (geminiError: any) {
        console.error('Gemini failed, falling back to OpenAI/Mock:', geminiError.message || geminiError);
        roastData = await generateRoast(metadata, scores);
      }
    } else {
      console.log('No Gemini key, using OpenAI/Mock...');
      roastData = await generateRoast(metadata, scores);
    }

    res.json({ url, metadata, scores, roast: roastData });

  } catch (error: any) {
    console.error('Error in /analyze route:', error);
    res.status(500).json({
      error: 'An error occurred during analysis',
      details: error.message,
    });
  }
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
