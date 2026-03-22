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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGeminiRoast = void 0;
const generative_ai_1 = require("@google/generative-ai");
let genAI = null;
const getGeminiClient = () => {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'your_gemini_api_key_here')
            return null;
        genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    return genAI;
};
const generateGeminiRoast = (metadata_1, ...args_1) => __awaiter(void 0, [metadata_1, ...args_1], void 0, function* (metadata, scores = null) {
    var _a, _b, _c, _d, _e, _f, _g;
    const client = getGeminiClient();
    if (!client)
        throw new Error("Gemini API key not configured.");
    const modelsToTry = [
        "gemma-3-27b-it",
        "gemini-2.0-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.5-pro"
    ];
    const missingAltImages = ((_a = metadata.images) === null || _a === void 0 ? void 0 : _a.filter(img => !img.alt).length) || 0;
    const totalImages = ((_b = metadata.images) === null || _b === void 0 ? void 0 : _b.length) || 0;
    const lighthouseSection = scores ? `
**Lighthouse Scores (Mobile):**
- Performance: ${scores.performance}/100
- Accessibility: ${scores.accessibility}/100
- Best Practices: ${scores.bestPractices}/100
- SEO: ${scores.seo}/100
` : '';
    const prompt = `
You are a senior frontend developer reviewing a website's structure, content, and performance.

The tone should be: humorous, insightful, slightly sarcastic, but NEVER insulting. Always constructive.

Website Data:
**Title:** ${metadata.title || 'Missing!'}
**Meta Description:** ${metadata.description || 'Missing!'}

**Headings (H1–H6):**
${((_c = metadata.headings) === null || _c === void 0 ? void 0 : _c.length) ? metadata.headings.join('\n') : 'No headings found!'}

**Buttons:** ${((_d = metadata.buttons) === null || _d === void 0 ? void 0 : _d.length) ? metadata.buttons.join(', ') : 'None found'}
**Images:** Total ${totalImages}, Missing alt text: ${missingAltImages}
**Sample Visible Text:** ${((_e = metadata.textContent) === null || _e === void 0 ? void 0 : _e.slice(0, 500)) || 'None'}
**Links on page:** ${((_f = metadata.links) === null || _f === void 0 ? void 0 : _f.length) || 0}
${lighthouseSection}
Provide:
1. A "Design Score" from 0–100. Calculate this YOURSELF based on the evidence above — do NOT use the example number. Low score if major issues found, high if everything looks good.
2. A punchy roast paragraph (funny but helpful, under 120 words).
3. 4–5 actionable, specific suggestions based on what you found.

IMPORTANT: The designScore must reflect your ACTUAL analysis, not the example number.

Return ONLY valid JSON (no code block, no markdown):
{
  "designScore": <YOUR_CALCULATED_SCORE_0_TO_100>,
  "roast": "...",
  "suggestions": ["...", "...", "...", "..."]
}
`;
    let lastError = null;
    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini] Trying model: ${modelName}`);
            const model = client.getGenerativeModel({ model: modelName });
            const result = yield model.generateContent(prompt);
            const response = yield result.response;
            let text = response.text().replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(text);
            console.log(`[Gemini] Success with: ${modelName}`);
            return {
                score: parsed.designScore || 50,
                roast: parsed.roast || 'Could not generate roast.',
                suggestions: parsed.suggestions || []
            };
        }
        catch (error) {
            console.warn(`[Gemini] Model ${modelName} failed:`, error.message);
            lastError = error;
            const msg = ((_g = error.message) === null || _g === void 0 ? void 0 : _g.toLowerCase()) || '';
            if (msg.includes('429') || msg.includes('quota') || msg.includes('exhausted') || msg.includes('404') || msg.includes('not found')) {
                continue;
            }
        }
    }
    throw new Error(`All Gemini models exhausted. Last: ${(lastError === null || lastError === void 0 ? void 0 : lastError.message) || 'Unknown'}`);
});
exports.generateGeminiRoast = generateGeminiRoast;
