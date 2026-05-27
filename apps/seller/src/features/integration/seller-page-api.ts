import { api } from '@/lib/api'
import type { ProductStatus } from '@ecom/contracts'
import type {
  CreateCouponPayload,
  CreateProductPayload,
  SellerCategory,
  SellerConversionMetrics,
  SellerCoupon,
  SellerDashboardSummary,
  SellerLowStockItem,
  SellerMetricHistoryItem,
  SellerMetricsCurrent,
  SellerNotificationListItem,
  SellerNotificationUnreadCount,
  SellerOrderAnalytics,
  SellerOrderListItem,
  SellerProductPerformanceItem,
  SellerReturnStats,
  SellerRevenueAnalytics,
  SellerShop,
  SellerWallet,
  SellerWalletTransaction,
  SellerWalletWithdrawal,
} from './seller-page-adapters'

interface ApiEnvelope<T> {
  data: T
}

interface PaginatedData<T> {
  items: T[]
}

interface PaginatedEnvelope<T> {
  data: PaginatedData<T>
}

export async function getDashboardBundle() {
  const [
    summary,
    revenue,
    orders,
    products,
    lowStock,
    unreadCount,
    notifications,
    pendingOrders,
    returnStats,
  ] = await Promise.all([
    api<ApiEnvelope<SellerDashboardSummary>>('/analytics/dashboard'),
    api<ApiEnvelope<SellerRevenueAnalytics>>('/analytics/revenue'),
    api<ApiEnvelope<SellerOrderAnalytics>>('/analytics/orders'),
    api<ApiEnvelope<SellerProductPerformanceItem[]>>('/analytics/products'),
    api<ApiEnvelope<SellerLowStockItem[]>>('/inventory/low-stock'),
    api<ApiEnvelope<SellerNotificationUnreadCount>>('/notifications/unread-count'),
    api<PaginatedEnvelope<SellerNotificationListItem>>('/notifications', { params: { limit: 6 } }),
    api<PaginatedEnvelope<SellerOrderListItem>>('/orders', {
      params: { limit: 5, status: 'PENDING' },
    }),
    api<ApiEnvelope<SellerReturnStats>>('/returns/stats'),
  ])

  return {
    summary: summary.data,
    revenue: revenue.data,
    orders: orders.data,
    products: products.data,
    lowStock: lowStock.data,
    unreadCount: unreadCount.data,
    notifications: notifications.data.items,
    pendingOrders: pendingOrders.data.items,
    returnStats: returnStats.data,
  }
}

export async function getAnalyticsBundle(rangeParams: { startDate: string; endDate: string }) {
  const [revenue, orders, products, conversion] = await Promise.all([
    api<ApiEnvelope<SellerRevenueAnalytics>>('/analytics/revenue', { params: rangeParams }),
    api<ApiEnvelope<SellerOrderAnalytics>>('/analytics/orders', { params: rangeParams }),
    api<ApiEnvelope<SellerProductPerformanceItem[]>>('/analytics/products', {
      params: rangeParams,
    }),
    api<ApiEnvelope<SellerConversionMetrics>>('/analytics/conversion', { params: rangeParams }),
  ])

  return {
    revenue: revenue.data,
    orders: orders.data,
    products: products.data,
    conversion: conversion.data,
  }
}

export async function getFinanceBundle() {
  const [wallet, transactions, withdrawals] = await Promise.all([
    api<ApiEnvelope<SellerWallet>>('/wallet'),
    api<PaginatedEnvelope<SellerWalletTransaction>>('/wallet/transactions', {
      params: { limit: 20 },
    }),
    api<PaginatedEnvelope<SellerWalletWithdrawal>>('/wallet/withdrawals', {
      params: { limit: 20 },
    }),
  ])

  return {
    wallet: wallet.data,
    transactions: transactions.data.items,
    withdrawals: withdrawals.data.items,
  }
}

export async function getMetricsBundle() {
  const [current, history] = await Promise.all([
    api<ApiEnvelope<SellerMetricsCurrent>>('/metrics'),
    api<ApiEnvelope<SellerMetricHistoryItem[]>>('/metrics/history', { params: { days: 30 } }),
  ])

  return {
    current: current.data,
    history: history.data,
  }
}

export async function getShopProfile() {
  const response = await api<ApiEnvelope<SellerShop>>('/shop')
  return response.data
}

export async function updateShopProfile(payload: Record<string, string | undefined>) {
  return api<ApiEnvelope<SellerShop>>('/shop', {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function getVouchersBundle() {
  const [coupons] = await Promise.all([
    api<PaginatedEnvelope<SellerCoupon>>('/coupons', { params: { limit: 50 } }),
  ])

  return coupons.data.items
}

export async function createVoucher(payload: CreateCouponPayload) {
  return api('/coupons', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getProductCategories() {
  const response = await api<ApiEnvelope<SellerCategory[]>>('/products/categories')
  return response.data
}

export async function createProduct(payload: CreateProductPayload, status: ProductStatus) {
  return api('/products', {
    method: 'POST',
    body: JSON.stringify({ ...payload, status }),
  })
}
