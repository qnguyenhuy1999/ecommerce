import { z } from 'zod'

// App env
export const appEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  API_URL: z.string().default('http://localhost:3000'),
  STOREFRONT_URL: z.string().default('http://localhost:8000'),
  ADMIN_URL: z.string().default('http://localhost:8001'),
  CORS_ORIGIN: z.string().default('http://localhost:8000'),
})

// Database env
export const dbEnvSchema = z.object({
  DATABASE_URL: z.string(),
})

// Redis env
export const redisEnvSchema = z.object({
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
})

// JWT env
export const jwtEnvSchema = z.object({
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
})

// Stripe env
export const stripeEnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_API_VERSION: z.string().default('2024-12-18.acacia'),
})

// Email env
export const emailEnvSchema = z.object({
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string(),
  SMTP_PASSWORD: z.string(),
  EMAIL_FROM: z.string().email(),
})

// Queue env
export const queueEnvSchema = z.object({
  BULLMQ_PREFIX: z.string().default('ecommerce'),
})

// Security env
export const securityEnvSchema = z.object({
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(12),
  ARGON2_MEMORY_COST: z.coerce.number().default(65536),
  ARGON2_TIME_COST: z.coerce.number().default(3),
  ARGON2_PARALLELISM: z.coerce.number().default(4),
})

// Rate limiting env
export const rateLimitEnvSchema = z.object({
  RATE_LIMIT_TTL: z.coerce.number().default(60),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
})

// Full env - merge all
export const envSchema = appEnvSchema
  .merge(dbEnvSchema)
  .merge(redisEnvSchema)
  .merge(jwtEnvSchema)
  .merge(stripeEnvSchema)
  .merge(emailEnvSchema)
  .merge(queueEnvSchema)
  .merge(securityEnvSchema)
  .merge(rateLimitEnvSchema)

export type Env = z.infer<typeof envSchema>
