import { motion } from "framer-motion";

export default function AudienceSection() {
  const glassClass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

  return (
    <section className="py-28 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs text-green-400 font-bold uppercase tracking-widest">For Everyone</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            Built for people who <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">SHIP</span>
          </h2>
          <p className="text-gray-400">Whether you built the site last week or last year.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { emoji: "🚀", title: "Founders & Makers", color: "purple", desc: "Stop wondering why your landing page doesn't convert. Get objective, data-backed feedback before you burn your ad budget on a broken funnel." },
            { emoji: "🎨", title: "Freelancers & Designers", color: "orange", desc: "Roast your own work before the client does. Catch the obvious mistakes early and deliver work that showcases your actual skill level." },
            { emoji: "📚", title: "Students & Learners", color: "cyan", desc: "Learn what actually separates a good website from a great one. Our AI explains exactly what's wrong and how to fix it in plain English." },
          ].map(({ emoji, title, color, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${glassClass} p-8 hover:bg-white/8 transition-all group`}
            >
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className={`text-lg font-bold mb-3 text-${color}-400`}>{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
