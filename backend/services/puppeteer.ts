import puppeteer from 'puppeteer';

export interface PageMetadata {
  title: string;
  description: string;
  headings: string[];
  screenshot?: string;
  loadError?: string;
}

export const fetchPageMetadata = async (url: string): Promise<PageMetadata> => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--no-first-run',
        '--no-zygote',
        '--disable-features=IsolateOrigins,site-per-process' // Saves RAM by reducing processes
      ],
      defaultViewport: { width: 1280, height: 800 }
    });

    const page = await browser.newPage();
    // Set a common desktop viewpoint
    await page.setViewport({ width: 1440, height: 900 });
    
    // Go to the URL and wait for network to be idle
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const metadata = await page.evaluate(() => {
      const title = document.title;
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      
      const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(el => {
        const tag = el.tagName.toLowerCase();
        const text = (el.textContent || '').trim();
        return `${tag}: ${text}`;
      }).filter(h => h.length > 5);

      return { title, description: metaDescription, headings: headings.slice(0, 20) };
    });

    // Optional: Take a thumbnail screenshot
    const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: 60 });
    const screenshot = Buffer.from(screenshotBuffer).toString('base64');
    
    return {
      ...metadata,
      screenshot: `data:image/jpeg;base64,${screenshot}`
    };
  } catch (error: any) {
    console.error('Puppeteer service error:', error);
    return {
      title: '',
      description: '',
      headings: [],
      loadError: error.message || 'Failed to fetch page data'
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
