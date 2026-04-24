import { Inject, Logger } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { LogoutCommand } from './logout.command'
import {
  REFRESH_TOKEN_REPOSITORY,
  IRefreshTokenRepository,
} from '../../../domain/ports/refresh-token.repository.port'
import { TOKEN_BLACKLIST, ITokenBlacklist } from '../../../domain/ports/token-blacklist.port'

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, void> {
  private readonly logger = new Logger(LogoutHandler.name)

  constructor(
    @Inject(TOKEN_BLACKLIST) private readonly blacklist: ITokenBlacklist,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.blacklist.blacklist(command.accessTokenJti, command.accessTokenRemainingTtlSeconds)
    await this.refreshTokenRepo.revokeAllByUserId(command.userId)
    this.logger.log(`User logged out: ${command.userId}`)
  }
}
