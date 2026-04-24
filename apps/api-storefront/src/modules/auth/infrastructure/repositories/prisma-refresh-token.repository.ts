import { Injectable, Inject } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { RefreshTokenEntity } from '../../domain/entities/refresh-token.entity'
import type { IRefreshTokenRepository } from '../../domain/ports/refresh-token.repository.port'

type RefreshTokenRecord = {
  id: string
  userId: string
  tokenHash: string
  family: string
  expiresAt: Date
  revokedAt: Date | null
  createdAt: Date
  replacedBy: string | null
}

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  private toDomain(r: RefreshTokenRecord): RefreshTokenEntity {
    return new RefreshTokenEntity({
      id: r.id,
      userId: r.userId,
      tokenHash: r.tokenHash,
      family: r.family,
      expiresAt: r.expiresAt,
      revokedAt: r.revokedAt,
      createdAt: r.createdAt,
      replacedBy: r.replacedBy,
    })
  }

  async create(data: {
    userId: string
    tokenHash: string
    family: string
    expiresAt: Date
  }): Promise<RefreshTokenEntity> {
    const r = await this.prisma.refreshToken.create({ data })
    return this.toDomain(r)
  }

  async findByFamily(family: string): Promise<RefreshTokenEntity[]> {
    const records = await this.prisma.refreshToken.findMany({
      where: { family, revokedAt: null, expiresAt: { gt: new Date() } },
    })
    return records.map((r: RefreshTokenRecord) => this.toDomain(r))
  }

  async revokeById(id: string, replacedBy?: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date(), replacedBy: replacedBy ?? null },
    })
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }

  async revokeFamily(family: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { family },
      data: { revokedAt: new Date() },
    })
  }

  async deleteExpired(): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  }
}
