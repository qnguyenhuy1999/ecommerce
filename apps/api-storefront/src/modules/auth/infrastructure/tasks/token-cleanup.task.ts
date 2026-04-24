import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common'

import {
  REFRESH_TOKEN_REPOSITORY,
  IRefreshTokenRepository,
} from '../../domain/ports/refresh-token.repository.port'

const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000 // 24 hours

@Injectable()
export class TokenCleanupTask implements OnModuleInit {
  private readonly logger = new Logger(TokenCleanupTask.name)

  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  onModuleInit(): void {
    void this.cleanup()
    setInterval(() => void this.cleanup(), CLEANUP_INTERVAL_MS)
  }

  private async cleanup(): Promise<void> {
    try {
      await this.refreshTokenRepo.deleteExpired()
      this.logger.log('Expired refresh tokens cleaned up')
    } catch (err) {
      this.logger.error('Failed to clean up expired refresh tokens', err)
    }
  }
}
