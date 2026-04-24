import { Injectable, Inject } from '@nestjs/common'
import { $Enums, PrismaClient } from '@prisma/client'

import { UserEntity, type UserRole } from '../../domain/entities/user.entity'
import type { IUserRepository } from '../../domain/ports/user.repository.port'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  private toDomain(record: { id: string; email: string; password: string; role: string; status: string; emailVerified: Date | null; createdAt: Date }): UserEntity {
    return new UserEntity({
      id: record.id,
      email: record.email,
      passwordHash: record.password,
      role: record.role as UserRole,
      status: record.status as 'UNVERIFIED' | 'ACTIVE' | 'SUSPENDED',
      emailVerified: record.emailVerified,
      createdAt: record.createdAt,
    })
  }

  async findById(id: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findUnique({ where: { id } })
    return record ? this.toDomain(record) : null
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const record = await this.prisma.user.findUnique({ where: { email } })
    return record ? this.toDomain(record) : null
  }

  async create(data: { email: string; passwordHash: string; role?: UserRole }): Promise<UserEntity> {
    const record = await this.prisma.user.create({
      data: { email: data.email, password: data.passwordHash, role: (data.role ?? 'USER') as $Enums.UserRole },
    })
    return this.toDomain(record)
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } })
    return count > 0
  }
}
