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
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return null;
        }
        genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    return genAI;
};
const generateGeminiRoast = (metadata, scores) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const client = getGeminiClient();
    if (!client) {
        throw new Error("Gemini API key not configured.");
    }
    // Use gemini-flash-lite-latest (Lower resource usage, often better free tier availability)
    const model = client.getGenerativeModel({
        model: "gemini-flash-lite-latest",
    });
    const prompt = `
You are a senior frontend developer reviewing a website.

Your job is to give honest, witty, slightly sarcastic but constructive feedback about the site — similar to a senior developer doing a code review.

The tone should be:
• humorous
• insightful
• slightly sarcastic
• but NEVER insulting or disrespectful

Your goal is to help the website owner understand what works, what doesn't, and how they can improve it.

Website Data:

Title: ${metadata.title}
Description: ${metadata.description}

Headings (H1/H2/H3):
${metadata.headings.join('\n')}

Lighthouse Audit Scores:
Performance: ${(scores === null || scores === void 0 ? void 0 : scores.performance) || 'N/A'}
Accessibility: ${(scores === null || scores === void 0 ? void 0 : scores.accessibility) || 'N/A'}
Best Practices: ${(scores === null || scores === void 0 ? void 0 : scores.bestPractices) || 'N/A'}
SEO: ${(scores === null || scores === void 0 ? void 0 : scores.seo) || 'N/A'}

Analyze the website and provide:

1. A "Design Score" from 0–100 based on the structure, metadata quality, and likely UX clarity.
2. A short roast paragraph that is funny but constructive.
3. 3–5 actionable suggestions to improve the website.

Important rules:
• Focus on real UX, design, SEO, and performance insights.
• Make the roast entertaining but helpful.
• Do NOT insult the developer.
• Do NOT exaggerate problems.
• Keep the roast under 120 words.

Return ONLY valid JSON.

JSON format:
{
  "designScore": 65,
  "roast": "Constructive roast here...",
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}
`;
    // List of models to try in order based on user's available quota
    const modelsToTry = [
        "gemini-2.0-flash", // First choice, often good availability
        "gemini-2.5-flash-lite", // Second choice, lite models have generous limits
        "gemini-2.5-pro", // Third choice, powerful but might have stricter rate limits
        "gemma-3-27b-it" // Fallback to Gemma
    ];
    let lastError = null;
    for (const modelName of modelsToTry) {
        try {
            console.log(`[Gemini] Attempting generation with model: ${modelName}`);
            const model = client.getGenerativeModel({ model: modelName });
            const result = yield model.generateContent(prompt);
            const response = yield result.response;
            let text = response.text();
            // Clean up markdown code blocks if the model returns them
            text = text.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(text);
            console.log(`[Gemini] Successfully generated roast using ${modelName}`);
            return {
                score: parsed.designScore || 50,
                roast: parsed.roast || 'Could not generate roast.',
                suggestions: parsed.suggestions || ['Check console logs.']
            };
        }
        catch (error) {
            console.warn(`[Gemini] Model ${modelName} failed:`, error.message || error);
            lastError = error;
            // If it's a quota error (429) or resource exhausted, continue to the next model.
            // If we see 404, we also continue as the model might not be accessible.
            if (((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('429')) ||
                ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes('quota')) ||
                ((_c = error.message) === null || _c === void 0 ? void 0 : _c.includes('exhausted')) ||
                ((_d = error.message) === null || _d === void 0 ? void 0 : _d.includes('404')) ||
                ((_e = error.message) === null || _e === void 0 ? void 0 : _e.includes('not found'))) {
                console.log(`[Gemini] Trying next fallback model...`);
                continue;
            }
            // For other critical errors (like invalid API key 401), we might want to just break out,
            // but to be safe we'll keep trying others just in case it's model-specific.
        }
    }
    // If we exhausted all models
    console.error('[Gemini] All Gemini models failed. Last error:', (lastError === null || lastError === void 0 ? void 0 : lastError.message) || lastError);
    throw new Error(`All Gemini models exhausted. Last error: ${(lastError === null || lastError === void 0 ? void 0 : lastError.message) || 'Unknown'}`);
});
exports.generateGeminiRoast = generateGeminiRoast;
