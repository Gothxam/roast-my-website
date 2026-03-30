import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, MessageSquare, Flame } from "lucide-react";

interface FeedbackCardProps {
  url: string;
}

const ratings = [
  { value: 1, emoji: "😡", label: "Trash" },
  { value: 2, emoji: "😢", label: "Ouch" },
  { value: 3, emoji: "😐", label: "Meh" },
  { value: 4, emoji: "😊", label: "Not Bad" },
  { value: 5, emoji: "😍", label: "Loved it!" },
];

const glass = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px]";

export default function FeedbackCard({ url }: FeedbackCardProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);

    try {
      const userId = localStorage.getItem("roast_user_id") || "anonymous";
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      
      await fetch(`${apiBase}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, url, rating, comment }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={`${glass} p-8 relative overflow-hidden group`}
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <MessageSquare className="w-24 h-24 rotate-12" />
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white">How was the roast?</h3>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Was the roast accurate or did we miss the mark? We&apos;re constantly tuning the AI to be more savage yet helpful. Let us know if you encountered any <b>technical issues</b>, have <b>UI/UX improvement</b> ideas, or just want to share your <b>overall experience</b>. Your suggestions help us build the ultimate website auditor.
            </p>

            {/* Rating Selector */}
            <div className="flex justify-between gap-2 mb-8">
              {ratings.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRating(r.value)}
                  className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${
                    rating === r.value
                      ? "bg-orange-500/20 border-orange-500 text-white scale-105 shadow-lg shadow-orange-500/10"
                      : "bg-white/5 border-white/5 hover:bg-white/10 text-gray-400"
                  }`}
                >
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-[10px] font-medium uppercase tracking-tighter">{r.label}</span>
                </button>
              ))}
            </div>

            {/* Comment Area */}
            <div className="space-y-4 mb-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ex: 'The lighthouse score was wrong', 'Add a dark mode toggle', 'The AI is too polite', etc. Any technical bugs or feature requests are welcome!"
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!rating || loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black font-bold rounded-2xl hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Submit Feedback
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Feedback Received!</h3>
            <p className="text-gray-400 text-sm">Thanks for the input. We've logged it for the AI to learn.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
