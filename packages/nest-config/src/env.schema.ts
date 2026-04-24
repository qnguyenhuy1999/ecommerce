import { z } from 'zod'

/**
 * Base environment schema shared by every Nest API in this monorepo.
 *
 * Apps that need extra variables (e.g. Stripe for storefront) should extend
 * this with `baseEnvSchema.extend({ ... })` instead of redeclaring the shared
 * fields.
 */
export const baseEnvSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  CORS_ORIGIN: z.string().default('http://localhost:8000'),

  // Database
  DATABASE_URL: z.string(),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional(),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Cookie
  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
  COOKIE_DOMAIN: z.string().optional(),

  // Security
  BCRYPT_SALT_ROUNDS: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 12))
    .pipe(z.number().int().min(1).max(31)),
  ARGON2_MEMORY_COST: z.coerce.number().int().min(1024).default(65536),
  ARGON2_TIME_COST: z.coerce.number().int().min(1).default(3),
  ARGON2_PARALLELISM: z.coerce.number().int().min(1).default(4),

  // Rate Limiting
  RATE_LIMIT_TTL: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 60))
    .pipe(z.number().int().min(1)),
  RATE_LIMIT_MAX: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 100))
    .pipe(z.number().int().min(1)),
})

export type BaseEnv = z.infer<typeof baseEnvSchema>

/**
 * Validates `process.env` against a schema and throws a readable error on
 * failure. Returns the parsed, typed env object.
 */
export function validateEnv<TOutput>(schema: z.ZodType<TOutput>): TOutput {
  const parsed = schema.safeParse(process.env)

  if (!parsed.success) {
    const errors = parsed.error.errors.map((e) => `[${e.path.join('.')}] ${e.message}`).join('\n')
    console.error('❌ Environment validation failed:\n', errors)
    throw new Error(`Environment validation failed:\n${errors}`)
  }

  return parsed.data
}
