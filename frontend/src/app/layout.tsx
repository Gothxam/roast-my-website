import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ThreeBackground from "@/components/ThreeBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://roastmyweb.site"),
  title: "Roast My Website | Brutal AI Website Audits",
  description: "Get a brutal, honest, and actionable AI review of your website's design, performance, and SEO. Prepare to be roasted by a senior frontend dev.",
  keywords: ["website roast", "AI website auditor", "lighthouse score", "frontend developer roast", "website feedback", "UX review"],
  openGraph: {
    title: "Roast My Website",
    description: "The brutal truth about your website. AI-powered audits for design, performance, and SEO.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My Website",
    description: "Prepare to be roasted by a senior frontend dev AI. Free Lighthouse and UX audits.",
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-purple-500/30`}>
        <PageLoader />
        <ThreeBackground />
        <Navbar />
        <SmoothScroll>
          <div className="pt-16 min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
