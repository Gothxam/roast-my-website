import { Flame } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 font-bold text-white">
          <Flame className="w-5 h-5 text-orange-500" /> Roast My Website
        </div>
        <div className="flex flex-wrap gap-6 justify-center">
          {[
            { href: "/how-it-works", label: "How It Works" },
            { href: "/glossary", label: "Glossary" },
            { href: "/about", label: "About" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-sm text-gray-500 hover:text-white transition-colors">
              {label}
            </Link>
          ))}
        </div>
        <p className="text-gray-600 text-xs font-mono">Built with 🔥 by devs who&apos;ve seen too much. © 2026</p>
      </div>
    </footer>
  );
}
