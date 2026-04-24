import 'dotenv/config'

import { baseEnvSchema, validateEnv } from '@ecom/nest-config'
import { z } from 'zod'

/**
 * Storefront-specific env overlay. The shared base (DB, Redis, JWT, cookie,
 * argon2, rate-limit, CORS, node env, port) lives in `@ecom/nest-config`.
 * Anything below is exclusive to the customer-facing API.
 */
const envSchema = baseEnvSchema.extend({
  // Application URLs (storefront-specific)
  API_URL: z.string().default('http://localhost:3000'),
  STOREFRONT_URL: z.string().default('http://localhost:8000'),
  ADMIN_URL: z.string().default('http://localhost:8001'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional().default(''),
  STRIPE_PUBLISHABLE_KEY: z.string().optional().default(''),
  STRIPE_WEBHOOK_SECRET: z.string().optional().default(''),
  STRIPE_API_VERSION: z.string().optional().default('2024-12-18.acacia'),

  // BullMQ
  BULLMQ_PREFIX: z.string().optional().default('ecommerce'),

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

export const env = validateEnv(envSchema)

export type Env = z.infer<typeof envSchema>
