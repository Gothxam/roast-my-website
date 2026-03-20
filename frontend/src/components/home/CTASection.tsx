import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface CTASectionProps {
  onScrollToForm: () => void;
}

export default function CTASection({ onScrollToForm }: CTASectionProps) {
  return (
    <section className="py-28 px-4 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-purple-900/10">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-6xl mb-6">🔥</div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Stop guessing.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">START SHIPPING.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of developers who survived the roast and shipped better websites because of it.
          </p>
          <button
            onClick={onScrollToForm}
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-orange-500 text-white text-lg font-bold rounded-2xl hover:from-purple-500 hover:to-orange-400 transition-all shadow-[0_0_60px_rgba(168,85,247,0.3)] hover:shadow-[0_0_80px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95"
          >
            <Flame className="w-5 h-5" /> Roast My Website
          </button>
        </motion.div>
      </div>
    </section>
  );
}
