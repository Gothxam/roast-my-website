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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const puppeteer_1 = require("./services/puppeteer");
const lighthouse_1 = require("./services/lighthouse");
const openai_1 = require("./services/openai");
const gemini_1 = require("./services/gemini");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Roast My Website backend is running!' });
});
// Setup api router
const apiRouter = express_1.default.Router();
apiRouter.post('/analyze', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }
    try {
        // 1. Fetch metadata (Puppeteer)
        console.log(`[1/3] Fetching metadata for a ${url}...`);
        const metadata = yield (0, puppeteer_1.fetchPageMetadata)(url);
        if (metadata.loadError && metadata.title === '') {
            return res.status(400).json({ error: `Failed to fetch URL: ${metadata.loadError}` });
        }
        // 2. Run Lighthouse Audit
        console.log(`[2/3] Running Lighthouse audit for ${url}...`);
        const scores = yield (0, lighthouse_1.runLighthouseAudit)(url);
        // 3. Generate Roast (Gemini -> OpenAI -> Mock)
        console.log(`[3/3] Generating roast...`);
        let roastData;
        const hasGeminiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
        if (hasGeminiKey) {
            try {
                console.log("Attempting Gemini for roast generation...");
                roastData = yield (0, gemini_1.generateGeminiRoast)(metadata, scores);
            }
            catch (geminiError) {
                console.error("Gemini failed, falling back to OpenAI/Mock:", geminiError.message || geminiError);
                console.log("Falling back to OpenAI (or Mock if OpenAI missing)...");
                roastData = yield (0, openai_1.generateRoast)(metadata, scores);
            }
        }
        else {
            console.log("No Gemini key found, using OpenAI (or Mock if OpenAI missing)...");
            roastData = yield (0, openai_1.generateRoast)(metadata, scores);
        }
        // Provide the combined payload to the frontend
        res.json({
            url,
            metadata,
            scores,
            roast: roastData
        });
    }
    catch (error) {
        console.error('Error in /analyze route:', error);
        // Emergency Fallback: If everything fails, return a funny "Technical Difficulty" roast
        // so the UX remains premium and "in-character"
        const emergencyRoast = {
            score: 404, // Funny "Not Found" score
            roast: "Listen, I tried to roast your site, but the heat was so intense my AI brains actually melted. Or maybe your site is so 'unique' that the servers simply gave up. Either way, check your internet or my API keys and try again before I start charging you for my therapy.",
            suggestions: [
                "Check if your API keys in .env are actually valid.",
                "Stop overwhelming me with so many roast requests!",
                "Double-check your internet connection.",
                "Maybe just build a better site so I don't have to work so hard?"
            ]
        };
        res.json({
            url: req.body.url || 'unknown',
            metadata: { title: 'Unknown', description: 'Analysis Error', headings: [], loadError: error.message },
            scores: { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 },
            roast: emergencyRoast
        });
    }
}));
app.use('/api', apiRouter);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
