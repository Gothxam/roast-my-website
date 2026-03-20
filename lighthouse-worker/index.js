import express from 'express';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Concurrency control ───────────────────────────────────────────────────
// Only 1 Lighthouse run at a time. Extra requests wait in the queue.
let isRunning = false;
const TIMEOUT_MS = 120000; // 120 second hard timeout

const runWithQueue = (fn) =>
  new Promise((resolve, reject) => {
    const attempt = async () => {
      if (isRunning) {
        // Wait briefly then retry
        setTimeout(attempt, 500);
        return;
      }
      isRunning = true;
      const timer = setTimeout(() => {
        isRunning = false;
        reject(new Error('Lighthouse timed out after 60 seconds'));
      }, TIMEOUT_MS);
      try {
        const result = await fn();
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        clearTimeout(timer);
        isRunning = false;
      }
    };
    attempt();
  });

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', busy: isRunning });
});

// ─── Main endpoint ─────────────────────────────────────────────────────────
app.get('/analyze', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'url query param is required' });
  }

  console.log(`[Worker] Received request for: ${url}`);

  try {
    const scores = await runWithQueue(() => runLighthouse(url));
    console.log(`[Worker] Done for: ${url}`, scores);
    res.json(scores);
  } catch (err) {
    console.error(`[Worker] Error for ${url}:`, err.message || err);
    res.status(500).json({ error: err.message || 'Lighthouse failed' });
  }
});

// ─── Lighthouse runner ─────────────────────────────────────────────────────
async function runLighthouse(url) {
  let chrome;
  try {
    // Chrome launcher

    chrome = await chromeLauncher.launch({
      chromeFlags: [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-zygote',
        '--disable-extensions',
        '--disable-features=IsolateOrigins,site-per-process',
      ],
    });

    const result = await lighthouse(url, {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
      formFactor: 'mobile',
      screenEmulation: { mobile: true },
      settings: {
        formFactor: 'mobile',
        throttlingMethod: 'provided',
        skipAudits: [
          'cumulative-layout-shift',
          'full-page-screenshot',
          'screenshot-thumbnails',
          'final-screenshot',
        ],
      },
    });

    const { categories } = result.lhr;
    return {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
    };
  } finally {
    if (chrome) {
      try { await chrome.kill(); } catch (_) { }
    }
  }
}

// ─── Start server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Worker] Lighthouse worker running on port ${PORT}`);
});
