"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.runLighthouseAudit = void 0;
const chromeLauncher = __importStar(require("chrome-launcher"));
const runLighthouseAudit = (url) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    let chrome;
    try {
        const lighthouse = (yield Promise.resolve().then(() => __importStar(require('lighthouse')))).default;
        // Launch chrome in robust headless mode with a fresh port attempt
        try {
            chrome = yield chromeLauncher.launch({
                chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--quiet']
            });
            const options = {
                logLevel: 'error',
                output: 'json',
                onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
                port: chrome.port,
                formFactor: 'desktop',
                screenEmulation: {
                    mobile: false
                },
                settings: {
                    maxWaitForLoad: 90000, // Increased for heavy sites
                    formFactor: 'desktop',
                    screenEmulation: { mobile: false },
                    throttlingMethod: 'provided',
                    skipAudits: ['cumulative-layout-shift']
                }
            };
            // Run lighthouse with an additional internal try block to catch the "performance mark" bug
            try {
                const runnerResult = yield lighthouse(url, options);
                if (!runnerResult || !runnerResult.lhr) {
                    throw new Error('No Lighthouse results');
                }
                const { categories } = runnerResult.lhr;
                const scores = {
                    performance: Math.round((((_a = categories.performance) === null || _a === void 0 ? void 0 : _a.score) || 0) * 100),
                    accessibility: Math.round((((_b = categories.accessibility) === null || _b === void 0 ? void 0 : _b.score) || 0) * 100),
                    bestPractices: Math.round((((_c = categories['best-practices']) === null || _c === void 0 ? void 0 : _c.score) || 0) * 100),
                    seo: Math.round((((_d = categories.seo) === null || _d === void 0 ? void 0 : _d.score) || 0) * 100),
                };
                return scores;
            }
            catch (innerError) {
                if ((_e = innerError.message) === null || _e === void 0 ? void 0 : _e.includes('performance mark')) {
                    console.warn('Lighthouse navigation error (performance mark bug) for:', url);
                }
                else {
                    console.error('Lighthouse execution error:', innerError.message || innerError);
                }
                return null;
            }
        }
        catch (launchError) {
            console.error('Chrome launch error:', launchError.message || launchError);
            return null;
        }
        finally {
            if (chrome) {
                try {
                    yield chrome.kill();
                }
                catch (e) { }
            }
        }
    }
    catch (globalError) {
        console.error('Lighthouse service global error:', globalError.message || globalError);
        return null;
    }
});
exports.runLighthouseAudit = runLighthouseAudit;
