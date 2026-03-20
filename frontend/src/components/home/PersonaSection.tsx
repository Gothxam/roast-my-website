import { motion } from "framer-motion";

export default function PersonaSection() {
  const glassClass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

  return (
    <section className="py-28 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">The Persona</span>
          <h2 className="text-4xl md:text-6xl font-black mt-3 mb-6 leading-tight">
            Meet your AI{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400">
              senior dev critic.
            </span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-8">
            Our AI has absorbed a decade&apos;s worth of modern web standards, design patterns,
            and accessibility guidelines. It doesn&apos;t sugarcoat. It doesn&apos;t lie. It gives you
            exactly the kind of review your best developer friend would — if they had no filter.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "99%", label: "Brutality Level", color: "text-orange-400" },
              { value: "0ms", label: "Time for Bad UX", color: "text-red-400" },
              { value: "∞", label: "Suggestions per Site", color: "text-purple-400" },
              { value: "Free", label: "Cost to Get Roasted", color: "text-green-400" },
            ].map(({ value, label, color }) => (
              <div key={label} className={`${glassClass} p-5 hover:bg-white/10 transition-all`}>
                <div className={`text-3xl font-black mb-1 ${color}`}>{value}</div>
                <div className="text-xs text-gray-500 font-mono">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fake Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-purple-500/10 rounded-[40px] blur-3xl -z-10" />
          <div className="bg-black/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-[11px] font-mono text-gray-600 ml-2">roast-my-website — audit</span>
            </div>
            <div className="p-8 font-mono text-sm leading-relaxed space-y-1">
              <p className="text-gray-600"># Connecting to Browserless...</p>
              <p className="text-cyan-400">→ Browser session started</p>
              <p className="text-gray-600 mt-2"># Visiting your-site.com</p>
              <p className="text-white">Extracting headings... <span className="text-green-400">20 found</span></p>
              <p className="text-white">Scanning images... <span className="text-red-400">3 missing alt text ⚠</span></p>
              <p className="text-white">Checking meta description... <span className="text-red-400">MISSING ⚠</span></p>
              <p className="text-white">Analysing CTAs... <span className="text-yellow-400">2 say "Click Here"</span></p>
              <p className="text-gray-600 mt-2"># Sending to Gemini for roast generation</p>
              <p className="text-purple-400">→ Gemini: "Oh this is going to be fun..."</p>
              <p className="text-green-400 animate-pulse mt-2">▸ Roast ready. Brace yourself.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
