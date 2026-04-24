import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  API_URL: z.string().default('http://localhost:3000'),
  STOREFRONT_URL: z.string().default('http://localhost:8000'),
  ADMIN_URL: z.string().default('http://localhost:8001'),
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

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional().default(''),
  STRIPE_PUBLISHABLE_KEY: z.string().optional().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),
  STRIPE_API_VERSION: z.string().optional().default('2024-12-18.acacia'),

  // BullMQ
  BULLMQ_PREFIX: z.string().optional().default('ecommerce'),

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

  // Email / SMTP
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 587))
    .pipe(z.number().int().min(1).max(65535)),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASSWORD: z.string().optional().default(''),
  EMAIL_FROM: z.string().optional().default('noreply@example.com'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const errors = parsed.error.errors.map((e) => `[${e.path.join('.')}] ${e.message}`).join('\n')
  // eslint-disable-next-line no-console -- Environment schema errors must be visible during startup.
  console.error('❌ Environment validation failed:\n', errors)
  throw new Error(`Environment validation failed:\n${errors}`)
}

export const env = parsed.data

export type Env = z.infer<typeof envSchema>
