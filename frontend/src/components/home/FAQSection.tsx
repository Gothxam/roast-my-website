import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function FAQSection() {
  const glassClass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

  return (
    <section className="py-28 px-4 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">FAQ</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">QUESTIONS</span>
          </h2>
        </div>
        <div className="space-y-4">
          {[
            { q: "Is it actually free?", a: "Yes. No email, no credit card, no account. Paste a link and walk away with feedback." },
            { q: "How does the AI know what's good?", a: "It's grounded in real scraped data — heading structure, image accessibility, meta tags, and button copy — and evaluated against modern web standards and UX best practices." },
            { q: "Will it fix my site automatically?", a: "No. We give you the diagnosis. You write the prescription. Every suggestion is specific and actionable — but the implementation is on you." },
            { q: "Can I roast my competitor's site?", a: "Absolutely. We only visit publicly accessible pages. See exactly where they're slipping and where you can beat them." },
            { q: "How accurate are the scores?", a: "The Vibe Score is an AI-formed opinion based on real evidence, not a fixed formula. Think of it as a senior developer's gut feeling — informed, calibrated, but still a judgment call." },
          ].map(({ q, a }) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${glassClass} p-6 hover:bg-white/8 transition-all`}
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-2">{q}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
