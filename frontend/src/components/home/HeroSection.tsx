import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Sparkles, Lock, CheckCircle2 } from "lucide-react";

interface HeroSectionProps {
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function HeroSection({ formRef }: HeroSectionProps) {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    let finalUrl = url;
    if (!/^https?:\/\//i.test(finalUrl)) finalUrl = `https://${finalUrl}`;
    router.push(`/analyze?url=${encodeURIComponent(finalUrl)}`);
  };

  return (
    <section className="min-h-[92vh] flex flex-col items-center justify-center px-4 pt-20 pb-10">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold uppercase tracking-widest text-orange-400 mb-8 backdrop-blur-md"
      >
        <Flame className="w-3.5 h-3.5" /> AI-Powered Website Auditor
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl md:text-8xl font-bold tracking-tight text-center mb-6 leading-[1.05]"
      >
        The brutal truth about{" "}
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
          YOUR WEBSITE.
        </span>
      </motion.h1>

      {/* Sub */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-lg md:text-xl text-gray-400 max-w-2xl text-center mb-12 leading-relaxed"
      >
        We built an AI that thinks like a senior developer with zero patience for bad UX.
        Paste your link and find out what&apos;s{" "}
        <span className="text-white font-medium">actually holding your site back</span>.
      </motion.p>

      {/* Form */}
      <motion.form
        ref={formRef}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-2xl group"
      >
        <div className="relative p-1.5 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md group-focus-within:border-purple-500/40 transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yoursite.com"
              className="flex-1 bg-transparent px-5 py-4 text-lg outline-none placeholder:text-gray-600 w-full"
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-purple-500 hover:to-orange-400 transition-all shadow-lg active:scale-95 w-full sm:w-auto whitespace-nowrap"
            >
              Get Roasted <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.form>

      {/* Trust pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-4"
      >
        {[
          { icon: <Lock className="w-3 h-3" />, text: "No signup required" },
          { icon: <Sparkles className="w-3 h-3" />, text: "Powered by Gemini AI" },
          { icon: <CheckCircle2 className="w-3 h-3" />, text: "Free forever" },
        ].map(({ icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
            <span className="text-gray-600">{icon}</span> {text}
          </span>
        ))}
      </motion.div>
    </section>
  );
}
