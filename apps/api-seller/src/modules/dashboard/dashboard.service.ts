import { Injectable } from '@nestjs/common'
import { OrderStatus } from '@ecom/contracts'
import { AnalyticsService } from '../analytics/analytics.service'
import { InventoryService } from '../inventory/inventory.service'
import { NotificationService } from '../notification/notification.service'
import { OrderService } from '../order/order.service'
import { ReturnService } from '../return/return.service'

type BundleErrorKey = 'analytics' | 'inventory' | 'notifications' | 'orders' | 'returns'

type DashboardBundle = {
  overview: Awaited<ReturnType<AnalyticsService['getDashboardSummary']>>
  analytics: {
    revenue: Awaited<ReturnType<AnalyticsService['getRevenueAnalytics']>> | null
    orders: Awaited<ReturnType<AnalyticsService['getOrderAnalytics']>> | null
    products: Awaited<ReturnType<AnalyticsService['getProductPerformance']>>
  }
  inventory: {
    lowStock: Awaited<ReturnType<InventoryService['getLowStockAlerts']>>
  }
  notifications: {
    unreadCount: Awaited<ReturnType<NotificationService['getUnreadCount']>> | null
    items: Awaited<ReturnType<NotificationService['list']>>['items']
  }
  orders: {
    pending: Awaited<ReturnType<OrderService['list']>>['items']
  }
  returns: {
    stats: {
      total: number
      open: number
      approved: number
      refunded: number
      rejected: number
    } | null
  }
  partialErrors?: Partial<Record<BundleErrorKey, string>>
}

@Injectable()
export class DashboardService {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly inventoryService: InventoryService,
    private readonly notificationService: NotificationService,
    private readonly orderService: OrderService,
    private readonly returnService: ReturnService,
  ) {}

  async getBundle(shopId: string): Promise<DashboardBundle> {
    const now = new Date()
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const partialErrors: Partial<Record<BundleErrorKey, string>> = {}

    const overview = await this.analyticsService.getDashboardSummary(shopId)

    const [analytics, inventory, notifications, orders, returns] = await Promise.all([
      this.loadAnalyticsSection(shopId, startDate, now, partialErrors),
      this.loadInventorySection(shopId, partialErrors),
      this.loadNotificationsSection(shopId, partialErrors),
      this.loadOrdersSection(shopId, partialErrors),
      this.loadReturnsSection(shopId, partialErrors),
    ])

    return {
      overview,
      analytics,
      inventory,
      notifications,
      orders,
      returns,
      ...(Object.keys(partialErrors).length > 0 ? { partialErrors } : {}),
    }
  }

  private async loadAnalyticsSection(
    shopId: string,
    startDate: Date,
    endDate: Date,
    partialErrors: Partial<Record<BundleErrorKey, string>>,
  ) {
    try {
      const [revenue, orders, products] = await Promise.all([
        this.analyticsService.getRevenueAnalytics(shopId, startDate, endDate),
        this.analyticsService.getOrderAnalytics(shopId, startDate, endDate),
        this.analyticsService.getProductPerformance(shopId, startDate, endDate),
      ])

      return { revenue, orders, products }
    } catch (error) {
      partialErrors.analytics = this.getErrorMessage(error, 'Unable to load analytics')
      return {
        revenue: null,
        orders: null,
        products: [],
      }
    }
  }

  private async loadInventorySection(
    shopId: string,
    partialErrors: Partial<Record<BundleErrorKey, string>>,
  ) {
    try {
      return {
        lowStock: await this.inventoryService.getLowStockAlerts(shopId),
      }
    } catch (error) {
      partialErrors.inventory = this.getErrorMessage(error, 'Unable to load inventory')
      return { lowStock: [] }
    }
  }

  private async loadNotificationsSection(
    shopId: string,
    partialErrors: Partial<Record<BundleErrorKey, string>>,
  ) {
    try {
      const [unreadCount, notifications] = await Promise.all([
        this.notificationService.getUnreadCount(shopId),
        this.notificationService.list(shopId, { limit: 6, page: 1 }),
      ])

      return {
        unreadCount,
        items: notifications.items,
      }
    } catch (error) {
      partialErrors.notifications = this.getErrorMessage(error, 'Unable to load notifications')
      return {
        unreadCount: null,
        items: [],
      }
    }
  }

  private async loadOrdersSection(
    shopId: string,
    partialErrors: Partial<Record<BundleErrorKey, string>>,
  ) {
    try {
      const pendingOrders = await this.orderService.list(shopId, {
        limit: 5,
        page: 1,
        status: OrderStatus.PENDING,
      })

      return {
        pending: pendingOrders.items,
      }
    } catch (error) {
      partialErrors.orders = this.getErrorMessage(error, 'Unable to load pending orders')
      return { pending: [] }
    }
  }

  private async loadReturnsSection(
    shopId: string,
    partialErrors: Partial<Record<BundleErrorKey, string>>,
  ) {
    try {
      const stats = await this.returnService.getStats(shopId)

      return {
        stats: {
          total: stats.total,
          open: stats.pending,
          approved: stats.approved,
          refunded: stats.refunded,
          rejected: 0,
        },
      }
    } catch (error) {
      partialErrors.returns = this.getErrorMessage(error, 'Unable to load returns')
      return { stats: null }
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error && error.message.length > 0 ? error.message : fallback
  }
}
