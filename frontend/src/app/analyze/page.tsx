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

  // Fetch existing roast result from cache if it exists
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  let score = "0";
  let punchline = "The roast you didn't ask for.";

  try {
    const res = await fetch(`${apiBase}/api/results?url=${encodeURIComponent(urlParams)}`, {
      next: { revalidate: 3600 }
    });
    if (res.ok) {
      const data = await res.json();
      // Corrected score path: data.roast.score
      score = data.roast?.score?.toString() || score;
      if (data.roast?.punchline) punchline = data.roast.punchline;
    }
  } catch (err) {
    console.warn("Metadata fetch failed, using defaults.");
  }

  const ogImageUrl = `/api/og?score=${score}&url=${encodeURIComponent(urlParams)}&punchline=${encodeURIComponent(punchline)}`;

  return {
    title: `Roast of ${urlParams} | Roast My Website`,
    description: `"${punchline}" - See the full brutal roast.`,
    openGraph: {
      title: `Roast My Website: ${urlParams}`,
      description: punchline,
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
      description: punchline,
      images: [ogImageUrl],
    },
  };
}

export default async function AnalyzeServerPage(props: Props) {
  // Pass to client component
  return <AnalyzeClient />;
}
