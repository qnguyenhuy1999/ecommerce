import { Inject, Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'

import type { PayoutReportPage, PayoutReportRow, SellerLedgerPage, SellerLedgerView } from '../../application/views/commission.view'
import type {
  AdminPayoutReportInput,
  ICommissionRepository,
  ListSellerLedgerInput,
} from '../../domain/ports/commission.repository.port'

type LedgerRow = Prisma.SellerLedgerGetPayload<Record<string, never>>
type CommissionWithSeller = Prisma.CommissionGetPayload<{
  include: { seller: { select: { storeName: true } } }
}>

@Injectable()
export class PrismaCommissionRepository implements ICommissionRepository {
  constructor(@Inject(PrismaClient) private readonly prisma: PrismaClient) {}

  async listSellerLedger(input: ListSellerLedgerInput): Promise<SellerLedgerPage> {
    const where: Prisma.SellerLedgerWhereInput = { sellerId: input.sellerId }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.sellerLedger.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      this.prisma.sellerLedger.count({ where }),
    ])

    return {
      data: rows.map(toLedgerView),
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.limit)),
    }
  }

  async adminPayoutReport(input: AdminPayoutReportInput): Promise<PayoutReportPage> {
    const where: Prisma.CommissionWhereInput = {}
    if (input.sellerId) {
      where.sellerId = input.sellerId
    }
    if (input.from || input.to) {
      where.createdAt = {}
      if (input.from) {
        where.createdAt.gte = input.from
      }
      if (input.to) {
        where.createdAt.lte = input.to
      }
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.commission.findMany({
        where,
        include: { seller: { select: { storeName: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
      }),
      this.prisma.commission.count({ where }),
    ])

    return {
      data: rows.map(toPayoutRow),
      page: input.page,
      limit: input.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / input.limit)),
    }
  }
}

function toLedgerView(row: LedgerRow): SellerLedgerView {
  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    referenceType: row.referenceType,
    referenceId: row.referenceId,
    description: row.description,
    createdAt: row.createdAt.toISOString(),
  }
}

function toPayoutRow(row: CommissionWithSeller): PayoutReportRow {
  return {
    commissionId: row.id,
    orderId: row.orderId,
    sellerId: row.sellerId,
    storeName: row.seller.storeName,
    amount: row.amount,
    rate: row.rate,
    createdAt: row.createdAt.toISOString(),
  }
}
