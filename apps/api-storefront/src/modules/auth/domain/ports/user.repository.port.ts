import type { UserEntity, UserRole } from '../entities/user.entity'

export const USER_REPOSITORY = Symbol('USER_REPOSITORY')
export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  create(data: { email: string; passwordHash: string; role?: UserRole }): Promise<UserEntity>
  existsByEmail(email: string): Promise<boolean>
}
