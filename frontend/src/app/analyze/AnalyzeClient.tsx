"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, ExternalLink, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { AnalysisResult } from "@/types/analyze";
import LoadingScreen from "./components/LoadingScreen";
import ErrorScreen from "./components/ErrorScreen";
import RoastCard from "./components/RoastCard";
import SuggestionsCard from "./components/SuggestionsCard";
import HeadingsCard from "./components/HeadingsCard";
import SidebarStats from "./components/SidebarStats";
import { trackEvent } from "@/components/UserTracker";

const loadingJokes = [
  "Waking up the senior dev...",
  "Brewing toxic amounts of coffee...",
  "Judging your padding preferences...",
  "Checking if you still use jQuery...",
  "Counting your missing alt texts...",
  "Preparing the roast. Hope you have thick skin...",
  "Reading your headings with a raised eyebrow...",
  "Wondering why your CTA says 'Click Here'...",
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
    if (!url) { router.push("/"); return; }
    const abortController = new AbortController();

    const fetchAnalysis = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiBase}/api/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const msg = errorData.details ? `${errorData.error}: ${errorData.details}` : (errorData.error || "Failed to analyze website");
          throw new Error(msg);
        }

        const data: AnalysisResult = await response.json();
        setResult(data);
        setLoading(false);
        trackEvent("roast");

        if (data.roast.score >= 70) {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "An unexpected error occurred");
        setLoading(false);
      }
    };

    fetchAnalysis();
    return () => abortController.abort();
  }, [url, router]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setJokeIndex((prev) => (prev + 1) % loadingJokes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) return <LoadingScreen url={url!} jokeIndex={jokeIndex} loadingJokes={loadingJokes} />;
  if (error || !result) return <ErrorScreen error={error} />;

  const score = result.roast.score;
  const scoreColor = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreLabel = score >= 75 ? "Looking Good 🎉" : score >= 50 ? "Needs Work 🔧" : "Yikes! 🔥";

  return (
    <main className="min-h-screen pb-24 pt-6 px-4 md:px-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => router.push("/")}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-white">Results for</h1>
            <a href={url || "#"} target="_blank" rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 truncate max-w-[200px] md:max-w-lg flex items-center gap-1 transition-colors text-sm">
              {url} <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all hover:scale-105 active:scale-95"
            title="Re-analyze"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RoastCard result={result} scoreColor={scoreColor} scoreLabel={scoreLabel} />
            <SuggestionsCard suggestions={result.roast.suggestions} />
            <HeadingsCard headings={result.metadata.headings} />
          </div>
          <SidebarStats result={result} score={score} scoreColor={scoreColor} scoreLabel={scoreLabel} />
        </div>
      </div>
    </main>
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
