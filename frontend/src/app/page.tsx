"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Flame, ShieldAlert, Zap, Coffee, Code, Terminal, Search, Cpu, CheckCircle2 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const router = useRouter();
  const containerRef = useRef(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    let finalUrl = url;
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }
    router.push(`/analyze?url=${encodeURIComponent(finalUrl)}`);
  };

  const roastSamples = [
    { url: "portfolio-v1.dev", roast: "Padding is not a suggestion, it's a human right. Stop the chaos." },
    { url: "crypto-tuna.io", roast: "Your hero section is so heavy it has its own gravitational pull." },
    { url: "bakery-site.com", roast: "The font choice suggests you're still living in 2004." },
    { url: "saas-starter.ly", roast: "Clean code? Maybe. Clean UI? Not in this lifetime." },
    { url: "blog-v2.me", roast: "I've seen faster load times on a dial-up modem in a storm." },
  ];

  return (
    <main ref={containerRef} className="relative min-h-screen text-white selection:bg-purple-500/30 overflow-x-hidden pt-10">
      <div className="relative z-10">
        {/* --- 1. WHAT IS THIS? (HERO) --- */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 pt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-purple-400 mb-8 backdrop-blur-md"
          >
            <Flame className="w-4 h-4 text-orange-500" /> AI-Powered Website Auditor
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-8xl font-bold tracking-tight text-center mb-8 leading-[1.1]"
          >
            The brutal truth about <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 uppercase">
               Your Website.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-2xl text-gray-400 max-w-3xl text-center mb-12 font-light leading-relaxed"
          >
            We've built an AI that thinks like a senior dev with a bad attitude. 
            Paste your link and find out what's <span className="text-white font-medium">actually killing your conversion rate</span>.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-2xl group"
          >
            <div className="relative p-1 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-2xl group-focus-within:border-purple-500/50 transition-all duration-300">
              <div className="flex bg-black/40 rounded-xl overflow-hidden p-1">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your URL (e.g. yoursite.com)"
                  className="flex-1 bg-transparent px-6 py-4 text-lg outline-none placeholder:text-gray-600"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-black px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all shadow-lg active:scale-95"
                >
                  GET ROASTED <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.form>
          
          <div className="mt-16 text-gray-600 text-xs font-mono flex items-center gap-4">
             <span>NO SIGNUP</span>
             <span className="w-1 h-1 bg-gray-800 rounded-full" />
             <span>POWERED BY GEMINI 1.5</span>
             <span className="w-1 h-1 bg-gray-800 rounded-full" />
             <span>FREE FOREVER</span>
          </div>

          <div className="w-full mt-32 relative">
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent z-10" />
            <div className="flex gap-8 overflow-hidden py-10 opacity-30">
              <motion.div 
                animate={{ x: [0, -1000] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="flex gap-8 whitespace-nowrap"
              >
                {[...roastSamples, ...roastSamples].map((sample, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 min-w-[300px] backdrop-blur-md">
                    <span className="text-xs text-purple-400 block mb-2">{sample.url}</span>
                    <p className="text-sm italic text-gray-300">"{sample.roast}"</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- 2. HOW IT WORKS (THE PROCESS) --- */}
        <section className="py-32 px-4 border-y border-white/5 bg-white/[0.01]">
          <div className="container max-w-5xl mx-auto">
             <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter uppercase italic">The Roast Process</h2>
                <p className="text-gray-500">How we turn your URL into a laundry list of failures.</p>
             </div>
             <div className="grid md:grid-cols-3 gap-12">
                <ProcessStep 
                  number="01" 
                  icon={<Search className="w-6 h-6 text-purple-400" />}
                  title="Deep Crawl"
                  description="We launch a headless browser to scrape your metadata, headings, and structure just like a real user."
                />
                <ProcessStep 
                  number="02" 
                  icon={<Cpu className="w-6 h-6 text-orange-400" />}
                  title="Audit Blast"
                  description="We run a full Google Lighthouse audit to get objective scores on performance, SEO, and accessibility."
                />
                <ProcessStep 
                  number="03" 
                  icon={<Flame className="w-6 h-6 text-red-500" />}
                  title="AI Judgment"
                  description="Our senior dev AI analyzes the raw data and provides brutal, constructive, and witty feedback."
                />
             </div>
          </div>
        </section>

        {/* --- 3. THE PERSONA (SENIOR DEV) --- */}
        <section className="py-32 px-4">
          <div className="container max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 items-center">
               <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
               >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
                    <Terminal className="w-4 h-4" /> The Persona
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black mb-8 leading-none">
                    Meet your <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-orange-400 uppercase">Worst Nightmare.</span>
                  </h2>
                  <p className="text-xl text-gray-400 font-light leading-relaxed mb-10">
                    We trained our AI on millions of lines of spaghetti code, redundant div tags, and poor accessibility choices. 
                    It doesn't care about your feelings; it cares about your conversion rate.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:border-orange-500/50 transition-colors">
                      <div className="text-4xl font-black text-orange-500 mb-1">99%</div>
                      <div className="text-xs text-gray-500 uppercase font-mono">Brutality Level</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 group hover:border-blue-500/50 transition-colors">
                      <div className="text-4xl font-black text-blue-500 mb-1">0%</div>
                      <div className="text-xs text-gray-500 uppercase font-mono">Patience for JS Bloat</div>
                    </div>
                  </div>
               </motion.div>

               <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
               >
                  <div className="absolute -inset-4 bg-purple-500/20 rounded-[40px] blur-2xl -z-10 animate-pulse" />
                  <div className="bg-black/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                     <div className="p-4 border-b border-white/10 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-[10px] font-mono text-gray-500 ml-2">senior-dev-critic.sh — 120x40</span>
                     </div>
                     <div className="p-8 font-mono text-sm leading-relaxed">
                        <div className="text-purple-400 mb-2"># Initializing ego... done.</div>
                        <div className="text-purple-400 mb-2"># Loading 10 years of stackoverflow hate... done.</div>
                        <div className="text-blue-400 mb-4">$ roaster --target "your-site.com"</div>
                        <div className="text-white">Analyzing DOM structure...</div>
                        <div className="text-red-400">WARNING: Too many nested divs detected.</div>
                        <div className="text-yellow-400">WARNING: H1 tag is missing. Are you even trying?</div>
                        <div className="text-green-500 mt-4 animate-pulse">Scanning complete. Prepare for the roast...</div>
                        <div className="text-white mt-2">_</div>
                     </div>
                  </div>
               </motion.div>
            </div>
          </div>
        </section>

        {/* --- 4. WHO IS IT FOR? --- */}
        <section className="py-32 px-4 border-t border-white/5">
          <div className="container max-w-6xl mx-auto">
             <div className="text-center mb-16 underline decoration-purple-500 decoration-4 underline-offset-8">
                <h2 className="text-3xl md:text-5xl font-bold italic uppercase tracking-tighter">Who is this for?</h2>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
                <AudienceCard 
                  title="Founders" 
                  desc="Stop wondering why your landing page doesn't convert. Get objective feedback before you burn your ad budget."
                  color="purple"
                />
                <AudienceCard 
                  title="Freelancers" 
                  desc="Roast your own work before the client sees it. Fix the obvious mistakes that lower your professional value."
                  color="orange"
                />
                <AudienceCard 
                  title="Students" 
                  desc="Learn what makes a website high-quality in the real world. Our AI explains exactly what needs to change and why."
                  color="blue"
                />
             </div>
          </div>
        </section>

        {/* --- 5. THE STAKES (WHY CARE?) --- */}
        <section className="py-32 px-4 bg-white/[0.02] border-t border-white/5">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black mb-6 italic uppercase tracking-tighter">Why should you care?</h2>
               <p className="text-gray-500 max-w-2xl mx-auto text-lg">Because in the world of web, clean code doesn't pay the bills. Performance and UX do.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
                <StakesCard 
                  icon={<Zap className="text-red-500" />}
                  title="3 Seconds"
                  desc="That's all you have before a user bounces. If your performance audit is red, you're literally throwing money away."
                />
                <StakesCard 
                  icon={<ShieldAlert className="text-blue-500" />}
                  title="Trust Debt"
                  desc="Poor spacing and inconsistent design create 'Trust Debt'. Once a user stops trusting your UI, they stop buying your product."
                />
            </div>
          </div>
        </section>

        {/* --- 6. FAQ (COMMON QUESTIONS) --- */}
        <section className="py-32 px-4 border-t border-white/5">
           <div className="container max-w-4xl mx-auto">
              <div className="text-center mb-20">
                 <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tighter uppercase italic">Common Questions</h2>
                 <p className="text-gray-500">Everything you need to know before getting roasted.</p>
              </div>
              <div className="space-y-6">
                 <FAQItem q="Is it actually free?" a="Yes. We don't even ask for your email. Just paste a link and get out." />
                 <FAQItem q="How does the AI know what's 'good'?" a="It's trained on modern web standards (Core Web Vitals) and high-converting landing page layouts." />
                 <FAQItem q="Will it fix my site automatically?" a="No. We give you the medicine; you have to take it. We provide actionable steps, but you write the code." />
                 <FAQItem q="Can I roast my competitor's site?" a="Absolutely. We encourage it. See exactly where they are failing." />
              </div>
           </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-32 px-4 text-center border-t border-white/5 bg-gradient-to-b from-transparent to-purple-900/10">
           <div className="container max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-8xl font-black mb-10 leading-none">STOP GUESSING. <br /> <span className="text-orange-500">START SHIPPING.</span></h2>
                <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">Join the hundreds of developers who survived the roast this week.</p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-12 py-6 bg-white text-black text-xl font-black rounded-2xl hover:bg-orange-500 hover:text-white transition-all transform hover:scale-110 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                >
                   BURN MY WEBSITE →
                </button>
              </motion.div>
           </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-20 border-t border-white/5 text-center">
            <div className="flex items-center justify-center gap-2 text-xl font-black mb-4 uppercase tracking-tighter">
                <Flame className="w-6 h-6 text-orange-500" /> Roast My Website
            </div>
            <p className="text-gray-600 text-xs font-mono uppercase tracking-[0.2em]">Built by senior devs who have seen too much. © 2026</p>
        </footer>
      </div>
    </main>
  );
}

function ProcessStep({ number, icon, title, description }: { number: string; icon: React.ReactNode; title: string; description: string }) {
   return (
      <div className="relative p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
         <div className="text-6xl font-black text-white/5 absolute top-4 right-6 group-hover:text-white/10 transition-colors uppercase italic">{number}</div>
         <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">{icon}</div>
         <h3 className="text-xl font-bold mb-4">{title}</h3>
         <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
   );
}

function AudienceCard({ title, desc, color }: { title: string; desc: string; color: "purple" | "orange" | "blue" }) {
   const colors = {
      purple: "text-purple-400 border-purple-500/20",
      orange: "text-orange-400 border-orange-500/20",
      blue: "text-blue-400 border-blue-500/20"
   };
   return (
      <div className={`p-10 rounded-3xl bg-white/5 border ${colors[color]} hover:bg-white/10 transition-all`}>
         <h3 className={`text-2xl font-black mb-4 uppercase italic ${colors[color]}`}>{title}</h3>
         <p className="text-gray-400 leading-relaxed">{desc}</p>
      </div>
   );
}

function StakesCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
   return (
      <div className="p-10 rounded-3xl bg-white/5 border border-white/10 flex gap-6 items-start group hover:border-white/20 transition-all">
         <div className="w-14 h-14 rounded-2xl bg-white/5 shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
         <div>
            <h4 className="text-xl font-bold mb-2 underline decoration-white/20 underline-offset-4">{title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
         </div>
      </div>
   );
}

function FAQItem({ q, a }: { q: string; a: string }) {
   return (
      <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all group">
         <div className="flex items-center gap-4 mb-3">
             <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
             <h4 className="text-lg font-bold">{q}</h4>
         </div>
         <p className="text-gray-400 text-sm leading-relaxed ml-9">{a}</p>
      </div>
   );
}
