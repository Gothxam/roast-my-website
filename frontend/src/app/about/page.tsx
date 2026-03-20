import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flame, Cpu, Globe, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About | Roast My Website",
  description: "Learn about the AI-powered website roasting tool that gives you brutal, honest feedback about your website's design, SEO, and performance.",
};

const glass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-24 pt-8 px-4 md:px-10">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-10 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">About Roast My Website</h1>
          </div>
          <p className="text-lg text-gray-400 leading-relaxed">
            The honest feedback tool that your polite developer friends were too nice to give you.
          </p>
        </div>

        <div className="space-y-6">
          <div className={`${glass} p-8`}>
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
            <h2 className="text-xl font-bold text-white mb-4">What is this?</h2>
            <p className="text-gray-300 leading-relaxed">
              Roast My Website is an AI-powered website audit tool that combines real browser scraping, 
              structural analysis, and large language models to give you the kind of brutally honest, 
              actionable feedback a senior frontend developer would give during a code review — 
              minus the awkward office politics.
            </p>
            <p className="text-gray-400 leading-relaxed mt-4">
              Instead of dry metric reports, you get a personality. The AI roasts your website the way 
              a seasoned developer would: noticing your missing meta description, your cryptic 
              "Click Here" buttons, and your suspiciously absent H1 tags — all with a side of sarcasm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Globe className="w-5 h-5" />, color: "cyan", title: "Real Browser", desc: "We actually visit your site in a real headless browser, not just a simple HTTP request." },
              { icon: <Cpu className="w-5 h-5" />, color: "purple", title: "AI Analysis", desc: "Google Gemini reads your site structure and writes a personalised, witty audit report." },
              { icon: <Zap className="w-5 h-5" />, color: "yellow", title: "Actionable", desc: "Every roast comes with specific, numbered suggestions you can actually implement." },
            ].map(({ icon, color, title, desc }) => (
              <div key={title} className={`${glass} p-6`}>
                <div className={`p-2 rounded-xl bg-${color}-500/10 border border-${color}-500/20 w-fit mb-4`}>
                  <span className={`text-${color}-400`}>{icon}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className={`${glass} p-8`}>
            <h2 className="text-xl font-bold text-white mb-4">Who is this for?</h2>
            <ul className="space-y-3 text-gray-300">
              {[
                "Developers who want a fast second opinion before shipping",
                "Designers who want to catch SEO and accessibility gaps early",
                "Founders reviewing their startup's website before a launch",
                "Students learning frontend development and wanting real feedback",
                "Anyone brave enough to have their site publicly evaluated",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-orange-400 mt-1">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${glass} p-8`}>
            <h2 className="text-xl font-bold text-white mb-4">Privacy & Data</h2>
            <p className="text-gray-300 leading-relaxed">
              We do not store, log, or share the URLs you submit or the results generated. 
              Each analysis is ephemeral — processed in memory and discarded immediately. 
              We only visit your site to scrape publicly accessible page structure (title, headings, meta tags) — 
              the same information any search engine crawler would see.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
