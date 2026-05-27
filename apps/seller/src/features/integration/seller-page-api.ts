import { api } from '@/lib/api'
import type { ProductStatus } from '@ecom/contracts'
import type { SellerPaths } from '@ecom/contracts/generated'
import type { PaginationMeta } from '@ecom/shared/pagination/core'
import type {
  CreateCouponPayload,
  CreateProductPayload,
  SellerApproval,
  SellerBulkJob,
  SellerCategory,
  SellerChatConversation,
  SellerChatMessage,
  SellerConversionMetrics,
  SellerCoupon,
  SellerDashboardSummary,
  SellerInventoryItem,
  SellerLowStockItem,
  SellerMessageSendPayload,
  SellerMetricHistoryItem,
  SellerMetricsCurrent,
  SellerNotification,
  SellerNotificationUnreadCount,
  SellerOrderAnalytics,
  SellerOrderDetail,
  SellerOrderListItem,
  SellerProductListItem,
  SellerProductPerformanceItem,
  SellerReturn,
  SellerReturnStats,
  SellerRevenueAnalytics,
  SellerReview,
  SellerReviewAnalytics,
  SellerShippingMethod,
  SellerShippingProvider,
  SellerShop,
  SellerWallet,
  SellerWalletTransaction,
  SellerWalletWithdrawal,
  SellerWarehouse,
} from './seller-page-adapters'

interface ApiEnvelope<T> {
  data: T
  meta?: unknown
}

interface PaginatedData<T> {
  items: T[]
}

interface PaginatedEnvelope<T> {
  data: PaginatedData<T>
  meta?: unknown
}

type UpdateOrderStatusRequest =
  SellerPaths['/orders/{id}/status']['put']['requestBody']['content']['application/json']
type CreateWarehouseResponse =
  SellerPaths['/warehouses']['post']['responses']['201']['content']['application/json']
interface ResetPasswordRequest {
  token: string
  password: string
}

function getItems<T>(data: unknown): T[] {
  if (!data || typeof data !== 'object') return []

  const directItems = (data as { items?: unknown }).items
  if (Array.isArray(directItems)) return directItems as T[]

  const nestedData = (data as { data?: unknown }).data
  if (Array.isArray(nestedData)) return nestedData as T[]

  const nestedItems =
    nestedData && typeof nestedData === 'object'
      ? (nestedData as { items?: unknown }).items
      : undefined

  if (Array.isArray(nestedItems)) return nestedItems as T[]

  return []
}

function getPaginationNumber(
  meta: unknown,
  key: 'total' | 'limit' | 'totalPages',
): number | undefined {
  if (!meta || typeof meta !== 'object') return undefined

  const directValue = (meta as Record<string, unknown>)[key]
  if (typeof directValue === 'number') return directValue

  const pagination = (meta as { pagination?: unknown }).pagination
  if (!pagination || typeof pagination !== 'object') return undefined

  const nestedValue = (pagination as Record<string, unknown>)[key]
  return typeof nestedValue === 'number' ? nestedValue : undefined
}

function getPaginationBoolean(
  meta: unknown,
  key: 'hasNextPage' | 'hasPreviousPage',
): boolean | undefined {
  if (!meta || typeof meta !== 'object') return undefined

  const directValue = (meta as Record<string, unknown>)[key]
  if (typeof directValue === 'boolean') return directValue

  const pagination = (meta as { pagination?: unknown }).pagination
  if (!pagination || typeof pagination !== 'object') return undefined

  const nestedValue = (pagination as Record<string, unknown>)[key]
  return typeof nestedValue === 'boolean' ? nestedValue : undefined
}

function buildPaginationMeta(
  meta: unknown,
  page: number,
  limit: number,
): PaginationMeta | undefined {
  const total = getPaginationNumber(meta, 'total')
  const totalPages = getPaginationNumber(meta, 'totalPages')
  const resolvedLimit = getPaginationNumber(meta, 'limit') ?? limit

  if (total === undefined && totalPages === undefined) {
    return undefined
  }

  return {
    total: total ?? 0,
    page,
    limit: resolvedLimit,
    totalPages: totalPages ?? 1,
    hasNextPage: getPaginationBoolean(meta, 'hasNextPage') ?? false,
    hasPreviousPage: getPaginationBoolean(meta, 'hasPreviousPage') ?? page > 1,
  }
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
    api<PaginatedEnvelope<SellerNotification>>('/notifications', { params: { limit: 6 } }),
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
  const response = await api<PaginatedEnvelope<SellerCoupon>>('/coupons', {
    params: { limit: 50 },
  })

  return response.data.items
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

export async function getApprovals(limit: number = 50) {
  const response = await api<ApiEnvelope<SellerApproval[]>>('/approvals', { params: { limit } })
  return response.data
}

export async function resubmitApproval(approvalId: string) {
  await api(`/approvals/${approvalId}/resubmit`, { method: 'POST' })
}

export async function getBulkJobs(limit: number = 50) {
  const response = await api<ApiEnvelope<SellerBulkJob[]>>('/bulk/jobs', { params: { limit } })
  return response.data
}

export async function createBulkExport(fileName: string) {
  await api('/bulk/export', {
    method: 'POST',
    body: JSON.stringify({ fileName }),
  })
}

export async function createBulkImport(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  await api('/bulk/import', { method: 'POST', body: formData })
}

export async function getNotifications(params: { page?: number; limit?: number } = {}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 50
  const response = await api<ApiEnvelope<SellerNotification[]>>('/notifications', {
    params: { page, limit },
  })

  return response.data
}

export async function markNotificationRead(notificationId: string) {
  await api(`/notifications/${notificationId}/read`, { method: 'POST' })
}

export async function markAllNotificationsRead() {
  await api('/notifications/read-all', { method: 'POST' })
}

export async function getWarehouses() {
  const response = await api<ApiEnvelope<SellerWarehouse[]>>('/warehouses')
  return response.data
}

export async function createWarehouse(values: object) {
  return api<CreateWarehouseResponse>('/warehouses', {
    method: 'POST',
    body: JSON.stringify(values),
  })
}

export async function getProductsList(
  params: {
    limit?: number
    page?: number
    search?: string
    status?: string
  } = {},
) {
  const page = params.page ?? 1
  const limit = params.limit ?? 100
  const response = await api<ApiEnvelope<unknown>>('/products', {
    params: {
      page,
      limit,
      ...(params.search ? { search: params.search } : {}),
      ...(params.status ? { status: params.status } : {}),
    },
  })

  return {
    items: getItems<SellerProductListItem>(response.data),
    meta: buildPaginationMeta(response.meta, page, limit),
  }
}

export async function getOrdersList(
  params: {
    page?: number
    limit?: number
    search?: string
    status?: string
  } = {},
) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const response = await api<ApiEnvelope<unknown>>('/orders', {
    params: {
      page,
      limit,
      ...(params.search ? { search: params.search } : {}),
      ...(params.status ? { status: params.status } : {}),
    },
  })

  return {
    items: getItems<SellerOrderListItem>(response.data),
    meta: buildPaginationMeta(response.meta, page, limit),
  }
}

export async function getOrderDetail(orderId: string) {
  const response = await api<ApiEnvelope<SellerOrderDetail> | { data?: SellerOrderDetail }>(
    `/orders/${orderId}`,
  )

  if ('data' in response && response.data) {
    return response.data
  }

  return null
}

export async function updateOrderStatus(orderId: string, payload: UpdateOrderStatusRequest) {
  await api(`/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function getInventory(limit: number = 100) {
  const response = await api<ApiEnvelope<unknown>>('/inventory', {
    params: { limit },
  })

  return getItems<SellerInventoryItem>(response.data)
}

export async function getReviewsBundle(limit: number = 100) {
  const [reviewsResponse, analyticsResponse] = await Promise.all([
    api<ApiEnvelope<SellerReview[]>>('/reviews', { params: { limit } }),
    api<SellerReviewAnalytics>('/reviews/analytics'),
  ])

  return {
    reviews: reviewsResponse.data,
    analytics: analyticsResponse,
  }
}

export async function replyToReview(reviewId: string, message: string) {
  await api(`/reviews/${reviewId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  })
}

export async function getReturns(limit: number = 100) {
  const response = await api<ApiEnvelope<SellerReturn[]>>('/returns', {
    params: { page: 1, limit },
  })

  return response.data
}

export async function updateReturnStatus(returnId: string, status: string) {
  await api(`/returns/${returnId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

export async function getShippingBundle() {
  const [providersResponse, methodsResponse] = await Promise.all([
    api<ApiEnvelope<SellerShippingProvider[]>>('/shipping/providers'),
    api<ApiEnvelope<SellerShippingMethod[]>>('/shipping/methods'),
  ])

  return {
    providers: providersResponse.data,
    methods: methodsResponse.data,
  }
}

export async function toggleShippingMethod(providerId: string, enabled: boolean) {
  const response = await api<ApiEnvelope<SellerShippingMethod>>(
    `/shipping/methods/${providerId}/toggle`,
    {
      method: 'POST',
      body: JSON.stringify({ isEnabled: enabled }),
    },
  )

  return response.data
}

export async function getMessageConversations(search: string = '') {
  const response = await api<ApiEnvelope<SellerChatConversation[]>>('/chat/conversations', {
    params: { ...(search ? { search } : {}) },
  })

  return response.data
}

export async function getConversationMessages(conversationId: string) {
  const response = await api<ApiEnvelope<SellerChatMessage[]>>(
    `/chat/conversations/${conversationId}/messages`,
  )

  return response.data
}

export async function markConversationRead(conversationId: string) {
  await api(`/chat/conversations/${conversationId}/read`, { method: 'POST' })
}

export async function sendConversationMessage(
  conversationId: string,
  payload: SellerMessageSendPayload,
) {
  await api(`/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function resetPassword(payload: ResetPasswordRequest) {
  await api('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
