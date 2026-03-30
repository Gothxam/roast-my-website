import { getRedis } from "./analytics";

export interface FeedbackData {
  userId: string;
  url: string;
  rating: number;
  comment: string;
  timestamp: number;
}

/**
 * Logs feedback to Redis and sends a notification to Discord.
 */
export const submitFeedback = async (data: FeedbackData) => {
  const redis = getRedis();
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  // 1. Log to Redis (Permanent storage)
  if (redis) {
    try {
      await redis.lpush("all_feedback", JSON.stringify(data));
      // Keep only most recent 1000 feedbacks to avoid bloat
      await redis.ltrim("all_feedback", 0, 999);
    } catch (err) {
      console.error("[Feedback] Redis log failed:", err);
    }
  }

  // 2. Send to Discord (Real-time alert)
  if (webhookUrl && webhookUrl !== "YOUR_DISCORD_WEBHOOK_URL") {
    try {
      const embed = {
        title: "🔥 New Roast Feedback!",
        color: data.rating >= 4 ? 0x2ecc71 : data.rating >= 3 ? 0xf1c40f : 0xe74c3c,
        fields: [
          { name: "Website", value: data.url, inline: true },
          { name: "Rating", value: "⭐".repeat(data.rating), inline: true },
          { name: "Comment", value: data.comment || "_No comment provided_" },
          { name: "User ID", value: `\`${data.userId}\``, inline: false },
        ],
        timestamp: new Date(data.timestamp).toISOString(),
      };

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] }),
      });
    } catch (err) {
      console.error("[Feedback] Discord notification failed:", err);
    }
  } else {
    console.warn("[Feedback] Discord webhook not configured, skipping alert.");
  }
};
