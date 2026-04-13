import { AlertTriangle, ArrowLeft, Flame, ShieldAlert, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface ErrorScreenProps {
  error: string | null;
}

export default function ErrorScreen({ error }: ErrorScreenProps) {
  const router = useRouter();
  const isRateLimit = error?.toLowerCase().includes("too many roasts") || error?.includes("limit reached");

  if (isRateLimit) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" 
              />
              <div className="relative bg-orange-500/20 p-5 rounded-full border border-orange-500/30">
                <Flame className="w-12 h-12 text-orange-500" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">Roast Overload! 🔥</h1>
          <div className="flex items-center justify-center gap-2 text-orange-400/80 text-sm font-medium mb-6">
            <Timer className="w-4 h-4" />
            <span>Daily Limit Reached</span>
          </div>

          <p className="text-gray-400 leading-relaxed mb-8">
            Whoa there, champion. You've hit your daily limit of roasts. Even our AI senior dev needs a coffee break.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-orange-500/20"
            >
              <ArrowLeft className="w-5 h-5" /> Come back tomorrow
            </button>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-4">Resetting in 24 hours</p>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-red-500/10 p-5 rounded-full border border-red-500/20 mb-6 inline-block">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Well, this is embarrassing.</h1>
        <p className="text-gray-400 max-w-md mb-8">{error || "Something went wrong while roasting your site."}</p>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all hover:scale-105 active:scale-95 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Try another URL
        </button>
      </motion.div>
    </main>
  );
}
