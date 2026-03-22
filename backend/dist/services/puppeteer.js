"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPageMetadata = void 0;
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const getBrowserlessEndpoint = () => {
    const token = process.env.BROWSERLESS_API_KEY;
    if (!token)
        throw new Error('BROWSERLESS_API_KEY environment variable is not set.');
    return `wss://chrome.browserless.io?token=${token}`;
};
const fetchPageMetadata = (url) => __awaiter(void 0, void 0, void 0, function* () {
    let browser;
    try {
        console.log('[Puppeteer] Connecting to Browserless...');
        browser = yield puppeteer_core_1.default.connect({
            browserWSEndpoint: getBrowserlessEndpoint(),
        });
        const page = yield browser.newPage();
        yield page.setViewport({ width: 1280, height: 800 });
        yield page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        yield page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        const metadata = yield page.evaluate(() => {
            var _a, _b;
            const title = document.title || '';
            const metaDescription = ((_a = document.querySelector('meta[name="description"]')) === null || _a === void 0 ? void 0 : _a.getAttribute('content')) || '';
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
                .map(a => ({ text: (a.textContent || '').trim().slice(0, 60), href: a.href }));
            // Buttons
            const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], a.btn, a.button'))
                .slice(0, 10)
                .map(el => (el.textContent || '').trim())
                .filter(t => t.length > 0);
            // Visible body text (first 1000 chars for AI context)
            const bodyText = (((_b = document.body) === null || _b === void 0 ? void 0 : _b.innerText) || '').replace(/\s+/g, ' ').trim().slice(0, 1000);
            return { title, description: metaDescription, headings, images, links, buttons, textContent: bodyText };
        });
        console.log(`[Puppeteer] Successfully scraped: ${url}`);
        return metadata;
    }
    catch (error) {
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
    }
    finally {
        if (browser) {
            yield browser.disconnect();
        }
    }
});
exports.fetchPageMetadata = fetchPageMetadata;
