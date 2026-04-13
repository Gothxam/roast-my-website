interface CacheEntry {
  data: any;
  timestamp: number;
}

const DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
const cacheStore = new Map<string, CacheEntry>();

/**
 * Normalizes a URL to ensure consistent cache keys.
 * Removes www, handles trailing slashes, and lowercases.
 */
export const normalizeUrl = (url: string): string => {
  try {
    const u = new URL(url.trim());
    let host = u.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.substring(4);
    
    let path = u.pathname;
    // Remove trailing slash if present (except for root /)
    if (path.length > 1 && path.endsWith("/")) {
      path = path.slice(0, -1);
    }
    
    // Construct normalized string (ignoring fragment, including search)
    return `${u.protocol}//${host}${path}${u.search}`;
  } catch {
    // Fallback for invalid URLs or partial strings
    return url.toLowerCase().trim().replace(/\/$/, "");
  }
};

/**
 * Retrieves a cached result if it hasn't expired.
 */
export const getCachedResult = (url: string) => {
  const normalized = normalizeUrl(url);
  const entry = cacheStore.get(normalized);

  if (entry) {
    const isExpired = Date.now() - entry.timestamp > DEFAULT_TTL;
    if (!isExpired) {
      console.log(`[Cache] Hit for: ${normalized}`);
      return entry.data;
    }
    console.log(`[Cache] Expired for: ${normalized}`);
    cacheStore.delete(normalized);
  }
  
  return null;
};

/**
 * Stores a result in the cache.
 */
export const setCachedResult = (url: string, data: any) => {
  const normalized = normalizeUrl(url);
  console.log(`[Cache] Storing result for: ${normalized}`);
  cacheStore.set(normalized, {
    data,
    timestamp: Date.now(),
  });
};
