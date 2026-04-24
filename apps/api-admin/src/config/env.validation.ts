import 'dotenv/config'

import { z } from 'zod'

import { baseEnvSchema, validateEnv } from '@ecom/nest-config'

// api-admin extends the shared base to override defaults aimed at the
// storefront (PORT :3000, CORS_ORIGIN :8000). The admin API listens on
// :3001 and the admin UI runs on :8001. Add admin-specific variables
// here as they come up.
const envSchema = baseEnvSchema.extend({
  PORT: z.string().default('3001'),
  CORS_ORIGIN: z.string().default('http://localhost:8001'),
})

export const env = validateEnv(envSchema)

export type Env = z.infer<typeof envSchema>
