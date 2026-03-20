import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

interface LoadingScreenProps {
  url: string;
  jokeIndex: number;
  loadingJokes: string[];
}

export default function LoadingScreen({ url, jokeIndex, loadingJokes }: LoadingScreenProps) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-600/10 rounded-full blur-[120px] -z-10" />
      <div className="mb-8 relative">
        <Flame className="w-16 h-16 text-orange-500 animate-pulse" />
        <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={jokeIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="text-xl md:text-2xl text-white font-semibold tracking-wide text-center px-8 mb-4"
        >
          {loadingJokes[jokeIndex]}
        </motion.p>
      </AnimatePresence>
      <p className="text-gray-500 text-sm max-w-sm text-center">
        Analyzing <span className="text-purple-400">{url}</span> — usually takes 10–25 seconds.
      </p>
      <div className="mt-8 flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-500"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
          />
        ))}
      </div>
    </main>
  );
}
