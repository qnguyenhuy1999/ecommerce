import { Injectable } from '@nestjs/common'
import { getRedis } from '@ecom/redis'
import type { ITokenBlacklist } from '../../domain/ports/token-blacklist.port'

@Injectable()
export class RedisTokenBlacklistAdapter implements ITokenBlacklist {
  async blacklist(jti: string, ttlSeconds: number): Promise<void> {
    if (ttlSeconds <= 0) return
    const redis = getRedis()
    await redis.setex(`bl:jti:${jti}`, ttlSeconds, '1')
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    const redis = getRedis()
    const result = await redis.exists(`bl:jti:${jti}`)
    return result === 1
  }
}
