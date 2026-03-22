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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ override: true });
process.on('unhandledRejection', (reason, promise) => {
    console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('[CRITICAL] Uncaught Exception:', err);
    // Optional: process.exit(1); depending on if you want it to restart
});
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const puppeteer_1 = require("./services/puppeteer");
const openai_1 = require("./services/openai");
const gemini_1 = require("./services/gemini");
const groq_1 = require("./services/groq");
// @ts-ignore
const express_rate_limit_1 = require("express-rate-limit");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Roast My Website backend is running!' });
});
const apiRouter = express_1.default.Router();
// 1. Rate Limiting (2 requests per day per IP)
const analyzeLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 24 * 60 * 60 * 1000, // 1 day
    max: 2,
    message: {
        error: "Daily limit reached. Try again tomorrow."
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// 2. Simple In-Memory Cache
const cache = new Map();
// Fetch Lighthouse scores from Browserless.io
const fetchLighthouseScores = (url) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const token = process.env.BROWSERLESS_API_KEY;
    if (!token) {
        console.log('[Lighthouse] BROWSERLESS_API_KEY not set, skipping scores.');
        return null;
    }
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout
        console.log(`[Lighthouse] Requesting scores from Browserless.io for ${url}...`);
        const resp = yield fetch(`https://chrome.browserless.io/performance?token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url,
            }),
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!resp.ok) {
            const errText = yield resp.text();
            throw new Error(`Browserless responded with ${resp.status}: ${errText.slice(0, 100)}`);
        }
        const result = yield resp.json();
        // Support standard LHR or wrapped 'data'/'report'/'lhr'
        const report = result.categories ? result : (result.data || result.report || result.lhr);
        if (!report || !report.categories) {
            return null;
        }
        const { categories } = report;
        const scores = {
            performance: Math.round((((_a = categories.performance) === null || _a === void 0 ? void 0 : _a.score) || 0) * 100),
            accessibility: Math.round((((_b = categories.accessibility) === null || _b === void 0 ? void 0 : _b.score) || 0) * 100),
            bestPractices: Math.round((((_c = categories['best-practices']) === null || _c === void 0 ? void 0 : _c.score) || 0) * 100),
            seo: Math.round((((_d = categories.seo) === null || _d === void 0 ? void 0 : _d.score) || 0) * 100),
        };
        console.log('[Lighthouse] Scores received:', scores);
        return scores;
    }
    catch (err) {
        console.warn('[Lighthouse] Failed, continuing without scores:', err.message || err);
        return null;
    }
});
apiRouter.post('/analyze', analyzeLimiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    // Check Cache
    if (cache.has(url)) {
        console.log(`[CACHE] Returning cached result for ${url}`);
        return res.json(cache.get(url));
    }
    try {
        // Step 1: Scrape rich page data via Browserless (no local Chrome)
        console.log(`[1/3] Fetching metadata for ${url}...`);
        const metadata = yield (0, puppeteer_1.fetchPageMetadata)(url);
        if (metadata.loadError && metadata.title === '') {
            return res.status(400).json({ error: `Failed to fetch URL: ${metadata.loadError}` });
        }
        // Step 2: Optional Lighthouse scores from external worker
        console.log(`[2/3] Fetching Lighthouse scores...`);
        const scores = yield fetchLighthouseScores(url);
        // Step 3: Generate roast with AI (Groq → Gemini → OpenAI → Mock)
        console.log(`[3/3] Generating roast...`);
        let roastData;
        const hasGroqKey = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here';
        const hasGeminiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
        if (hasGroqKey) {
            try {
                console.log('Attempting Groq for roast generation...');
                roastData = yield (0, groq_1.generateGroqRoast)(metadata, scores);
            }
            catch (groqError) {
                console.warn('Groq failed, falling back to Gemini:', groqError.message);
                if (hasGeminiKey) {
                    try {
                        roastData = yield (0, gemini_1.generateGeminiRoast)(metadata, scores);
                    }
                    catch (geminiError) {
                        roastData = yield (0, openai_1.generateRoast)(metadata, scores);
                    }
                }
                else {
                    roastData = yield (0, openai_1.generateRoast)(metadata, scores);
                }
            }
        }
        else if (hasGeminiKey) {
            try {
                console.log('No Groq key, attempting Gemini...');
                roastData = yield (0, gemini_1.generateGeminiRoast)(metadata, scores);
            }
            catch (geminiError) {
                console.error('Gemini failed, falling back to OpenAI/Mock:', geminiError.message);
                roastData = yield (0, openai_1.generateRoast)(metadata, scores);
            }
        }
        else {
            console.log('No premium AI keys found, using OpenAI/Mock...');
            roastData = yield (0, openai_1.generateRoast)(metadata, scores);
        }
        const finalResponse = { url, metadata, scores, roast: roastData };
        // Save to Cache
        cache.set(url, finalResponse);
        res.json(finalResponse);
    }
    catch (error) {
        console.error('Error in /analyze route:', error);
        res.status(500).json({
            error: 'An error occurred during analysis',
            details: error.message,
        });
    }
}));
app.use('/api', apiRouter);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
