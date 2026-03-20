import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorScreenProps {
  error: string | null;
}

export default function ErrorScreen({ error }: ErrorScreenProps) {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="w-20 h-20 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Well, this is embarrassing.</h1>
      <p className="text-gray-400 max-w-md mb-8">{error || "Something went wrong while roasting your site."}</p>
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Try another URL
      </button>
    </main>
  );
}
