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
exports.generateGroqRoast = void 0;
// @ts-ignore
const groq_sdk_1 = __importDefault(require("groq-sdk"));
let groqClient = null;
const getGroqClient = () => {
    if (!groqClient) {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey)
            return null;
        groqClient = new groq_sdk_1.default({ apiKey });
    }
    return groqClient;
};
const generateGroqRoast = (metadata_1, ...args_1) => __awaiter(void 0, [metadata_1, ...args_1], void 0, function* (metadata, scores = null) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const client = getGroqClient();
    if (!client)
        throw new Error("Groq API key not configured.");
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
1. A "Design Score" from 0–100.
2. A punchy roast paragraph (funny but helpful, under 120 words).
3. 4–5 actionable, specific suggestions.

Return ONLY valid JSON:
{
  "designScore": <number>,
  "roast": "...",
  "suggestions": ["...", "...", "...", "..."]
}
`;
    try {
        const chatCompletion = yield client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" },
        });
        const parsed = JSON.parse(((_h = (_g = chatCompletion.choices[0]) === null || _g === void 0 ? void 0 : _g.message) === null || _h === void 0 ? void 0 : _h.content) || "{}");
        return {
            score: parsed.designScore || 50,
            roast: parsed.roast || 'Could not generate roast.',
            suggestions: parsed.suggestions || []
        };
    }
    catch (error) {
        console.error("[Groq] Error:", error.message);
        throw error;
    }
});
exports.generateGroqRoast = generateGroqRoast;
