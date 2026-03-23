"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame, Github, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/glossary", label: "Glossary" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-b border-white/5 -z-10" />
      
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-white text-lg hover:text-orange-400 transition-colors">
          <Flame className="w-5 h-5 text-orange-500" />
          Roast My Website
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/Gothxam/roast-my-website"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-white hover:bg-white/5 rounded-xl transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 py-6 px-6 flex flex-col gap-4 md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-lg font-medium text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/Gothxam/roast-my-website"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-lg font-medium text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Github className="w-5 h-5" /> Source Code
          </a>
        </div>
      )}
    </nav>
  );
}
