import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { AnalysisResult } from "@/types/analyze";

interface SuggestionsCardProps {
  suggestions: string[];
}

const glass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

export default function SuggestionsCard({ suggestions }: SuggestionsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`${glass} p-8 relative overflow-hidden`}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <Lightbulb className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">How to Suck Less</h2>
          <p className="text-xs text-gray-500">{suggestions.length} actionable improvements</p>
        </div>
      </div>

      <ul className="space-y-3">
        {suggestions.map((suggestion, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + idx * 0.08 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all group"
          >
            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 font-bold text-sm border border-purple-500/20 group-hover:bg-purple-500/25 transition-colors">
              {idx + 1}
            </span>
            <p className="text-gray-300 leading-relaxed text-sm">{suggestion}</p>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
