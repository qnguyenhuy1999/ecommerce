import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { OrderStatus, PrismaClient, ProductStatus } from '@prisma/client'

import { JwtAccessGuard, Roles, RolesGuard } from '@ecom/nest-auth'

interface AdminDashboardMetric {
  label: string
  value: number
  previousValue: number
  format: 'number' | 'currency' | 'percent'
}

interface AdminDashboardActivity {
  id: string
  user: { name: string }
  action: string
  target?: string
  timestamp: string
  isLatest?: boolean
}

interface AdminDashboardView {
  metrics: AdminDashboardMetric[]
  activities: AdminDashboardActivity[]
  notifications: Array<{
    id: string
    title: string
    message: string
    timestamp: string
    read: boolean
    type: 'info' | 'success' | 'warning' | 'error'
  }>
}

@ApiTags('admin')
@Controller('admin/dashboard')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('ADMIN')
@ApiCookieAuth('access_token')
export class AdminDashboardController {
  constructor(private readonly prisma: PrismaClient) {}

  @Get()
  @ApiOperation({ summary: 'Live marketplace dashboard metrics.' })
  async getDashboard(): Promise<{ success: true; data: AdminDashboardView }> {
    const now = new Date()
    const currentStart = daysAgo(now, 30)
    const previousStart = daysAgo(now, 60)

    const [
      currentOrders,
      previousOrders,
      activeSellers,
      previousActiveSellers,
      catalogSkus,
      previousCatalogSkus,
      pendingSellers,
      recentOrders,
      recentSellers,
    ] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: currentStart },
          status: { in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.COMPLETED] },
        },
        _sum: { totalAmount: true },
        _count: { _all: true },
      }),
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: previousStart, lt: currentStart },
          status: { in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.COMPLETED] },
        },
        _sum: { totalAmount: true },
        _count: { _all: true },
      }),
      this.prisma.seller.count({ where: { kycStatus: 'APPROVED' } }),
      this.prisma.seller.count({ where: { kycStatus: 'APPROVED', createdAt: { lt: currentStart } } }),
      this.prisma.product.count({ where: { status: ProductStatus.ACTIVE, deletedAt: null } }),
      this.prisma.product.count({
        where: { status: ProductStatus.ACTIVE, deletedAt: null, createdAt: { lt: currentStart } },
      }),
      this.prisma.seller.findMany({
        where: { kycStatus: 'PENDING' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, orderNumber: true, status: true, createdAt: true, buyer: { select: { email: true } } },
      }),
      this.prisma.seller.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { id: true, storeName: true, kycStatus: true, updatedAt: true },
      }),
    ])

    const activities = [
      ...recentOrders.map((order) => ({
        id: `order:${order.id}`,
        user: { name: order.buyer.email },
        action: `placed ${order.status.toLowerCase().replaceAll('_', ' ')} order`,
        target: order.orderNumber,
        timestamp: relativeTime(order.createdAt),
      })),
      ...recentSellers.map((seller) => ({
        id: `seller:${seller.id}`,
        user: { name: seller.storeName },
        action: `seller status is ${seller.kycStatus.toLowerCase()}`,
        timestamp: relativeTime(seller.updatedAt),
      })),
    ]
      .sort((a, b) => timestampRank(a.timestamp) - timestampRank(b.timestamp))
      .slice(0, 6)
      .map((item, index) => ({ ...item, isLatest: index === 0 }))

    return {
      success: true,
      data: {
        metrics: [
          {
            label: 'Revenue (30d)',
            value: currentOrders._sum.totalAmount ?? 0,
            previousValue: previousOrders._sum.totalAmount ?? 0,
            format: 'currency',
          },
          {
            label: 'Orders (30d)',
            value: currentOrders._count._all,
            previousValue: previousOrders._count._all,
            format: 'number',
          },
          {
            label: 'Active sellers',
            value: activeSellers,
            previousValue: previousActiveSellers,
            format: 'number',
          },
          {
            label: 'Catalog SKUs',
            value: catalogSkus,
            previousValue: previousCatalogSkus,
            format: 'number',
          },
        ],
        activities,
        notifications: pendingSellers.map((seller) => ({
          id: seller.id,
          title: 'New seller awaiting approval',
          message: `${seller.storeName} submitted KYC documents.`,
          timestamp: relativeTime(seller.createdAt),
          read: false,
          type: 'info',
        })),
      },
    }
  }
}

function daysAgo(now: Date, days: number): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
}

function relativeTime(date: Date): string {
  const minutes = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60_000))
  if (minutes < 60) return `${String(minutes)}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${String(hours)}h ago`
  return `${String(Math.floor(hours / 24))}d ago`
}

function timestampRank(label: string): number {
  const value = Number.parseInt(label, 10)
  if (label.endsWith('m ago')) return value
  if (label.endsWith('h ago')) return value * 60
  return value * 1_440
}
