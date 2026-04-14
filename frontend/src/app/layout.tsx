import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ThreeBackground from "@/components/ThreeBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import StructuredData from "@/components/StructuredData";
import PageLoader from "@/components/PageLoader";
import UserTracker from "@/components/UserTracker";
import { Analytics } from "@vercel/analytics/next";

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
  title: {
    default: "Roast My Website | Brutal AI Website Audits",
    template: "%s | Roast My Website"
  },
  description: "Get a brutal, honest, and actionable AI review of your website's design, performance, and SEO. Prepare to be roasted by a senior frontend dev powered by Gemini AI.",
  keywords: [
    "website roast", "AI website auditor", "lighthouse score", "frontend developer roast", 
    "website feedback", "UX review", "AI SEO audit", "website design feedback", 
    "performance checker", "web development audit", "Gemini AI", "brutal audit"
  ],
  alternates: {
    canonical: "./"
  },
  openGraph: {
    title: "Roast My Website | Brutal AI Website Audits",
    description: "The brutal truth about your website. AI-powered audits for design, performance, and SEO.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/roast-preview.png",
        width: 1200,
        height: 630,
        alt: "Roast My Website Preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My Website | Brutal AI Website Audits",
    description: "Prepare to be roasted by a senior frontend dev AI. Free Lighthouse and UX audits.",
    images: ["/roast-preview.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-purple-500/30`}>
        {/* Analytics & Tracking */}
        <StructuredData />
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
        <Analytics />

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
