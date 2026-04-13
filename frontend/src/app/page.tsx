"use client";

import { useRef } from "react";
import HeroSection from "@/components/home/HeroSection";
import RoastTicker from "@/components/home/RoastTicker";
import ProcessSection from "@/components/home/ProcessSection";
import PersonaSection from "@/components/home/PersonaSection";
import AudienceSection from "@/components/home/AudienceSection";
import StakesSection from "@/components/home/StakesSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";
import FeedbackCard from "@/app/analyze/components/FeedbackCard";
import Footer from "@/components/Footer";

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    formRef.current?.querySelector("input")?.focus();
  };

  return (
    <main className="relative min-h-screen text-white overflow-x-hidden">
      <div className="relative z-10">
        <HeroSection formRef={formRef} />
        <RoastTicker />
        <ProcessSection />
        <PersonaSection />
        <AudienceSection />
        <StakesSection />
        <FAQSection />
        <CTASection onScrollToForm={scrollToForm} />
        
        <div className="max-w-4xl mx-auto px-4 py-20">
          <FeedbackCard url="Homepage Feedback" />
        </div>

        <Footer />
      </div>
    </main>
  );
}

