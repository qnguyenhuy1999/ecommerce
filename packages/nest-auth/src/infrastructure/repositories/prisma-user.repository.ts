import { Injectable, Inject } from '@nestjs/common'
import { $Enums, Prisma, PrismaClient } from '@prisma/client'

import { UserEntity, type UserRole } from '../../domain/entities/user.entity'
import type { IUserRepository } from '../../domain/ports/user.repository.port'

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  private toDomain(record: {
    id: string
    email: string
    password: string
    role: string
    status: string
    emailVerified: Date | null
    createdAt: Date
  }): UserEntity {
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

  async create(data: {
    email: string
    passwordHash: string
    role?: UserRole
  }): Promise<UserEntity> {
    const record = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.passwordHash,
        role: (data.role ?? 'USER') as $Enums.UserRole,
      },
    })
    return this.toDomain(record)
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } })
    return count > 0
  }

  async verifyEmail(userId: string): Promise<UserEntity> {
    const record = await this.prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE', emailVerified: new Date() },
    })
    return this.toDomain(record)
  }

  async updatePassword(userId: string, passwordHash: string): Promise<UserEntity> {
    const record = await this.prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    })
    return this.toDomain(record)
  }

  async recordAudit(input: {
    actorId: string | null
    action: string
    targetType: string
    targetId: string | null
    metadata?: Record<string, unknown>
  }): Promise<void> {
    const prisma = this.prisma as PrismaClient & {
      auditEvent: {
        create(args: { data: Prisma.AuditEventUncheckedCreateInput }): Promise<unknown>
      }
    }
    await prisma.auditEvent.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
      },
    })
  }
}
