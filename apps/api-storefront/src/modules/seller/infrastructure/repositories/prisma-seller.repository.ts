import { Inject, Injectable } from '@nestjs/common'
import { KycStatus as PrismaKycStatus, Prisma, PrismaClient } from '@prisma/client'

import type {
  AdminSellerDetailView,
  AdminSellerListInput,
  AdminSellerListPage,
  AdminSellerSummaryView,
} from '../../application/views/admin-seller.view'
import { type KycStatus, SellerEntity } from '../../domain/entities/seller.entity'
import { SellerKycNotPendingException } from '../../domain/exceptions/seller.exceptions'
import type {
  ISellerRepository,
  SellerCreateInput,
  SellerKycTransitionCallback,
  SellerKycTransitionInput,
  SellerUpdateInput,
} from '../../domain/ports/seller.repository.port'

const SELLER_ADMIN_INCLUDE = {
  user: { select: { email: true } },
} satisfies Prisma.SellerInclude

type SellerRow = Prisma.SellerGetPayload<Record<string, never>>
type SellerAdminRow = Prisma.SellerGetPayload<{ include: typeof SELLER_ADMIN_INCLUDE }>

@Injectable()
export class PrismaSellerRepository implements ISellerRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<SellerEntity | null> {
    const record = await this.prisma.seller.findUnique({ where: { id } })
    return record ? this.toDomain(record) : null
  }

  async findByUserId(userId: string): Promise<SellerEntity | null> {
    const record = await this.prisma.seller.findUnique({ where: { userId } })
    return record ? this.toDomain(record) : null
  }

  async create(input: SellerCreateInput): Promise<SellerEntity> {
    const record = await this.prisma.$transaction(async (tx) => {
      const seller = await tx.seller.create({
        data: {
          userId: input.userId,
          storeName: input.storeName,
          storeDescription: input.storeDescription ?? null,
          businessRegistrationNumber: input.businessRegistrationNumber ?? null,
          bankAccountNumber: input.bankAccountNumber ?? null,
          bankCode: input.bankCode ?? null,
          kycDocuments: toJsonOrNull(input.kycDocuments ?? null),
        },
      })
      await tx.user.update({ where: { id: input.userId }, data: { role: 'SELLER' } })
      return seller
    })
    return this.toDomain(record)
  }

  async update(id: string, input: SellerUpdateInput): Promise<SellerEntity> {
    const data: Prisma.SellerUpdateInput = {}
    if (input.storeName !== undefined) data.storeName = input.storeName
    if (input.storeDescription !== undefined) data.storeDescription = input.storeDescription
    if (input.businessRegistrationNumber !== undefined) {
      data.businessRegistrationNumber = input.businessRegistrationNumber
    }
    if (input.bankAccountNumber !== undefined) data.bankAccountNumber = input.bankAccountNumber
    if (input.bankCode !== undefined) data.bankCode = input.bankCode
    if (input.kycDocuments !== undefined) data.kycDocuments = toJsonOrNull(input.kycDocuments)

    const record = await this.prisma.seller.update({ where: { id }, data })
    return this.toDomain(record)
  }

  async transitionKycStatus(
    input: SellerKycTransitionInput,
    withinTx?: SellerKycTransitionCallback,
  ): Promise<SellerEntity> {
    return this.prisma.$transaction(async (tx) => {
      // Compare-and-set guards against concurrent moderation actions: if
      // another admin already approved/rejected the seller, `count` will
      // be 0 and we surface the same exception the handler raises during
      // its preflight.
      const claimed = await tx.seller.updateMany({
        where: { id: input.sellerId, kycStatus: input.fromStatus as PrismaKycStatus },
        data: { kycStatus: input.toStatus as PrismaKycStatus },
      })
      if (claimed.count !== 1) {
        const current = await tx.seller.findUnique({
          where: { id: input.sellerId },
          select: { kycStatus: true },
        })
        throw new SellerKycNotPendingException(current?.kycStatus ?? 'UNKNOWN')
      }

      await tx.outboxEvent.create({
        data: {
          aggregateType: 'Seller',
          aggregateId: input.sellerId,
          eventType: input.toStatus === 'APPROVED' ? 'SELLER_KYC_APPROVED' : 'SELLER_KYC_REJECTED',
          payload: toJsonValue(await this.buildKycOutboxPayload(tx, input)),
        },
      })

      await tx.auditEvent.create({
        data: {
          actorId: input.adminUserId,
          action: input.toStatus === 'APPROVED' ? 'SELLER_KYC_APPROVED' : 'SELLER_KYC_REJECTED',
          targetType: 'Seller',
          targetId: input.sellerId,
          metadata: toJsonValue({
            fromStatus: input.fromStatus,
            toStatus: input.toStatus,
            reason: input.reason ?? null,
          }),
        },
      })

      const refreshed = await tx.seller.findUniqueOrThrow({ where: { id: input.sellerId } })
      const seller = this.toDomain(refreshed)

      if (withinTx) {
        await withinTx(tx, seller)
      }

      return seller
    })
  }

  private async buildKycOutboxPayload(
    tx: Prisma.TransactionClient,
    input: SellerKycTransitionInput,
  ): Promise<Record<string, unknown>> {
    const seller = await tx.seller.findUnique({
      where: { id: input.sellerId },
      select: { storeName: true, user: { select: { email: true } } },
    })
    return {
      sellerId: input.sellerId,
      storeName: seller?.storeName ?? null,
      ownerEmail: seller?.user.email ?? null,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      adminUserId: input.adminUserId,
      reason: input.reason ?? null,
    }
  }

  async listForAdmin(input: AdminSellerListInput): Promise<AdminSellerListPage> {
    const where: Prisma.SellerWhereInput = {
      ...(input.kycStatus ? { kycStatus: input.kycStatus as PrismaKycStatus } : {}),
      ...(input.search
        ? {
            OR: [
              { storeName: { contains: input.search, mode: 'insensitive' } },
              { user: { email: { contains: input.search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    }

    const skip = (input.page - 1) * input.limit
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.seller.findMany({
        where,
        include: SELLER_ADMIN_INCLUDE,
        orderBy: { createdAt: 'desc' },
        skip,
        take: input.limit,
      }),
      this.prisma.seller.count({ where }),
    ])

    return {
      data: rows.map((row): AdminSellerSummaryView => this.toAdminSummary(row)),
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.limit)),
    }
  }

  async findDetailForAdmin(sellerId: string): Promise<AdminSellerDetailView | null> {
    const row = await this.prisma.seller.findUnique({
      where: { id: sellerId },
      include: SELLER_ADMIN_INCLUDE,
    })
    if (!row) return null
    return {
      ...this.toAdminSummary(row),
      storeDescription: row.storeDescription,
      businessRegistrationNumber: row.businessRegistrationNumber,
      bankAccountNumber: row.bankAccountNumber,
      bankCode: row.bankCode,
      kycDocuments: (row.kycDocuments as Record<string, unknown> | null) ?? null,
      updatedAt: row.updatedAt.toISOString(),
    }
  }

  private toAdminSummary(row: SellerAdminRow): AdminSellerSummaryView {
    return {
      id: row.id,
      userId: row.userId,
      storeName: row.storeName,
      ownerEmail: row.user.email,
      kycStatus: row.kycStatus as KycStatus,
      commissionRate: row.commissionRate,
      rating: row.rating,
      totalRatings: row.totalRatings,
      submittedAt: row.createdAt.toISOString(),
    }
  }

  private toDomain(record: SellerRow): SellerEntity {
    return new SellerEntity({
      id: record.id,
      userId: record.userId,
      storeName: record.storeName,
      storeDescription: record.storeDescription,
      kycStatus: record.kycStatus as KycStatus,
      kycDocuments: (record.kycDocuments as Record<string, unknown> | null) ?? null,
      commissionRate: record.commissionRate,
      rating: record.rating,
      totalRatings: record.totalRatings,
      businessRegistrationNumber: record.businessRegistrationNumber,
      bankAccountNumber: record.bankAccountNumber,
      bankCode: record.bankCode,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })
  }
}

function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value ?? null)) as Prisma.InputJsonValue
}

function toJsonOrNull(value: Record<string, unknown> | null): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (value === null) return Prisma.JsonNull
  return toJsonValue(value)
}
