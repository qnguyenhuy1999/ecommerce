import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Inject } from '@nestjs/common'
import { LogoutCommand } from './logout.command'
import { TOKEN_BLACKLIST, ITokenBlacklist } from '../../../domain/ports/token-blacklist.port'
import { REFRESH_TOKEN_REPOSITORY, IRefreshTokenRepository } from '../../../domain/ports/refresh-token.repository.port'

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand, void> {
  constructor(
    @Inject(TOKEN_BLACKLIST) private readonly blacklist: ITokenBlacklist,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: IRefreshTokenRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.blacklist.blacklist(command.accessTokenJti, command.accessTokenRemainingTtlSeconds)
    await this.refreshTokenRepo.revokeAllByUserId(command.userId)
  }
}
