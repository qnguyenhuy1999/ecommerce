import type {
  SellerDashboardSummary,
  SellerLowStockItem,
  SellerNotificationListItem,
  SellerNotificationUnreadCount,
  SellerOrderAnalytics,
  SellerOrderListItem,
  SellerProductPerformanceItem,
  SellerReturnStats,
  SellerRevenueAnalytics,
} from '../integration/seller-page-adapters'

export interface SellerDashboardBundle {
  overview: SellerDashboardSummary
  analytics: {
    revenue: SellerRevenueAnalytics | null
    orders: SellerOrderAnalytics | null
    products: SellerProductPerformanceItem[]
  }
  inventory: {
    lowStock: SellerLowStockItem[]
  }
  notifications: {
    unreadCount: SellerNotificationUnreadCount | null
    items: SellerNotificationListItem[]
  }
  orders: {
    pending: SellerOrderListItem[]
  }
  returns: {
    stats: SellerReturnStats | null
  }
  partialErrors?: Partial<
    Record<'analytics' | 'inventory' | 'notifications' | 'orders' | 'returns', string>
  >
}

export interface SellerDashboardViewModel {
  summary: SellerDashboardSummary
  revenue: SellerRevenueAnalytics
  orders: SellerOrderAnalytics
  products: SellerProductPerformanceItem[]
  lowStock: SellerLowStockItem[]
  unreadCount: SellerNotificationUnreadCount
  notifications: SellerNotificationListItem[]
  pendingOrders: SellerOrderListItem[]
  returnStats: SellerReturnStats
  partialErrors?: SellerDashboardBundle['partialErrors']
}

const EMPTY_REVENUE: SellerRevenueAnalytics = {
  totalRevenue: 0,
  orderCount: 0,
  averageOrderValue: 0,
  dailyRevenue: [],
}

const EMPTY_ORDERS: SellerOrderAnalytics = {
  total: 0,
  byStatus: [],
}

const EMPTY_UNREAD_COUNT: SellerNotificationUnreadCount = {
  count: 0,
}

const EMPTY_RETURN_STATS: SellerReturnStats = {
  total: 0,
  open: 0,
  approved: 0,
  refunded: 0,
  rejected: 0,
}

export function normalizeDashboardBundle(bundle: SellerDashboardBundle): SellerDashboardViewModel {
  return {
    summary: bundle.overview,
    revenue: bundle.analytics.revenue ?? EMPTY_REVENUE,
    orders: bundle.analytics.orders ?? EMPTY_ORDERS,
    products: bundle.analytics.products,
    lowStock: bundle.inventory.lowStock,
    unreadCount: bundle.notifications.unreadCount ?? EMPTY_UNREAD_COUNT,
    notifications: bundle.notifications.items,
    pendingOrders: bundle.orders.pending,
    returnStats: bundle.returns.stats ?? EMPTY_RETURN_STATS,
    partialErrors: bundle.partialErrors,
  }
}
