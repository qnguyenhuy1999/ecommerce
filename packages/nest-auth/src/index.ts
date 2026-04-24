// Module
export { AuthModule } from './auth.module'

// Controller (rarely consumed directly, but useful for tests)
export { AuthController } from './presentation/auth.controller'

// Guards
export { JwtAccessGuard } from './presentation/guards/jwt-access.guard'
export { JwtRefreshGuard } from './presentation/guards/jwt-refresh.guard'
export { RolesGuard } from './presentation/guards/roles.guard'

// Decorators
export { CurrentUser } from './presentation/decorators/current-user.decorator'
export { Roles } from './presentation/decorators/roles.decorator'

// Domain entities
export { UserEntity } from './domain/entities/user.entity'
export type { UserRole, UserStatus, UserProps } from './domain/entities/user.entity'
export { RefreshTokenEntity } from './domain/entities/refresh-token.entity'
export type { RefreshTokenProps } from './domain/entities/refresh-token.entity'

// Domain exceptions
export * from './domain/exceptions/auth.exceptions'

// Domain ports (tokens + interfaces)
export { USER_REPOSITORY } from './domain/ports/user.repository.port'
export type { IUserRepository } from './domain/ports/user.repository.port'
export { REFRESH_TOKEN_REPOSITORY } from './domain/ports/refresh-token.repository.port'
export type { IRefreshTokenRepository } from './domain/ports/refresh-token.repository.port'
export { PASSWORD_HASHER } from './domain/ports/password-hasher.port'
export type { IPasswordHasher } from './domain/ports/password-hasher.port'
export { COOKIE_WRITER } from './domain/ports/cookie-writer.port'
export type { ICookieWriter } from './domain/ports/cookie-writer.port'
export { LOGIN_LIMITER } from './domain/ports/login-limiter.port'
export type { ILoginLimiter } from './domain/ports/login-limiter.port'
export { TOKEN_BLACKLIST } from './domain/ports/token-blacklist.port'
export type { ITokenBlacklist } from './domain/ports/token-blacklist.port'

// Infrastructure — surfaced so consumers (e.g. UserModule) can re-provide
// the repository without duplicating the Prisma adapter.
export { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository'
export { PrismaRefreshTokenRepository } from './infrastructure/repositories/prisma-refresh-token.repository'

// Application — commands, queries, DTOs, services, types
export { LoginCommand } from './application/commands/login/login.command'
export { LoginHandler } from './application/commands/login/login.handler'
export type { LoginResult } from './application/commands/login/login.handler'
export { LogoutCommand } from './application/commands/logout/logout.command'
export { LogoutHandler } from './application/commands/logout/logout.handler'
export { RefreshCommand } from './application/commands/refresh/refresh.command'
export { RefreshHandler } from './application/commands/refresh/refresh.handler'
export { RegisterCommand } from './application/commands/register/register.command'
export { RegisterHandler } from './application/commands/register/register.handler'
export { MeQuery } from './application/queries/me/me.query'
export { MeHandler } from './application/queries/me/me.handler'
export { RegisterDto } from './application/dtos/register.dto'
export { LoginDto } from './application/dtos/login.dto'
export { AuthResponseDto, AuthUserDto } from './application/dtos/auth-response.dto'
export { JwtTokenService } from './application/services/jwt-token.service'
export type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './application/services/jwt-token.service'
export type {
  AuthSessionResult,
  AuthTokens,
  AuthTokenExpirySeconds,
} from './application/types/auth-session-result'
