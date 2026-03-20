import Link from "next/link";
import { Flame, Github } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-b border-white/5 -z-10" />
      <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg hover:text-orange-400 transition-colors">
        <Flame className="w-5 h-5 text-orange-500" />
        Roast My Website
      </Link>
      <div className="flex items-center gap-1">
        <Link href="/how-it-works" className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all">
          How It Works
        </Link>
        <Link href="/glossary" className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all">
          Glossary
        </Link>
        <Link href="/about" className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all">
          About
        </Link>
        <a
          href="https://github.com/Gothxam/roast-my-website"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </nav>
  );
}
