interface RateLimitData {
  count: number;
  lastReset: number;
}

const LIMIT = 3;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const store = new Map<string, RateLimitData>();

/**
 * Checks if an IP has exceeded the daily roast limit.
 * @param ip The user's IP address
 * @returns { allowed: boolean, remaining: number }
 */
export const checkRateLimit = (ip: string): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  let data = store.get(ip);

  // Reset if window has passed
  if (!data || now - data.lastReset > WINDOW_MS) {
    data = { count: 0, lastReset: now };
    store.set(ip, data);
  }

  if (data.count >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: LIMIT - data.count };
};

/**
 * Increments the request count for a given IP.
 */
export const incrementRateLimit = (ip: string) => {
  const data = store.get(ip);
  if (data) {
    data.count += 1;
    store.set(ip, data);
  }
};
