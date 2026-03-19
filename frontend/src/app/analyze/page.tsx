"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, AlertTriangle, ShieldCheck, Flame, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

interface AnalysisResult {
  url: string;
  metadata: {
    title: string;
    description: string;
    headings: string[];
    screenshot?: string;
    loadError?: string;
  };
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  roast: {
    score: number;
    roast: string;
    suggestions: string[];
  };
}

const loadingJokes = [
  "Waking up the senior dev...",
  "Brewing toxic amounts of coffee...",
  "Judging your padding preferences...",
  "Running Lighthouse audits...",
  "Checking if you still use jQuery...",
  "Preparing the roast. Hope you have thick skin...",
];

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [jokeIndex, setJokeIndex] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      router.push("/");
      return;
    }

    const abortController = new AbortController();

    const fetchAnalysis = async () => {
      try {
        const getApiUrl = () => {
          // If the user has set a live production API URL, use it
          if (process.env.NEXT_PUBLIC_API_URL) {
            return `${process.env.NEXT_PUBLIC_API_URL}/api/analyze`;
          }
          // Otherwise default to local development
          return "http://localhost:5000/api/analyze";
        };

        const response = await fetch(getApiUrl(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: abortController.signal
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to analyze website");
        }

        const data: AnalysisResult = await response.json();
        setResult(data);
        setLoading(false);

        // trigger confetti for surviving the audit
        if (data.roast.score >= 50) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        setError(err.message || "An unexpected error occurred");
        setLoading(false);
      }
    };

    fetchAnalysis();

    return () => abortController.abort();
  }, [url, router]);

  // Loading joke rotation
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % loadingJokes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[100px] -z-10" />
        <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-8" />
        <AnimatePresence mode="wait">
          <motion.p
            key={jokeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl md:text-2xl text-white font-medium tracking-wide text-center px-4"
          >
            {loadingJokes[jokeIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="text-gray-500 mt-4 text-sm max-w-sm text-center">
          Analyzing {url}... this usually takes about 10-20 seconds.
        </p>
      </main>
    );
  }

  if (error || !result) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Well, this is embarrassing.</h1>
        <p className="text-gray-400 max-w-md mb-8">{error || "Something went terribly wrong while roasting your site."}</p>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Try another URL
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 p-6 md:p-12 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => router.push("/")}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Results for</h1>
            <p className="text-purple-400 truncate max-w-[200px] md:max-w-md">{url}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Box */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <Flame className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold">The Roast</h2>
              </div>
              <p className="text-lg leading-relaxed text-gray-300 italic">
                "{result.roast.roast}"
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-bold">How to suck less</h2>
              </div>
              <ul className="space-y-4">
                {result.roast.suggestions.map((suggestion, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-black/30 border border-white/5"
                  >
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm">
                      {idx + 1}
                    </span>
                    <p className="text-gray-300">{suggestion}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Scores Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Overall Score Dial */}
            <div className="p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col items-center justify-center text-center">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">Overall Vibe Score</h3>
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="transparent"
                    stroke={result.roast.score > 70 ? '#22c55e' : result.roast.score > 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 56}
                    initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - result.roast.score / 100) }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{result.roast.score}</span>
                </div>
              </div>
            </div>

            {/* Lighthouse Metrics */}
            <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl space-y-5">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Lighthouse Audit</h3>
              
              <MetricBar label="Performance" value={result.scores.performance} delay={0.5} />
              <MetricBar label="Accessibility" value={result.scores.accessibility} delay={0.6} />
              <MetricBar label="Best Practices" value={result.scores.bestPractices} delay={0.7} />
              <MetricBar label="SEO" value={result.scores.seo} delay={0.8} />

            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}

function MetricBar({ label, value, delay }: { label: string, value: number, delay: number }) {
  const color = value > 80 ? 'bg-green-500' : value > 50 ? 'bg-yellow-500' : 'bg-red-500';
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-300">{label}</span>
        <span className="font-medium text-white">{value}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </main>
    }>
      <AnalyzeContent />
    </Suspense>
  );
}
