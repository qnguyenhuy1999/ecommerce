import type { RefreshTokenEntity } from '../entities/refresh-token.entity'

export const REFRESH_TOKEN_REPOSITORY = Symbol('REFRESH_TOKEN_REPOSITORY')
export interface IRefreshTokenRepository {
  create(data: { userId: string; tokenHash: string; family: string; expiresAt: Date }): Promise<RefreshTokenEntity>
  findByFamily(family: string): Promise<RefreshTokenEntity[]>
  revokeById(id: string, replacedBy?: string): Promise<void>
  revokeAllByUserId(userId: string): Promise<void>
  revokeFamily(family: string): Promise<void>
  deleteExpired(): Promise<void>
}
