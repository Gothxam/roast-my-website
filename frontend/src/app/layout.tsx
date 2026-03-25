import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ThreeBackground from "@/components/ThreeBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import PageLoader from "@/components/PageLoader";
import UserTracker from "@/components/UserTracker";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL 
  ? process.env.NEXT_PUBLIC_SITE_URL 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
        {/* Analytics & Tracking */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <UserTracker />

        <PageLoader />
        <ThreeBackground />
        <Navbar />
        <SmoothScroll>
          <div className="pt-16 min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
