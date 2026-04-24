import type { BaseEnv } from './env.schema'

/**
 * Builds the configuration slice every Nest API needs: node env, db, redis,
 * jwt, cookie, argon2, rate-limit, cors. Apps can spread the result and add
 * their own keys on top.
 */
export function buildBaseConfiguration(env: BaseEnv) {
  return {
    nodeEnv: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    database: {
      url: env.DATABASE_URL,
    },
    redis: {
      host: env.REDIS_HOST,
      port: parseInt(env.REDIS_PORT, 10),
      password: env.REDIS_PASSWORD ?? undefined,
    },
    jwt: {
      accessSecret: env.JWT_ACCESS_SECRET,
      refreshSecret: env.JWT_REFRESH_SECRET,
      accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
      refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },
    cookie: {
      secure: env.COOKIE_SECURE,
      domain: env.COOKIE_DOMAIN,
    },
    argon2: {
      memoryCost: env.ARGON2_MEMORY_COST,
      timeCost: env.ARGON2_TIME_COST,
      parallelism: env.ARGON2_PARALLELISM,
    },
    rateLimit: {
      ttl: env.RATE_LIMIT_TTL,
      max: env.RATE_LIMIT_MAX,
    },
    cors: {
      origin: env.CORS_ORIGIN,
    },
  }
}

export type BaseConfiguration = ReturnType<typeof buildBaseConfiguration>
