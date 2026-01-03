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
