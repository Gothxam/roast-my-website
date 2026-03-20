import { Metadata } from "next";
import AnalyzeClient from "./AnalyzeClient";

type Props = {
  searchParams: Promise<{ url?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.searchParams;
  const urlParams = params.url ? decodeURIComponent(params.url) : "";

  if (!urlParams) {
    return {
      title: "Analyze | Roast My Website",
      description: "Get a brutal AI roast of your website.",
    };
  }

  // Generate dynamic OG image URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roastmyweb.site"; 
  // Wait, we don't know the exact production domain yet, so let's just use absolute or relative? 
  // In Next.js App Router, OG image needs an absolute URL if deployed, but we can just use a full absolute URL for local/prod.
  // Actually, Next.js handles relative URLs in `images` in `openGraph` correctly if `metadataBase` is set in root layout.
  // We'll just define the metadata endpoint.
  
  const ogImageUrl = `/api/og?url=${encodeURIComponent(urlParams)}`;

  return {
    title: `Roasting ${urlParams} | Roast My Website`,
    description: `See the brutal AI senior dev roast for ${urlParams}. Performance, accessibility, and UX ripped to shreds.`,
    openGraph: {
      title: `Roast My Website: ${urlParams}`,
      description: `See the brutal AI senior dev roast for ${urlParams}.`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Roast of ${urlParams}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Roast My Website: ${urlParams}`,
      description: `See the brutal AI senior dev roast for ${urlParams}.`,
      images: [ogImageUrl],
    },
  };
}

export default async function AnalyzeServerPage(props: Props) {
  // Pass to client component
  return <AnalyzeClient />;
}
