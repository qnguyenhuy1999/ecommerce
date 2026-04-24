import { Injectable } from '@nestjs/common'

import { getRedis } from '@ecom/redis'

import type { ILoginLimiter } from '../../domain/ports/login-limiter.port'

const MAX_ATTEMPTS = 5
const WINDOW_SECONDS = 900 // 15 minutes

@Injectable()
export class RedisLoginLimiterAdapter implements ILoginLimiter {
  private key(email: string): string {
    return `login:fail:${email.toLowerCase()}`
  }

  async recordFailure(email: string): Promise<number> {
    const redis = getRedis()
    const key = this.key(email)
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, WINDOW_SECONDS)
    return count
  }

  async isLocked(email: string): Promise<boolean> {
    const redis = getRedis()
    const val = await redis.get(this.key(email))
    return val !== null && parseInt(val, 10) >= MAX_ATTEMPTS
  }

  async reset(email: string): Promise<void> {
    const redis = getRedis()
    await redis.del(this.key(email))
  }
}
