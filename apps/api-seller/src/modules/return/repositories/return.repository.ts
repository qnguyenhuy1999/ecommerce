import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { type Prisma } from '@ecom/database'
import { offsetPaginate } from '@ecom/shared/pagination/prisma'
import { ReturnStatus } from '@ecom/contracts/enums/order'

@Injectable()
export class ReturnRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: Prisma.ReturnRequestWhereInput,
    page: number,
    limit: number,
    orderBy: Prisma.ReturnRequestOrderByWithRelationInput,
  ) {
    return offsetPaginate(this.prisma.returnRequest, {
      page,
      limit,
      where,
      include: {
        items: true,
        _count: { select: { evidence: true, timeline: true } },
      },
      orderBy,
    })
  }

  async findOne(id: string, shopId: string) {
    return this.prisma.returnRequest.findFirst({
      where: { id, shopId },
      include: {
        items: true,
        evidence: { orderBy: { createdAt: 'desc' } },
        timeline: { orderBy: { createdAt: 'desc' } },
      },
    })
  }

  async findOneBasic(id: string, shopId: string) {
    return this.prisma.returnRequest.findFirst({
      where: { id, shopId },
    })
  }

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn)
  }

  async createEvidence(data: Prisma.ReturnEvidenceUncheckedCreateInput) {
    return this.prisma.returnEvidence.create({ data })
  }

  async countByStatus(shopId: string, statuses: ReturnStatus[]): Promise<number> {
    return this.prisma.returnRequest.count({
      where: { shopId, status: { in: statuses } },
    })
  }

  async countAll(shopId: string): Promise<number> {
    return this.prisma.returnRequest.count({ where: { shopId } })
  }

  async countSingleStatus(shopId: string, status: ReturnStatus): Promise<number> {
    return this.prisma.returnRequest.count({ where: { shopId, status } })
  }
}
