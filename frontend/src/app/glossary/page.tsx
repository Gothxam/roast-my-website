import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Glossary | Roast My Website",
  description: "Understand the terminology used in website auditing — from Lighthouse scores to meta descriptions and Core Web Vitals.",
};

const glass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

const terms = [
  {
    term: "Vibe Score",
    category: "Our Metric",
    color: "orange",
    definition: "Our overall rating (0–100) for a website, calculated by the AI based on structural signals like headings, meta data, image accessibility, and Lighthouse scores. It reflects the holistic quality impression a senior developer would have at first glance.",
  },
  {
    term: "Meta Description",
    category: "SEO",
    color: "cyan",
    definition: "A short HTML tag (<meta name=\"description\">) that summarises a web page for search engines. It typically appears under your page title in search results. Missing or generic descriptions directly hurt your search ranking and click-through rate.",
  },
  {
    term: "Alt Text",
    category: "Accessibility",
    color: "green",
    definition: "The `alt` attribute on <img> elements describes an image in text form. Screen readers use this for visually impaired users. Search engines also use alt text to understand images. Missing alt text is one of the most common and easily fixed accessibility violations.",
  },
  {
    term: "H1 / Heading Hierarchy",
    category: "SEO + Structure",
    color: "purple",
    definition: "HTML headings from <h1> to <h6> create a document outline. Every page should have exactly one <h1> (the main topic), followed by logical subheadings. A broken or absent heading hierarchy confuses both search engines and screen readers.",
  },
  {
    term: "Core Web Vitals",
    category: "Performance",
    color: "blue",
    definition: "Google's set of specific performance signals: Largest Contentful Paint (LCP, how fast the main content loads), First Input Delay (FID, responsiveness), and Cumulative Layout Shift (CLS, visual stability). These directly affect Google search ranking.",
  },
  {
    term: "Lighthouse",
    category: "Tooling",
    color: "yellow",
    definition: "An open-source automated auditing tool built by Google. It runs inside Chrome and measures Performance, Accessibility, Best Practices, SEO, and (optionally) PWA compliance. Scores are 0–100 per category. Our Lighthouse Worker runs this optionally.",
  },
  {
    term: "Headless Browser",
    category: "Infrastructure",
    color: "pink",
    definition: "A real web browser (Chrome in our case) that runs without a visible UI. We use it to visit your site exactly like a user would, allowing us to scrape DOM content that requires JavaScript to render — unlike simple HTTP fetch requests.",
  },
  {
    term: "Browserless",
    category: "Infrastructure",
    color: "cyan",
    definition: "A cloud service that hosts headless Chrome browsers. We connect to their service to run our Puppeteer scraping, eliminating the need to run Chrome on our own server and saving substantial RAM.",
  },
  {
    term: "Puppeteer",
    category: "Tooling",
    color: "purple",
    definition: "A Node.js library that provides a high-level API to control Chrome over the DevTools Protocol. We use it to open your page, wait for it to load, and extract structural data like headings, images, and buttons.",
  },
  {
    term: "Accessibility (a11y)",
    category: "Accessibility",
    color: "green",
    definition: "The practice of making websites usable by people with disabilities. Common checks include sufficient colour contrast, keyboard navigation support, ARIA labels, and meaningful image alt text. Lighthouse measures this as a 0–100 score.",
  },
  {
    term: "Call to Action (CTA)",
    category: "UX",
    color: "orange",
    definition: "A button or link that prompts a user to take a specific action — 'Get Started', 'Sign Up', 'Buy Now'. Vague CTAs like 'Click Here' or 'Submit' are bad for both UX and SEO. We check your button text as part of the analysis.",
  },
  {
    term: "Gemini",
    category: "AI",
    color: "blue",
    definition: "Google's family of large language models. We use it (specifically gemini-2.0-flash or similar) to interpret the scraped page data and generate the roast text and design score. If Gemini is unavailable, we fall back to OpenAI's GPT models.",
  },
];

const colorMap: Record<string, string> = {
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  green: "text-green-400 bg-green-500/10 border-green-500/20",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  yellow: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
};

export default function GlossaryPage() {
  return (
    <main className="min-h-screen pb-24 pt-8 px-4 md:px-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Glossary</h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Plain-English definitions for every term you&apos;ll encounter in your roast report.
          </p>
        </div>

        <div className="space-y-4">
          {terms.map((item) => (
            <div key={item.term} className={`${glass} p-6 flex gap-5 items-start`}>
              <div className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-semibold border ${colorMap[item.color]}`}>
                {item.category}
              </div>
              <div>
                <h2 className="font-bold text-white text-base mb-1">{item.term}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{item.definition}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
