import { Injectable } from '@nestjs/common'
import { PrismaService, Prisma } from '@ecom/database'
import { type OrderStatus } from '@ecom/contracts/enums/order'
import { offsetPaginate } from '@ecom/shared/pagination/prisma/offset-paginate'
import { withDefined } from '@ecom/shared/utils/optional-object'

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: {
    page?: number
    limit?: number
    search?: string
    status?: OrderStatus
    buyerId?: string
  }) {
    const where: Prisma.OrderWhereInput = {}
    if (query.status) where.status = query.status
    if (query.buyerId) where.buyerId = query.buyerId
    if (query.search) {
      where.OR = [{ id: query.search }]
    }

    return offsetPaginate(this.prisma.order, {
      ...withDefined({ page: query.page, limit: query.limit }),
      where,
      include: {
        sellerOrders: {
          include: {
            shop: { select: { id: true, name: true } },
            _count: { select: { items: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        sellerOrders: {
          include: {
            shop: { select: { id: true, name: true } },
            items: true,
            shipments: true,
            auditLogs: { orderBy: { createdAt: 'desc' } },
          },
        },
      },
    })
  }

  async $transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn)
  }

  async groupByStatus() {
    return this.prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    })
  }
}
