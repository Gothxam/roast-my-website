import { motion } from "framer-motion";
import { Globe, BarChart2, Flame } from "lucide-react";
import Link from "next/link";

export default function ProcessSection() {
  const glassClass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

  return (
    <section className="py-28 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs text-purple-400 font-bold uppercase tracking-widest">The Process</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            How the roast <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">WORKS</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">Three steps from URL to <strong className="text-white font-medium">brutal, honest feedback</strong>.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { num: "01", icon: <Globe className="w-6 h-6 text-cyan-400" />, color: "cyan", title: "Real Browser Visit", desc: "We launch a real headless Chrome browser and scrape your site's structure — headings, images, buttons, meta tags, and visible content." },
            { num: "02", icon: <BarChart2 className="w-6 h-6 text-orange-400" />, color: "orange", title: "Page Signals Extracted", desc: "All structural data is combined into a rich analysis payload — SEO quality, accessibility signals, content clarity, and performance hints." },
            { num: "03", icon: <Flame className="w-6 h-6 text-red-400" />, color: "red", title: "AI Generates the Roast", desc: "Google Gemini reads the data as a senior developer would and writes a personalised, witty, and constructive audit with a Vibe Score." },
          ].map(({ num, icon, color, title, desc }) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Number(num) * 0.05 }}
              className={`${glassClass} p-8 relative overflow-hidden hover:border-white/20 transition-all group`}
            >
              <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-${color}-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              <span className="text-6xl font-black text-white/5 absolute top-4 right-5 group-hover:text-white/8 transition-colors">{num}</span>
              <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-6`}>{icon}</div>
              <h3 className="text-lg font-bold mb-3">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/how-it-works" className="text-sm text-gray-500 hover:text-purple-400 transition-colors">
            See the full technical breakdown →
          </Link>
        </div>
      </div>
    </section>
  );
}
