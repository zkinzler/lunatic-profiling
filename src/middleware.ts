import { NextRequest, NextResponse } from 'next/server';

// ============================================
// Rate Limiting Configuration
// ============================================

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

// Rate limits per endpoint pattern
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  '/api/user/start': { windowMs: 60000, maxRequests: 10 }, // 10 req/min - session creation
  '/api/quiz/grade': { windowMs: 60000, maxRequests: 5 }, // 5 req/min - expensive operation
  '/api/quiz/roast': { windowMs: 60000, maxRequests: 30 }, // 30 req/min - OpenAI calls
  '/api/quiz/email': { windowMs: 60000, maxRequests: 3 }, // 3 req/min - email sending
  '/api/quiz/transition': { windowMs: 60000, maxRequests: 20 }, // 20 req/min
  '/api/quiz/save': { windowMs: 60000, maxRequests: 60 }, // 60 req/min - frequent saves
  '/api/culling/start': { windowMs: 60000, maxRequests: 10 }, // 10 req/min - session creation
  '/api/culling/gate': { windowMs: 60000, maxRequests: 20 }, // 20 req/min - gate answers
  '/api/culling/answer': { windowMs: 60000, maxRequests: 15 }, // 15 req/min - triggers AI
  '/api/culling/grade': { windowMs: 60000, maxRequests: 5 }, // 5 req/min - expensive scoring
  '/api/culling/email': { windowMs: 60000, maxRequests: 3 }, // 3 req/min - email capture
  '/api/culling/result': { windowMs: 60000, maxRequests: 20 }, // 20 req/min - result reads
  '/api/culling/session': { windowMs: 60000, maxRequests: 20 }, // 20 req/min - session reads
};

// Default rate limit for other API endpoints
const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60000,
  maxRequests: 100,
};

// ============================================
// In-Memory Rate Limiter (for Vercel Edge)
// ============================================

// Note: In production with multiple instances, use Vercel KV or Redis
// This in-memory store works for single-instance deployments

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Map of IP:path -> rate limit entry
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
function cleanupStore(): void {
  const now = Date.now();
  rateLimitStore.forEach((entry, key) => {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  });
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupStore, 5 * 60 * 1000);
}

/**
 * Check if a request should be rate limited
 */
function checkRateLimit(
  ip: string,
  path: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetAt: number } {
  const key = `${ip}:${path}`;
  const now = Date.now();

  let entry = rateLimitStore.get(key);

  // If no entry or window expired, create new entry
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  const limited = entry.count > config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  return { limited, remaining, resetAt: entry.resetAt };
}

/**
 * Get rate limit config for a path
 */
function getRateLimitConfig(path: string): RateLimitConfig {
  // Check for exact match first
  if (RATE_LIMITS[path]) {
    return RATE_LIMITS[path];
  }

  // Check for prefix matches (for dynamic routes)
  for (const [pattern, config] of Object.entries(RATE_LIMITS)) {
    if (path.startsWith(pattern)) {
      return config;
    }
  }

  return DEFAULT_RATE_LIMIT;
}

// ============================================
// Middleware Handler
// ============================================

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to API routes
  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Skip rate limiting for health check
  if (pathname === '/api/health') {
    return NextResponse.next();
  }

  // Get client IP (Vercel sets this header)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  // Get rate limit config for this path
  const config = getRateLimitConfig(pathname);

  // Check rate limit
  const { limited, remaining, resetAt } = checkRateLimit(ip, pathname, config);

  if (limited) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.ceil((resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(resetAt / 1000).toString(),
          'Retry-After': Math.ceil((resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // Add rate limit headers to response
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(resetAt / 1000).toString());

  return response;
}

// ============================================
// Middleware Config
// ============================================

export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
};
