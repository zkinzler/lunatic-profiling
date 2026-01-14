import { z } from 'zod';

// ============================================
// Environment Variable Schema
// ============================================

const envSchema = z.object({
  // Database (required)
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .refine(
      (url) => url.startsWith('postgresql://') || url.startsWith('postgres://'),
      'DATABASE_URL must be a valid PostgreSQL connection string'
    ),

  // NextAuth (required)
  NEXTAUTH_SECRET: z
    .string()
    .min(16, 'NEXTAUTH_SECRET must be at least 16 characters'),
  NEXTAUTH_URL: z
    .string()
    .url('NEXTAUTH_URL must be a valid URL'),

  // App Configuration (required)
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL'),

  // OpenAI (optional - falls back to mock)
  OPENAI_API_KEY: z.string().optional(),

  // Email (optional - falls back to console logging)
  RESEND_API_KEY: z.string().optional(),
  RESULTS_DEV_RECIPIENT: z.string().email().optional().or(z.literal('')),
  EMAIL_FROM: z.string().optional(),

  // Sentry (optional)
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),

  // Admin (required for admin endpoints)
  ADMIN_DASHBOARD_TOKEN: z.string().optional(),

  // Node environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

type Env = z.infer<typeof envSchema>;

// ============================================
// Environment Validation
// ============================================

let cachedEnv: Env | null = null;

/**
 * Validate and return environment variables
 * Throws on first call if validation fails
 */
export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `  - ${String(e.path.join('.'))}: ${e.message}`)
      .join('\n');

    throw new Error(
      `Environment validation failed:\n${errors}\n\n` +
        'Please check your .env file and ensure all required variables are set.'
    );
  }

  cachedEnv = result.data;
  return cachedEnv;
}

/**
 * Check if a specific env var is configured
 */
export function hasEnv(key: keyof Env): boolean {
  const env = getEnv();
  const value = env[key];
  return value !== undefined && value !== '';
}

/**
 * Get environment with defaults for optional values
 */
export function getEnvWithDefaults() {
  const env = getEnv();

  return {
    ...env,
    // Provide typed defaults for optional values
    isProduction: env.NODE_ENV === 'production',
    isDevelopment: env.NODE_ENV === 'development',
    isTest: env.NODE_ENV === 'test',
    hasOpenAI: Boolean(env.OPENAI_API_KEY),
    hasResend: Boolean(env.RESEND_API_KEY),
    hasSentry: Boolean(env.SENTRY_DSN),
    hasAdminToken: Boolean(env.ADMIN_DASHBOARD_TOKEN),
  };
}

// ============================================
// Type-safe Environment Access
// ============================================

/**
 * Type-safe environment variable getter
 */
export function env<K extends keyof Env>(key: K): Env[K] {
  return getEnv()[key];
}

// ============================================
// Validation at Build/Startup
// ============================================

/**
 * Validate environment at startup
 * Call this in instrumentation.ts or at app startup
 */
export function validateEnvAtStartup(): void {
  try {
    const env = getEnv();
    console.log('[env] Environment validation passed');
    console.log(`[env] NODE_ENV: ${env.NODE_ENV}`);
    console.log(`[env] OpenAI: ${env.OPENAI_API_KEY ? 'configured' : 'not configured (using mock)'}`);
    console.log(`[env] Resend: ${env.RESEND_API_KEY ? 'configured' : 'not configured (using console)'}`);
    console.log(`[env] Sentry: ${env.SENTRY_DSN ? 'configured' : 'not configured'}`);
  } catch (error) {
    console.error('[env] Environment validation failed:', error);
    if (process.env.NODE_ENV === 'production') {
      // In production, fail fast
      process.exit(1);
    }
  }
}
