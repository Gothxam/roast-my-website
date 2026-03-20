import dotenv from 'dotenv';
dotenv.config({ override: true });

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

// Optional: fetch Lighthouse scores from the external worker
const fetchLighthouseScores = async (url: string) => {
  const workerUrl = process.env.LIGHTHOUSE_WORKER_URL;
  if (!workerUrl) {
    console.log('[Lighthouse Worker] LIGHTHOUSE_WORKER_URL not set, skipping scores.');
    return null;
  }
  try {
    console.log(`[Lighthouse Worker] Requesting scores from ${workerUrl}...`);
    const resp = await fetch(`${workerUrl}/analyze?url=${encodeURIComponent(url)}`);
    if (!resp.ok) throw new Error(`Worker responded with ${resp.status}`);
    const scores = await resp.json() as { performance: number; accessibility: number; bestPractices: number; seo: number };
    console.log('[Lighthouse Worker] Scores received:', scores);
    return scores;
  } catch (err: any) {
    console.warn('[Lighthouse Worker] Failed, continuing without scores:', err.message || err);
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
