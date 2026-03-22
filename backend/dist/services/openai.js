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
exports.generateRoast = void 0;
const openai_1 = __importDefault(require("openai"));
let openaiClient = null;
const getOpenAIClient = () => {
    if (!openaiClient) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey || apiKey === 'your_openai_api_key_here')
            return null;
        openaiClient = new openai_1.default({ apiKey });
    }
    return openaiClient;
};
const generateRoast = (metadata_1, ...args_1) => __awaiter(void 0, [metadata_1, ...args_1], void 0, function* (metadata, scores = null) {
    var _a, _b, _c, _d, _e;
    const isMock = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here';
    if (isMock) {
        return {
            score: 72,
            roast: "I couldn't fully roast your website — running in mock mode. Add a GEMINI_API_KEY or OPENAI_API_KEY to your .env for real feedback!",
            suggestions: [
                "Set a GEMINI_API_KEY in .env to enable real AI roasting.",
                "Ensure your site is publicly accessible.",
                "Make sure headings and meta descriptions are present."
            ]
        };
    }
    const missingAltImages = ((_a = metadata.images) === null || _a === void 0 ? void 0 : _a.filter(img => !img.alt).length) || 0;
    const scoreSection = scores ? `
Lighthouse Scores (Mobile):
- Performance: ${scores.performance}/100
- Accessibility: ${scores.accessibility}/100
- Best Practices: ${scores.bestPractices}/100
- SEO: ${scores.seo}/100` : '';
    const prompt = `
You are a senior frontend developer giving harsh but constructive feedback.

Website Data:
Title: ${metadata.title || 'Missing'}
Meta Description: ${metadata.description || 'Missing'}
Headings: ${((_b = metadata.headings) === null || _b === void 0 ? void 0 : _b.join(', ')) || 'None'}
Buttons: ${((_c = metadata.buttons) === null || _c === void 0 ? void 0 : _c.join(', ')) || 'None'}
Images total: ${((_d = metadata.images) === null || _d === void 0 ? void 0 : _d.length) || 0}, Missing alt text: ${missingAltImages}
Sample content: ${((_e = metadata.textContent) === null || _e === void 0 ? void 0 : _e.slice(0, 400)) || 'None'}
${scoreSection}

Provide a design score 0-100, a short funny roast (under 120 words), and 4 actionable suggestions.
Respond ONLY as JSON: { "designScore": 65, "roast": "...", "suggestions": ["..."] }
`;
    try {
        const openai = getOpenAIClient();
        if (!openai)
            throw new Error('OpenAI client not initialized.');
        const response = yield openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });
        const result = JSON.parse(response.choices[0].message.content || '{}');
        return {
            score: result.designScore || 50,
            roast: result.roast || 'Could not generate roast.',
            suggestions: result.suggestions || []
        };
    }
    catch (error) {
        console.error('OpenAI error:', error.message);
        return {
            score: 0,
            roast: `Failed to generate roast: ${error.message}`,
            suggestions: ['Check your OPENAI_API_KEY in .env.']
        };
    }
});
exports.generateRoast = generateRoast;
