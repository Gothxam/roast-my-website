import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export interface UserStats {
  roasts: number;
  shares: number;
  firstSeen: number;
  lastSeen: number;
}

export const trackEvent = async (userId: string, event: "roast" | "share") => {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.warn("[Analytics] Redis not configured, skipping tracking.");
    return;
  }

  const key = `user:${userId}`;
  const now = Date.now();

  try {
    const existing = await redis.get<UserStats>(key);

    if (!existing) {
      const newStats: UserStats = {
        roasts: event === "roast" ? 1 : 0,
        shares: event === "share" ? 1 : 0,
        firstSeen: now,
        lastSeen: now,
      };
      await redis.set(key, newStats);
    } else {
      const updated: UserStats = {
        ...existing,
        roasts: event === "roast" ? existing.roasts + 1 : existing.roasts,
        shares: event === "share" ? existing.shares + 1 : existing.shares,
        lastSeen: now,
      };
      await redis.set(key, updated);
    }
  } catch (err) {
    console.error("[Analytics] Redis error:", err);
  }
};

export const getMetrics = async () => {
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    return { error: "Redis not configured" };
  }

  try {
    const keys = await redis.keys("user:*");
    const totalUsers = keys.length;

    let totalRoasts = 0;
    let totalShares = 0;
    let usersWhoShared = 0;

    // Fetch all user stats (batching if needed, but keeping it simple for now)
    const pipeline = redis.pipeline();
    keys.forEach(k => pipeline.get(k));
    const allStats = await pipeline.exec() as UserStats[];

    allStats.forEach(stats => {
      if (stats) {
        totalRoasts += stats.roasts || 0;
        totalShares += stats.shares || 0;
        if ((stats.shares || 0) > 0) usersWhoShared++;
      }
    });

    return {
      totalUsers,
      totalRoasts,
      totalShares,
      shareRate: totalUsers > 0 ? (usersWhoShared / totalUsers).toFixed(2) : 0,
    };
  } catch (err) {
    console.error("[Analytics] Metrics error:", err);
    return { error: "Failed to fetch metrics" };
  }
};
