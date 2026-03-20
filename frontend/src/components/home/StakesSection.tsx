import { motion } from "framer-motion";
import { Zap, ShieldAlert, Search, Cpu } from "lucide-react";

export default function StakesSection() {
  const glassClass = "bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl";

  return (
    <section className="py-28 px-4 border-t border-white/5 bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs text-red-400 font-bold uppercase tracking-widest">The Stakes</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
            Why your website score <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">MATTERS</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Because in the world of web, perception is <strong className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">REVENUE</strong>.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: <Zap className="w-6 h-6 text-yellow-400" />, color: "yellow", title: "3 Seconds to Lose a User", desc: "Studies show that 53% of mobile users abandon a site that takes more than 3 seconds to load. If your performance score is red, you're actively losing customers every hour." },
            { icon: <ShieldAlert className="w-6 h-6 text-blue-400" />, color: "blue", title: "Trust is Visual", desc: "Poor spacing, inconsistent fonts, and broken layouts create subconscious distrust. Users make up their mind about your site's credibility in 50 milliseconds." },
            { icon: <Search className="w-6 h-6 text-green-400" />, color: "green", title: "SEO is Not Optional", desc: "A missing meta description or broken heading structure can bury your site on page 3 of Google — where nobody goes. Good SEO is the difference between being found and being invisible." },
            { icon: <Cpu className="w-6 h-6 text-purple-400" />, color: "purple", title: "Accessibility Expands Your Reach", desc: "Over 1 billion people have a disability. Missing alt text and poor contrast don't just fail those users — they also hurt your Lighthouse score and Google ranking." },
          ].map(({ icon, color, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${glassClass} p-8 flex gap-5 items-start hover:border-${color}-500/20 transition-all group`}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">{title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
