import { useState } from "react";
import { motion } from "framer-motion";
import { Hash, Image, XCircle, MousePointerClick, FileText, Share2, Twitter, Linkedin, Copy, CheckCircle2, MessageCircle } from "lucide-react";
import { AnalysisResult } from "@/types/analyze";
import { trackEvent } from "@/components/UserTracker";

interface SidebarStatsProps {
  result: AnalysisResult;
  score: number;
  scoreColor: string;
  scoreLabel: string;
}

const glass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

function InsightRow({ icon, label, value, valueColor = "text-white" }: {
  icon: React.ReactNode; label: string; value: string | number; valueColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-500">{icon}</span>
      <span className="text-gray-300 text-sm flex-1">{label}</span>
      <span className={`font-bold text-sm ${valueColor}`}>{value}</span>
    </div>
  );
}

function MetricBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const color = value > 80 ? "from-green-500 to-emerald-400" : value > 50 ? "from-yellow-500 to-amber-400" : "from-red-500 to-rose-400";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-400">{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

export default function SidebarStats({ result, score, scoreColor, scoreLabel }: SidebarStatsProps) {
  const [copied, setCopied] = useState(false);
  const missingAlt = result.metadata.images?.filter((i) => !i.alt).length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-5"
    >
      {/* Vibe Score Dial */}
      <div className={`${glass} p-8 flex flex-col items-center text-center relative overflow-hidden`}>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent"
          style={{ backgroundImage: `linear-gradient(to right, transparent, ${scoreColor}, transparent)` }} />
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">Overall Vibe Score</h3>
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 -rotate-90">
            <circle cx="72" cy="72" r="60" fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <motion.circle
              cx="72" cy="72" r="60"
              fill="transparent"
              stroke={scoreColor}
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 60}
              initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - score / 100) }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-white">{score}</span>
            <span className="text-xs text-gray-500 mt-1">/ 100</span>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium" style={{ color: scoreColor }}>{scoreLabel}</p>
      </div>

      {/* Page Insights */}
      <div className={`${glass} p-6 space-y-3`}>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Page Insights</h3>

        <InsightRow icon={<Hash className="w-4 h-4" />} label="Headings Found" value={result.metadata.headings?.length || 0} />
        <InsightRow icon={<Image className="w-4 h-4" />} label="Images" value={result.metadata.images?.length || 0} />
        <InsightRow
          icon={<XCircle className="w-4 h-4" />}
          label="Missing Alt Text"
          value={missingAlt}
          valueColor={missingAlt > 0 ? "text-red-400" : "text-green-400"}
        />
        <InsightRow icon={<MousePointerClick className="w-4 h-4" />} label="Buttons Found" value={result.metadata.buttons?.length || 0} />
        <InsightRow
          icon={<FileText className="w-4 h-4" />}
          label="Meta Description"
          value={result.metadata.description ? "✓ Present" : "✗ Missing"}
          valueColor={result.metadata.description ? "text-green-400" : "text-red-400"}
        />
      </div>

      {/* Lighthouse Performance Scores */}
      {result.scores && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className={`${glass} p-6 space-y-5`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Lighthouse Audit</h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold">Mobile</span>
          </div>
          
          <div className="space-y-4">
            <MetricBar label="Performance" value={result.scores.performance} delay={0.5} />
            <MetricBar label="Accessibility" value={result.scores.accessibility} delay={0.6} />
            <MetricBar label="Best Practices" value={result.scores.bestPractices} delay={0.7} />
            <MetricBar label="SEO" value={result.scores.seo} delay={0.8} />
          </div>
        </motion.div>
      )}

      {/* Share nudge */}
      <div className={`${glass} p-6 space-y-4`}>
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-4 h-4 text-pink-400" />
          <h3 className="text-sm font-bold text-white">Share the shame</h3>
        </div>
        <p className="text-xs text-gray-400">Survived the roast? Let the world see your vibe score.</p>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          {/* Twitter */}
          <button
            onClick={() => {
              const punchline = result.roast.punchline || `I just got a ${score}/100 vibe score 💀🔥`;
              const text = encodeURIComponent(`"${punchline}"\n\nSee my full roast or get yours here:\n`);
              window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, "_blank");
              trackEvent("share");
            }}
            className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2]/20 text-white transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <Twitter className="w-5 h-5 text-[#1DA1F2]" />
            <span className="text-xs font-semibold">Twitter</span>
          </button>
          
          {/* LinkedIn */}
          <button
            onClick={() => {
              const punchline = result.roast.punchline || `I just got a ${score}/100 vibe score 💀🔥`;
              const url = encodeURIComponent(window.location.href);
              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
              trackEvent("share");
            }}
            className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/20 text-white transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            <span className="text-xs font-semibold">LinkedIn</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={() => {
              const punchline = result.roast.punchline || `I just got a ${score}/100 vibe score 💀🔥`;
              const text = encodeURIComponent(`"${punchline}"\n\nSee my full roast at: ${window.location.href}`);
              window.open(`https://wa.me/?text=${text}`, "_blank");
              trackEvent("share");
            }}
            className="flex items-center gap-3 py-3 px-4 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-white transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <span className="text-xs font-semibold">WhatsApp</span>
          </button>
          
          {/* Copy Link */}
          <button
            onClick={() => {
              const punchline = result.roast.punchline || `I just got a ${score}/100 vibe score 💀🔥`;
              const textToCopy = `"${punchline}"\n\nSee my full roast at: ${window.location.href}`;
              navigator.clipboard.writeText(textToCopy);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
              trackEvent("share");
            }}
            className={`flex items-center gap-3 py-3 px-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 group ${
              copied 
                ? "bg-green-500/20 border-green-500/30 text-green-400" 
                : "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-white"
            }`}
          >
            {copied ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-purple-400" />
            )}
            <span className="text-xs font-semibold">
              {copied ? "Copied!" : "Copy Link"}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
