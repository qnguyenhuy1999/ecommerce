import 'dotenv/config'

import { baseEnvSchema, validateEnv } from '@ecom/nest-config'
import type { z } from 'zod'

// api-admin currently uses only the shared base (DB, Redis, JWT, cookie,
// argon2, rate-limit, CORS). Extend `baseEnvSchema` here when admin-specific
// variables are added.
const envSchema = baseEnvSchema

export const env = validateEnv(envSchema)

export type Env = z.infer<typeof envSchema>
