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
const puppeteer_1 = __importDefault(require("puppeteer"));
const fetchPageMetadata = (url) => __awaiter(void 0, void 0, void 0, function* () {
    let browser;
    try {
        browser = yield puppeteer_1.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            defaultViewport: null
        });
        const page = yield browser.newPage();
        // Set a common desktop viewpoint
        yield page.setViewport({ width: 1440, height: 900 });
        // Go to the URL and wait for network to be idle
        yield page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        const metadata = yield page.evaluate(() => {
            var _a;
            const title = document.title;
            const metaDescription = ((_a = document.querySelector('meta[name="description"]')) === null || _a === void 0 ? void 0 : _a.getAttribute('content')) || '';
            const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(el => {
                const tag = el.tagName.toLowerCase();
                const text = (el.textContent || '').trim();
                return `${tag}: ${text}`;
            }).filter(h => h.length > 5);
            return { title, description: metaDescription, headings: headings.slice(0, 20) };
        });
        // Optional: Take a thumbnail screenshot
        const screenshotBuffer = yield page.screenshot({ type: 'jpeg', quality: 60 });
        const screenshot = Buffer.from(screenshotBuffer).toString('base64');
        return Object.assign(Object.assign({}, metadata), { screenshot: `data:image/jpeg;base64,${screenshot}` });
    }
    catch (error) {
        console.error('Puppeteer service error:', error);
        return {
            title: '',
            description: '',
            headings: [],
            loadError: error.message || 'Failed to fetch page data'
        };
    }
    finally {
        if (browser) {
            yield browser.close();
        }
    }
});
exports.fetchPageMetadata = fetchPageMetadata;
