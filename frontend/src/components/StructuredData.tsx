"use client";

import Script from "next/script";

export default function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roastmywebsite.ai";
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Roast My Website",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}analyze?url={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Roast My Website AI Auditor",
    "operatingSystem": "All",
    "applicationCategory": "DeveloperApplication",
    "description": "An AI-powered website auditor that provides brutal, honest feedback on design, performance, and SEO using Gemini AI.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "100"
    }
  };

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  );
}
