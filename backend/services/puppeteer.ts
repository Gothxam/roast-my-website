import puppeteer from 'puppeteer-core';

export interface PageMetadata {
  title: string;
  description: string;
  headings: string[];
  images: { src: string; alt: string }[];
  links: { text: string; href: string }[];
  buttons: string[];
  textContent: string;
  loadError?: string;
}

const getBrowserlessEndpoint = (): string => {
  const token = process.env.BROWSERLESS_API_KEY;
  if (!token) throw new Error('BROWSERLESS_API_KEY environment variable is not set.');
  return `wss://chrome.browserless.io?token=${token}`;
};

export const fetchPageMetadata = async (url: string): Promise<PageMetadata> => {
  let browser;
  try {
    console.log('[Puppeteer] Connecting to Browserless...');
    browser = await puppeteer.connect({
      browserWSEndpoint: getBrowserlessEndpoint(),
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const metadata = await page.evaluate(() => {
      const title = document.title || '';
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';

      // Headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map(el => `${el.tagName.toLowerCase()}: ${(el.textContent || '').trim()}`)
        .filter(h => h.length > 5)
        .slice(0, 20);

      // Images (check for missing alt text)
      const images = Array.from(document.querySelectorAll('img'))
        .slice(0, 20)
        .map(img => ({ src: img.src || '', alt: img.getAttribute('alt') || '' }));

      // Links
      const links = Array.from(document.querySelectorAll('a[href]'))
        .slice(0, 20)
        .map(a => ({ text: (a.textContent || '').trim().slice(0, 60), href: (a as HTMLAnchorElement).href }));

      // Buttons
      const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], a.btn, a.button'))
        .slice(0, 10)
        .map(el => (el.textContent || '').trim())
        .filter(t => t.length > 0);

      // Visible body text (first 1000 chars for AI context)
      const bodyText = (document.body?.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 1000);

      return { title, description: metaDescription, headings, images, links, buttons, textContent: bodyText };
    });

    console.log(`[Puppeteer] Successfully scraped: ${url}`);
    return metadata;

  } catch (error: any) {
    console.error('[Puppeteer] Browserless error:', error.message || error);
    return {
      title: '',
      description: '',
      headings: [],
      images: [],
      links: [],
      buttons: [],
      textContent: '',
      loadError: error.message || 'Failed to connect to Browserless or fetch page data'
    };
  } finally {
    if (browser) {
      await browser.disconnect();
    }
  }
};
