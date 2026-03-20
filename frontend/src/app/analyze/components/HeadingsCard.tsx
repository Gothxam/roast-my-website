import { motion } from "framer-motion";
import { Hash } from "lucide-react";

interface HeadingsCardProps {
  headings: string[];
}

const glass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

export default function HeadingsCard({ headings }: HeadingsCardProps) {
  if (!headings || headings.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`${glass} p-8 relative overflow-hidden`}
    >
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <Hash className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Heading Structure</h2>
          <p className="text-xs text-gray-500">What your page hierarchy looks like</p>
        </div>
      </div>
      <div
        data-lenis-prevent="true"
        className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10 pr-2"
      >
        {headings.slice(0, 15).map((h, i) => {
          const level = h.split(":")[0];
          const text = h.split(": ").slice(1).join(": ");
          const indent = { h1: 0, h2: 12, h3: 24, h4: 36, h5: 48, h6: 60 }[level] || 0;
          const colors: Record<string, string> = { h1: "text-white font-semibold", h2: "text-gray-200", h3: "text-gray-300", h4: "text-gray-400 text-sm", h5: "text-gray-500 text-sm", h6: "text-gray-500 text-sm" };
          return (
            <div key={i} style={{ paddingLeft: indent }} className={`flex items-center gap-2 ${colors[level] || "text-gray-400 text-sm"}`}>
              <span className="text-xs text-gray-600 uppercase font-mono">{level}</span>
              <span className="truncate">{text}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
