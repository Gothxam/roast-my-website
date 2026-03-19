import * as chromeLauncher from 'chrome-launcher';
import puppeteer from 'puppeteer';

// Use dynamic import for lighthouse since it's typically ESM
export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export const runLighthouseAudit = async (url: string): Promise<LighthouseScores | null> => {
  let chrome;
  try {
    const lighthouse = (await import('lighthouse')).default;
    
    // Launch chrome in robust headless mode with a fresh port attempt
    try {
      const customChromePath = puppeteer.executablePath();
      console.log(`[Lighthouse] Using Chrome path: ${customChromePath}`);

      chrome = await chromeLauncher.launch({ 
        chromeFlags: [
          '--headless=new', 
          '--no-sandbox', 
          '--disable-gpu', 
          '--disable-dev-shm-usage', 
          '--quiet',
          '--disable-extensions',
          '--no-first-run',
          '--no-zygote',
          '--disable-features=IsolateOrigins,site-per-process'
        ],
        chromePath: customChromePath
      });
      
      const options = {
        logLevel: 'error' as const,
        output: 'json' as const,
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: chrome.port,
        formFactor: 'desktop' as const,
        screenEmulation: {
          mobile: false
        },
        settings: {
          maxWaitForLoad: 90000,
          formFactor: 'desktop' as const,
          screenEmulation: { mobile: false },
          throttlingMethod: 'provided' as const,
          skipAudits: [
            'cumulative-layout-shift', 
            'full-page-screenshot', 
            'screenshot-thumbnails',
            'final-screenshot'
          ] // Skip heavy assets to save RAM
        }
      };
      
      // Run lighthouse with an additional internal try block to catch the "performance mark" bug
      try {
        const runnerResult = await lighthouse(url, options);
        
        if (!runnerResult || !runnerResult.lhr) {
          throw new Error('No Lighthouse results');
        }

        const { categories } = runnerResult.lhr;
        
        const scores = {
          performance: Math.round((categories.performance?.score || 0) * 100),
          accessibility: Math.round((categories.accessibility?.score || 0) * 100),
          bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
          seo: Math.round((categories.seo?.score || 0) * 100),
        };

        return scores;
      } catch (innerError: any) {
        if (innerError.message?.includes('performance mark')) {
          console.warn('Lighthouse navigation error (performance mark bug) for:', url);
        } else {
          console.error('Lighthouse execution error:', innerError.message || innerError);
        }
        return null;
      }
    } catch (launchError: any) {
      console.error('Chrome launch error:', launchError.message || launchError);
      return null;
    } finally {
      if (chrome) {
        try {
          await chrome.kill();
        } catch (e) {}
      }
    }
  } catch (globalError: any) {
    console.error('Lighthouse service global error:', globalError.message || globalError);
    return null;
  }
};
