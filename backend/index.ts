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
import { generateGroqRoast } from './services/groq';
import { checkRateLimit, incrementRateLimit } from './services/rateLimiter';
import { getCachedResult, setCachedResult } from './services/cache';
import { trackEvent, getMetrics } from './services/analytics';

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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

    console.log(`[Lighthouse] Requesting scores from Browserless.io for ${url}...`);
    const resp = await fetch(`https://chrome.browserless.io/performance?token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Browserless responded with ${resp.status}: ${errText.slice(0, 100)}`);
    }

    const result = await resp.json() as any;

    // Support standard LHR or wrapped 'data'/'report'/'lhr'
    const report = result.categories ? result : (result.data || result.report || result.lhr);

    if (!report || !report.categories) {
      return null;
    }

    const { categories } = report;

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
    // Phase 1: Rate Limiting
    const forwarded = req.headers['x-forwarded-for'] as string;
    const realIp = req.headers['x-real-ip'] as string;
    const cfIp = req.headers['cf-connecting-ip'] as string;
    
    const ip = forwarded?.split(',')[0].trim() || realIp || cfIp || req.socket.remoteAddress || 'unknown';
    console.log(`[RateLimit] Detected IP: ${ip} | User-Agent: ${req.headers['user-agent']?.slice(0, 50)}`);
    
    const { allowed, remaining } = checkRateLimit(ip);
    if (!allowed) {
      return res.status(429).json({ 
        error: 'Too many roasts today. Come back tomorrow 🔥',
        details: 'Daily limit reached for this IP.'
      });
    }

    // Phase 1: Caching
    const cached = getCachedResult(url);
    if (cached) {
      console.log(`[Cache] Serving cached result for ${url}`);
      return res.json(cached);
    }

    // Step 1: Scrape rich page data
    console.log(`[1/3] Fetching metadata for ${url}...`);
    const metadata = await fetchPageMetadata(url);

    if (metadata.loadError && metadata.title === '') {
      return res.status(400).json({ error: `Failed to fetch URL: ${metadata.loadError}` });
    }

    // Step 2: Optional Lighthouse scores
    console.log(`[2/3] Fetching Lighthouse scores...`);
    const scores = await fetchLighthouseScores(url);

    // Step 3: Generate roast with AI Fallback Chain (Groq → Gemini → OpenAI/Mock)
    console.log(`[3/3] Generating roast...`);
    let roastData;

    try {
      console.log('--- Attempt 1: Groq ---');
      roastData = await generateGroqRoast(metadata, scores);
    } catch (groqError: any) {
      console.warn("Groq failed, falling back to Gemini:", groqError.message);
      try {
        console.log('--- Attempt 2: Gemini ---');
        roastData = await generateGeminiRoast(metadata, scores);
      } catch (geminiError: any) {
        console.warn('Gemini failed, falling back to OpenAI/Mock:', geminiError.message);
        try {
          console.log('--- Attempt 3: OpenAI/Mock ---');
          roastData = await generateRoast(metadata, scores);
        } catch (openAiError: any) {
          console.error('Final fallback failed:', openAiError.message);
          throw new Error('All AI services failed to generate a roast.');
        }
      }
    }

    const result = { url, metadata, scores, roast: roastData };

    // Update Rate Limit and Cache
    incrementRateLimit(ip);
    setCachedResult(url, result);

    res.json(result);

  } catch (error: any) {
    console.error('Error in /analyze route:', error);
    res.status(500).json({
      error: 'An error occurred during analysis',
      details: error.message,
    });
  }
});

apiRouter.get('/results', (req: Request, res: Response): any => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });
  const result = getCachedResult(url as string);
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.json(result);
});

// Phase 2: Analytics
apiRouter.post('/track', (req: Request, res: Response): any => {
  const { userId, event } = req.body;
  if (!userId || !event) return res.status(400).json({ error: 'Missing userId or event' });
  
  // Track asynchronously (no-await)
  trackEvent(userId, event as "roast" | "share").catch((err: any) => console.error('[Analytics] Async track error:', err));
  
  res.status(202).json({ status: 'Tracking queued' });
});

apiRouter.get('/metrics', async (req: Request, res: Response): Promise<any> => {
  const metrics = await getMetrics();
  res.json(metrics);
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
