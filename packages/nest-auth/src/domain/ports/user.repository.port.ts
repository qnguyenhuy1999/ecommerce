import type { UserEntity, UserRole } from '../entities/user.entity'

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  create(data: { email: string; passwordHash: string; role?: UserRole }): Promise<UserEntity>
  existsByEmail(email: string): Promise<boolean>
  verifyEmail(userId: string): Promise<UserEntity>
  updatePassword(userId: string, passwordHash: string): Promise<UserEntity>
  recordAudit(input: {
    actorId: string | null
    action: string
    targetType: string
    targetId: string | null
    metadata?: Record<string, unknown>
  }): Promise<void>
}
