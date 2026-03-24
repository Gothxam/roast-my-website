export interface AnalysisResult {
  url: string;
  metadata: {
    title: string;
    description: string;
    headings: string[];
    images?: { src: string; alt: string }[];
    buttons?: string[];
    textContent?: string;
    loadError?: string;
  };
  scores?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  } | null;
  roast: {
    score: number;
    roast: string;
    punchline: string;
    suggestions: string[];
  };
}
