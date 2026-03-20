import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const roastSamples = [
  { url: "portfolio-v1.dev", score: 34, category: "Portfolio", roast: "Padding is not a suggestion, it's a human right. Stop the chaos." },
  { url: "crypto-tuna.io", score: 41, category: "Crypto", roast: "Your hero section is so heavy it has its own gravitational pull." },
  { url: "bakery-site.com", score: 57, category: "Local Business", roast: "The font choice suggests you're still living in 2004. Delicious cookies though." },
  { url: "saas-starter.ly", score: 62, category: "SaaS", roast: "Clean code? Maybe. Clean UI? Not in this lifetime." },
  { url: "blog-v2.me", score: 28, category: "Blog", roast: "I've seen faster load times on a dial-up modem — in a storm." },
  { url: "agency-wow.co", score: 45, category: "Agency", roast: "Six hero sections and zero clarity. Impressive achievement." },
];

export default function RoastTicker() {
  return (
    <div className="w-full overflow-hidden relative mt-0 mb-0">
      <div className="absolute inset-y-0 left-0 w-32 md:w-56 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 md:w-56 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      <div className="flex gap-6 overflow-hidden py-6 opacity-25">
        <motion.div
          animate={{ x: [0, -1800] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 whitespace-nowrap"
        >
          {[...roastSamples, ...roastSamples, ...roastSamples].map((sample, i) => {
            const scoreColor = sample.score >= 60 ? "#f59e0b" : sample.score >= 40 ? "#f97316" : "#ef4444";
            return (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 min-w-[300px] backdrop-blur-md flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Flame className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span className="text-xs text-gray-400 font-mono truncate">{sample.url}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-gray-600 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{sample.category}</span>
                    <span className="text-sm font-black tabular-nums" style={{ color: scoreColor }}>{sample.score}</span>
                  </div>
                </div>
                <div className="border-l-2 border-orange-500/30 pl-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{sample.roast}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
