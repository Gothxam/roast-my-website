import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Globe, Braces, Cpu, BarChart, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | Roast My Website",
  description: "Learn how Roast My Website uses real browser scraping, Lighthouse auditing, and AI to generate honest website feedback.",
};

const glass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

const steps = [
  {
    num: "01",
    icon: <Globe className="w-6 h-6" />,
    color: "cyan",
    title: "Real Browser Visit",
    description: "When you submit a URL, we launch a real headless Chrome browser (via Browserless.io) and visit your site. No tricks — we see what your actual users see.",
    details: [
      "Navigates to your URL with a real browser engine",
      "Waits for the page to fully load (DOM + network idle)",
      "Extracts headings, meta tags, images, buttons, and body text",
      "Counts missing alt attributes on images",
    ],
  },
  {
    num: "02",
    icon: <BarChart className="w-6 h-6" />,
    color: "orange",
    title: "Lighthouse Audit (Optional)",
    description: "If the Lighthouse worker is configured, we run Google's official Lighthouse engine on your site in mobile mode and collect performance, accessibility, SEO, and best-practice scores.",
    details: [
      "Runs in mobile formFactor for realistic scoring",
      "Measures Core Web Vitals (loading, interactivity, visual stability)",
      "Checks ARIA labels, color contrast, and focus management",
      "Returns scores from 0–100 per category",
    ],
  },
  {
    num: "03",
    icon: <Braces className="w-6 h-6" />,
    color: "purple",
    title: "Data Structuring",
    description: "All scraped data is combined into a structured JSON payload — title, description, headings, accessibility signals, images, Lighthouse scores — and formatted for the AI prompt.",
    details: [
      "Page title and meta description evaluated for SEO",
      "Heading hierarchy analysed for document structure",
      "Images assessed for alt-text coverage",
      "Available Lighthouse scores included in context",
    ],
  },
  {
    num: "04",
    icon: <Cpu className="w-6 h-6" />,
    color: "green",
    title: "AI Roast Generation",
    description: "The structured data is sent to Google Gemini (with fallback to OpenAI). The AI acts as a senior frontend developer and writes a personalised, witty audit.",
    details: [
      "Tries multiple Gemini models with automatic fallback",
      "AI calculates a Design Score based on the actual evidence",
      "Writes a personalised roast grounded in real data",
      "Generates 4–5 specific, actionable improvement suggestions",
    ],
  },
  {
    num: "05",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "pink",
    title: "Results Delivered",
    description: "Everything — roast text, vibe score, page insights, and optional Lighthouse metrics — is sent back to your browser and displayed with a dramatic reveal.",
    details: [
      "Animated vibe score dial with color-coded rating",
      "Full roast text displayed prominently",
      "Numbered, actionable suggestions with hover effects",
      "Page insights panel with real scraped counts",
    ],
  },
];

const colorMap: Record<string, string> = {
  cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  green: "text-green-400 bg-green-500/10 border-green-500/20",
  pink: "text-pink-400 bg-pink-500/10 border-pink-500/20",
};

const accentMap: Record<string, string> = {
  cyan: "via-cyan-500", orange: "via-orange-500", purple: "via-purple-500",
  green: "via-green-500", pink: "via-pink-500",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen pb-24 pt-8 px-4 md:px-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">How the Roast Works</h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Five steps from URL submission to brutal, honest feedback — no black box magic.
          </p>
        </div>

        <div className="space-y-5">
          {steps.map((step) => (
            <div key={step.num} className={`${glass} p-8 relative overflow-hidden`}>
              <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent ${accentMap[step.color]} to-transparent`} />
              <div className="flex items-start gap-5">
                <div className={`flex-shrink-0 p-3 rounded-2xl border ${colorMap[step.color]}`}>
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-gray-600">{step.num}</span>
                    <h2 className="text-lg font-bold text-white">{step.title}</h2>
                  </div>
                  <p className="text-gray-400 leading-relaxed mb-4">{step.description}</p>
                  <ul className="space-y-1.5">
                    {step.details.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-gray-500">
                        <span className={`mt-1 ${colorMap[step.color].split(" ")[0]}`}>•</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`${glass} p-8 mt-6 text-center`}>
          <h2 className="text-xl font-bold text-white mb-3">How is the Vibe Score calculated?</h2>
          <p className="text-gray-400 leading-relaxed max-w-xl mx-auto">
            The AI calculates the Vibe Score itself based on the evidence it finds — heading structure, 
            meta data quality, image accessibility, content clarity, and Lighthouse scores when available. 
            There is no fixed formula: the score reflects the AI's holistic judgment, 
            mimicking how a senior developer would rate a site at first glance.
          </p>
        </div>
      </div>
    </main>
  );
}
