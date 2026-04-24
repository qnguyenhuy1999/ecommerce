import 'dotenv/config'

import { baseEnvSchema, validateEnv } from '@ecom/nest-config'
import { z } from 'zod'

// api-admin extends the shared base only to override CORS_ORIGIN — the base
// default targets the storefront (:8000); the admin UI runs on :8001. Add
// admin-specific variables here as they come up.
const envSchema = baseEnvSchema.extend({
  CORS_ORIGIN: z.string().default('http://localhost:8001'),
})

export const env = validateEnv(envSchema)

export type Env = z.infer<typeof envSchema>
