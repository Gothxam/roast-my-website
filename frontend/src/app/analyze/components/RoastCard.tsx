import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { AnalysisResult } from "@/types/analyze";

interface RoastCardProps {
  result: AnalysisResult;
  scoreColor: string;
  scoreLabel: string;
}

const glass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

export default function RoastCard({ result, scoreColor, scoreLabel }: RoastCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${glass} p-8 relative overflow-hidden`}
    >
      {/* Gradient border accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl" />

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20">
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">The Roast</h2>
          <p className="text-xs text-gray-500">Honest feedback from your AI senior dev</p>
        </div>
        <div className="ml-auto px-3 py-1 rounded-full text-xs font-medium border"
          style={{ borderColor: scoreColor + "40", color: scoreColor, background: scoreColor + "10" }}>
          {scoreLabel}
        </div>
      </div>

      {/* Quote block */}
      <div className="relative pl-5 border-l-2 border-orange-500/40">
        <p className="text-base md:text-lg leading-relaxed text-gray-200 font-normal">
          {result.roast.roast}
        </p>
      </div>

      {/* Site metadata strip */}
      {(result.metadata.title || result.metadata.description) && (
        <div className="mt-6 p-4 rounded-2xl bg-black/20 border border-white/5 space-y-1">
          {result.metadata.title && (
            <p className="text-sm text-gray-300"><span className="text-gray-500 font-medium">Title: </span>{result.metadata.title}</p>
          )}
          {result.metadata.description && (
            <p className="text-sm text-gray-400"><span className="text-gray-500 font-medium">Description: </span>{result.metadata.description}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
