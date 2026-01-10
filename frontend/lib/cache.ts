/**
 * Caching utilities for API responses
 */

export const CACHE_DURATIONS = {
  // Static content that rarely changes
  STATIC: 60 * 60 * 24, // 24 hours

  // Computed data that changes occasionally
  COMPUTED: 60 * 60, // 1 hour

  // Dynamic data that may change frequently
  DYNAMIC: 60 * 5, // 5 minutes

  // User-specific or real-time data
  NONE: 0,
} as const;

/**
 * Create cache-control header value
 */
export function cacheControl(
  maxAge: number,
  options: {
    staleWhileRevalidate?: number;
    public?: boolean;
  } = {}
): string {
  const parts: string[] = [];

  if (options.public !== false) {
    parts.push('public');
  }

  parts.push(`max-age=${maxAge}`);

  if (options.staleWhileRevalidate) {
    parts.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
  }

  return parts.join(', ');
}

/**
 * Common cache headers for different response types
 */
export const CACHE_HEADERS = {
  // For morphology, evidence, and other computed data
  computed: {
    'Cache-Control': cacheControl(CACHE_DURATIONS.COMPUTED, {
      staleWhileRevalidate: CACHE_DURATIONS.DYNAMIC,
    }),
  },

  // For static reference data (works, authors, etc.)
  static: {
    'Cache-Control': cacheControl(CACHE_DURATIONS.STATIC, {
      staleWhileRevalidate: CACHE_DURATIONS.COMPUTED,
    }),
  },

  // For search results and dynamic queries
  dynamic: {
    'Cache-Control': cacheControl(CACHE_DURATIONS.DYNAMIC, {
      staleWhileRevalidate: CACHE_DURATIONS.DYNAMIC,
    }),
  },

  // For user-specific or real-time data
  none: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
} as const;

/**
 * Ultra-fast in-memory cache for instant client-side data access
 * Aggressive caching strategy for maximum performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class FastCache {
  private cache: Map<string, CacheEntry<any>>;
  private maxSize: number;

  constructor(maxSize: number = 10000) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  set<T>(key: string, data: T, ttl: number = 300000): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instances
export const translationCache = new FastCache(5000);
export const passageCache = new FastCache(10000);
export const lensCache = new FastCache(2000);
export const contextCache = new FastCache(2000);

/**
 * Cached fetch wrapper
 */
export async function cachedFetch<T>(
  url: string,
  cache: FastCache,
  ttl: number = 300000
): Promise<T> {
  const cached = cache.get<T>(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  cache.set(url, data, ttl);
  return data;
}
