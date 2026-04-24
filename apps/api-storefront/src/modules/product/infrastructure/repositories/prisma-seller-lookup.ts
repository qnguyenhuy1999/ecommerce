import { Inject, Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { type KycStatus, SellerSummary } from '../../domain/entities/seller.entity'
import type { ISellerLookup } from '../../domain/ports/seller-lookup.port'

@Injectable()
export class PrismaSellerLookup implements ISellerLookup {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<SellerSummary | null> {
    const record = await this.prisma.seller.findUnique({
      where: { userId },
      select: { id: true, userId: true, storeName: true, kycStatus: true },
    })
    if (!record) return null
    return new SellerSummary({
      id: record.id,
      userId: record.userId,
      storeName: record.storeName,
      kycStatus: record.kycStatus as KycStatus,
    })
  }
}
