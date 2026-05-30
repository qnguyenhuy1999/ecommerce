import { Injectable } from '@nestjs/common'
import { PrismaService } from '@ecom/database'
import { ReturnStatus } from '@ecom/contracts/enums/order'
import { SellerStatus } from '@ecom/contracts/enums/seller'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}
  async getMetrics() {
    const [
      totalSellers,
      activeSellers,
      pendingSellers,
      totalUsers,
      totalOrders,
      totalProducts,
      pendingRefunds,
      totalReviews,
      recentSellers,
    ] = await Promise.all([
      this.prisma.seller.count({ where: { deletedAt: null } }),
      this.prisma.seller.count({ where: { status: SellerStatus.ACTIVE, deletedAt: null } }),
      this.prisma.seller.count({ where: { status: SellerStatus.PENDING, deletedAt: null } }),
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.returnRequest.count({
        where: { status: { in: [ReturnStatus.REQUESTED, ReturnStatus.REVIEWING] } },
      }),
      this.prisma.review.count(),
      this.prisma.seller.findMany({
        where: { deletedAt: null },
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

    return {
      totalSellers,
      activeSellers,
      pendingSellers,
      totalUsers,
      totalOrders,
      totalProducts,
      pendingRefunds,
      totalReviews,
      recentSellers,
    }
  }

  async getAnalytics(period: string = '30d') {
    let days = 30
    if (period === '7d') days = 7
    else if (period === '90d') days = 90
    const since = new Date()
    since.setDate(since.getDate() - days)

    const previousSince = new Date(since)
    previousSince.setDate(previousSince.getDate() - days)

    const [orders, previousOrders, topCategories] = await Promise.all([
      this.prisma.order.findMany({
        where: { createdAt: { gte: since } },
        select: { createdAt: true, totalAmount: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.order.findMany({
        where: { createdAt: { gte: previousSince, lt: since } },
        select: { totalAmount: true },
      }),
      this.prisma.product.groupBy({
        by: ['categoryId'],
        _count: { id: true },
        where: { deletedAt: null, categoryId: { not: null } },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ])

    const orderTotalsByDay = new Map<string, number>()

    for (const order of orders) {
      const day = order.createdAt.toISOString().slice(0, 10)
      const existingTotal = orderTotalsByDay.get(day) ?? 0
      orderTotalsByDay.set(day, existingTotal + Number(order.totalAmount))
    }

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
    const previousRevenue = previousOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount),
      0,
    )
    const revenueTrendPercent =
      previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : null

    return {
      totalRevenue,
      revenueTrendPercent,
      ordersByDay: Array.from(orderTotalsByDay.entries()).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      topCategories: topCategories.map((category) => ({
        categoryId: category.categoryId,
        count: category._count.id,
      })),
    }
  }
}
