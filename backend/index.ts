import dotenv from 'dotenv';
dotenv.config({ override: true });

import express, { Request, Response } from 'express';
import cors from 'cors';
import { fetchPageMetadata } from './services/puppeteer';
import { runLighthouseAudit } from './services/lighthouse';
import { generateRoast } from './services/openai';
import { generateGeminiRoast } from './services/gemini';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Roast My Website backend is running!' });
});

// Setup api router
const apiRouter = express.Router();

apiRouter.post('/analyze', async (req: Request, res: Response): Promise<any> => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // 1. Fetch metadata (Puppeteer)
    console.log(`[1/3] Fetching metadata for a ${url}...`);
    const metadata = await fetchPageMetadata(url);
    if (metadata.loadError && metadata.title === '') {
      return res.status(400).json({ error: `Failed to fetch URL: ${metadata.loadError}` });
    }

    // Give Render a "cooling period" to reclaim RAM from the first Chrome process
    console.log("Allowing RAM to settle before Lighthouse...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Run Lighthouse Audit
    console.log(`[2/3] Running Lighthouse audit for ${url}...`);
    const scores = await runLighthouseAudit(url);

    // 3. Generate Roast (Gemini -> OpenAI -> Mock)
    console.log(`[3/3] Generating roast...`);
    let roastData;
    
    const hasGeminiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
    
    if (hasGeminiKey) {
      try {
        console.log("Attempting Gemini for roast generation...");
        roastData = await generateGeminiRoast(metadata, scores);
      } catch (geminiError: any) {
        console.error("Gemini failed, falling back to OpenAI/Mock:", geminiError.message || geminiError);
        console.log("Falling back to OpenAI (or Mock if OpenAI missing)...");
        roastData = await generateRoast(metadata, scores);
      }
    } else {
      console.log("No Gemini key found, using OpenAI (or Mock if OpenAI missing)...");
      roastData = await generateRoast(metadata, scores);
    }

    // Provide the combined payload to the frontend
    res.json({
      url,
      metadata,
      scores,
      roast: roastData
    });

  } catch (error: any) {
    console.error('Error in /analyze route:', error);
    
    // Temporarily returning full error details to the frontend for debugging
    res.status(500).json({ 
      error: 'An error occurred during analysis', 
      details: error.message,
      stack: error.stack 
    });
  }
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
