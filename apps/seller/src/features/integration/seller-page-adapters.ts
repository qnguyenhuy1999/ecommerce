import type { ProductStatus } from '@ecom/contracts'
import {
  formatCompactCurrency as sharedFormatCompactCurrency,
  formatCurrency as sharedFormatCurrency,
  formatDateIntl,
  formatDateTime as sharedFormatDateTime,
  formatPercent as sharedFormatPercent,
} from '@ecom/shared'
import type {
  ApprovalRow,
  AnalyticsDateRangeOption,
  AnalyticsProps,
  BulkJobRow,
  DashboardProps,
  FinanceBalanceMetric,
  FinanceEntryKind,
  FinanceProps,
  FinanceTab,
  InventoryRow,
  MessageConversation,
  MessageEntry,
  NotificationRow,
  OrderDetailRecord,
  OrderDetailStatus,
  OrderRow,
  OrdersStatusTab,
  ProductDetailFormData,
  ProductRow,
  ReviewAnalytics,
  ReviewRow,
  ReturnRow,
  ShippingProviderRow,
  ShopProfileFormData,
  WarehouseRow,
  VoucherDetailFormData,
  VoucherRow,
} from '@ecom/ui-seller'

export interface SellerDashboardSummary {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  pendingOrders: number
  activeProducts: number
  lowStockCount: number
}

export interface SellerRevenueAnalytics {
  totalRevenue: number
  orderCount: number
  averageOrderValue: number
  dailyRevenue: Array<{ date: string; revenue: number }>
}

export interface SellerOrderAnalytics {
  total: number
  byStatus: Array<{ status: string; count: number }>
}

export interface SellerProductPerformanceItem {
  variantId: string
  unitsSold: number
  revenue: number
  orders: number
  productName?: string
  imageUrl?: string
}

export interface SellerConversionMetrics {
  totalOrders: number
  deliveredOrders: number
  cancelledOrders: number
  fulfillmentRate: number
  cancellationRate: number
}

export interface SellerLowStockItem {
  variantId: string
  productId: string
  productName: string
  sku: string | null
  stock: number
  reservedStock: number
}

export interface SellerNotificationListItem {
  id: string
  title: string
  message: string
  createdAt: string
  isRead?: boolean
}

export interface SellerNotificationUnreadCount {
  count: number
}

export interface SellerReturnStats {
  total: number
  open: number
  approved: number
  refunded: number
  rejected: number
}

export interface SellerOrderListItem {
  id: string
  status: string
  totalAmount?: number | string
  subtotal?: number | string
  createdAt: string
  order?: {
    id?: string
    shippingName?: string | null
  }
  items?: Array<{
    id: string
    productName?: string
    variantLabel?: string | null
    product?: { name?: string | null; images?: Array<{ url: string }> }
  }>
  _count?: {
    items: number
  }
}

export interface SellerWallet {
  balance: number | string
  pendingBalance: number | string
  createdAt?: string
}

export interface SellerWalletTransaction {
  id: string
  type: string
  amount: number | string
  referenceId?: string | null
  description?: string | null
  createdAt: string
}

export interface SellerWalletWithdrawal {
  id: string
  amount: number | string
  status?: string | null
  bankName?: string | null
  createdAt: string
}

export interface SellerMetricsCurrent {
  period: {
    start: string
    end: string
  }
  cancellationRate: number
  lateShipmentRate: number
  responseRate: number
  refundRate: number
  sellerScore: number
  totalOrders: number
  totalReturns: number
}

export interface SellerMetricHistoryItem {
  date: string
  cancellationRate?: number
  lateShipmentRate?: number
  responseRate?: number
  refundRate?: number
  sellerScore?: number
  totalOrders?: number
}

export interface SellerShop {
  name: string
  slug: string
  description?: string | null
  logo?: string | null
  banner?: string | null
  phone?: string | null
  email?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
}

export interface SellerCoupon {
  id: string
  code: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'
  discountValue: number | string
  minOrderAmount?: number | string | null
  usedCount?: number
  usageLimit?: number | null
  startsAt: string
  expiresAt: string
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
}

export interface SellerCategory {
  id: string
  name: string
  children?: SellerCategory[]
}

export interface CreateCouponPayload {
  code: string
  name: string
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING'
  scope: 'ALL_PRODUCTS'
  discountValue: number
  minOrderAmount?: number
  usageLimit?: number
  usageLimitPerUser?: number
  startsAt: string
  expiresAt: string
}

export interface CreateProductPayload {
  name: string
  description?: string
  categoryId?: string
  basePrice?: number
  baseSku?: string
  baseStock?: number
  weight?: number
  hasVariants: boolean
  variantOptionGroups?: Array<{
    name: string
    options: Array<{ value: string }>
  }>
  variants?: Array<{
    sku?: string
    price: number
    stock: number
    optionValues: string[]
  }>
  images?: Array<{ url: string; alt?: string; isCover?: boolean }>
  status: ProductStatus
}

const ANALYTICS_DATE_RANGE_OPTIONS: AnalyticsDateRangeOption[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PACKING: 'Packing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

const FINANCE_TABS: FinanceTab[] = ['TRANSACTIONS', 'PAYOUTS', 'FEES_AND_TAXES', 'BANK']

function formatCurrency(value: number) {
  return sharedFormatCurrency(value, {
    maximumFractionDigits: value >= 1000 ? 0 : 2,
    minimumFractionDigits: 0,
  })
}

function formatShortCurrency(value: number) {
  return sharedFormatCompactCurrency(value)
}

function formatPercent(value: number, digits: number = 1) {
  return sharedFormatPercent(value, digits)
}

function formatDateLabel(value: string) {
  return formatDateIntl(value, { month: 'short', day: 'numeric', year: 'numeric' }, 'en-US')
}

function formatDateTime(value: string) {
  return sharedFormatDateTime(value, { dateStyle: 'medium', timeStyle: 'short' }, 'en-US')
}

function asNumber(value: number | string | null | undefined) {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') return Number(value)
  return 0
}

function normalizeVoucherType(type: SellerCoupon['type']): 'AMOUNT' | 'PERCENT' | 'FREESHIP' {
  switch (type) {
    case 'FIXED_AMOUNT':
      return 'AMOUNT'
    case 'FREE_SHIPPING':
      return 'FREESHIP'
    default:
      return 'PERCENT'
  }
}

function normalizeVoucherStatus(status: SellerCoupon['status']): VoucherRow['status'] {
  return status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
}

function buildSpark(values: number[]) {
  const source = values.length > 0 ? values : [0]
  return source.map((value, index) => ({ x: index + 1, y: value }))
}

export function getRangeDays(range: string) {
  if (range === '7d') return 7
  if (range === '90d') return 90
  return 30
}

export function buildDateRangeParams(range: string, now: Date = new Date()) {
  const days = getRangeDays(range)
  const endDate = new Date(now)
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - days)

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  }
}

export function buildDashboardProps(input: {
  summary: SellerDashboardSummary
  revenue: SellerRevenueAnalytics
  orders: SellerOrderAnalytics
  topProducts: SellerProductPerformanceItem[]
  lowStockItems: SellerLowStockItem[]
  unreadCount: SellerNotificationUnreadCount
  notifications: SellerNotificationListItem[]
  pendingOrders: SellerOrderListItem[]
  returnStats?: SellerReturnStats
}): DashboardProps {
  const {
    summary,
    revenue,
    orders,
    topProducts,
    lowStockItems,
    unreadCount,
    notifications,
    pendingOrders,
    returnStats,
  } = input

  const recentRevenue = revenue.dailyRevenue.map((point) => point.revenue)
  const orderCounts = orders.byStatus.map((item) => item.count)

  return {
    snapshotLabel: `Snapshot for ${formatDateLabel(new Date().toISOString())}`,
    ordersHref: '/orders',
    metrics: [
      {
        label: 'Revenue (30D)',
        value: formatCurrency(summary.revenue.current),
        trend: summary.revenue.growth,
        accent: summary.revenue.growth >= 0 ? 'success' : 'destructive',
        spark: buildSpark(recentRevenue),
      },
      {
        label: 'Pending Orders',
        value: String(summary.pendingOrders),
        trend: orders.total > 0 ? (summary.pendingOrders / orders.total) * 100 : 0,
        accent: 'warning',
        spark: buildSpark(orderCounts),
      },
      {
        label: 'Active Products',
        value: String(summary.activeProducts),
        accent: 'info',
        spark: buildSpark([summary.activeProducts]),
      },
      {
        label: 'Unread Alerts',
        value: String(unreadCount.count),
        accent: unreadCount.count > 0 ? 'warning' : 'success',
        spark: buildSpark([unreadCount.count]),
      },
    ],
    revenueSeries: revenue.dailyRevenue.map((point) => ({
      label: formatDateLabel(point.date),
      revenue: point.revenue,
    })),
    todos: [
      { label: 'Ship today', count: summary.pendingOrders, tone: 'warning' },
      { label: 'Low stock', count: summary.lowStockCount, tone: 'destructive' },
      { label: 'Unread alerts', count: unreadCount.count, tone: 'info' },
      {
        label: 'Returns',
        count: returnStats?.open ?? 0,
        tone: (returnStats?.open ?? 0) > 0 ? 'default' : 'info',
      },
    ],
    pendingOrders: pendingOrders.slice(0, 5).map((order) => ({
      id: order.order?.id ?? order.id,
      customer: order.order?.shippingName ?? 'Unknown buyer',
      amount: formatCurrency(asNumber(order.totalAmount ?? order.subtotal)),
      status:
        order.status === 'CANCELLED'
          ? 'cancelled'
          : order.status === 'PENDING'
            ? 'review'
            : 'shipping',
      imageUrl: order.items?.[0]?.product?.images?.[0]?.url ?? 'https://placehold.co/96x96',
    })),
    lowStockItems: lowStockItems.slice(0, 5).map((item) => ({
      name: item.productName,
      sku: item.sku ?? 'No SKU',
      remaining: item.stock - item.reservedStock,
      imageUrl: 'https://placehold.co/96x96',
    })),
    promotions: [
      {
        name: 'Coupon coverage',
        redeemed: notifications.length,
        total: Math.max(notifications.length, 1),
        status: 'Live',
      },
    ],
    topProducts: topProducts.slice(0, 5).map((item, index) => ({
      rank: index + 1,
      name: item.productName ?? `Variant ${item.variantId}`,
      sold: item.unitsSold,
      revenue: formatShortCurrency(item.revenue),
      imageUrl: item.imageUrl ?? 'https://placehold.co/96x96',
    })),
    recentActivity: notifications.slice(0, 6).map((notification) => ({
      title: notification.title,
      detail: notification.message,
      time: sharedFormatDateTime(
        notification.createdAt,
        { hour: '2-digit', minute: '2-digit' },
        'en-US',
      ),
    })),
  }
}

export function buildAnalyticsProps(input: {
  range: string
  revenue: SellerRevenueAnalytics
  orders: SellerOrderAnalytics
  topProducts: SellerProductPerformanceItem[]
  conversion: SellerConversionMetrics
}): AnalyticsProps {
  const { range, revenue, orders, topProducts, conversion } = input
  const ordersByDay = revenue.dailyRevenue.map((point) => ({
    label: formatDateIntl(point.date, { weekday: 'short' }, 'en-US'),
    orders: Math.max(1, Math.round(revenue.orderCount / Math.max(revenue.dailyRevenue.length, 1))),
  }))
  const topProductRevenue = topProducts.map((item) => item.revenue)
  const totalTopProductRevenue = topProductRevenue.reduce((sum, value) => sum + value, 0)

  return {
    title: 'Analytics',
    description: 'Performance and growth signals',
    dateRange: range,
    dateRangeOptions: ANALYTICS_DATE_RANGE_OPTIONS,
    exportHref: '/analytics',
    metrics: [
      {
        label: `Revenue (${range.toUpperCase()})`,
        value: formatCurrency(revenue.totalRevenue),
        trend: conversion.fulfillmentRate - conversion.cancellationRate,
        accent: 'success',
        spark: buildSpark(revenue.dailyRevenue.map((point) => point.revenue)),
      },
      {
        label: `Orders (${range.toUpperCase()})`,
        value: String(revenue.orderCount),
        trend: conversion.fulfillmentRate,
        accent: 'info',
        spark: buildSpark(orders.byStatus.map((item) => item.count)),
      },
      {
        label: 'Fulfillment',
        value: formatPercent(conversion.fulfillmentRate),
        trend: conversion.fulfillmentRate - conversion.cancellationRate,
        accent: 'success',
        spark: buildSpark([
          conversion.totalOrders,
          conversion.deliveredOrders,
          conversion.cancelledOrders,
        ]),
      },
      {
        label: 'AOV',
        value: formatCurrency(revenue.averageOrderValue),
        trend: revenue.averageOrderValue > 0 ? 1 : 0,
        accent: 'warning',
        spark: buildSpark(
          revenue.dailyRevenue.map((point) => point.revenue / Math.max(revenue.orderCount, 1)),
        ),
      },
    ],
    revenueSeries: revenue.dailyRevenue.map((point) => ({
      label: formatDateLabel(point.date),
      revenue: point.revenue,
    })),
    trafficSources: orders.byStatus.map((item, index) => ({
      label: STATUS_LABELS[item.status] ?? item.status,
      value: orders.total > 0 ? Math.round((item.count / orders.total) * 100) : 0,
      color: ['#f97316', '#16a34a', '#0284c7', '#eab308', '#ef4444'][index % 5] ?? '#6b7280',
    })),
    ordersByDaySeries: ordersByDay,
    conversionFunnel: [
      {
        label: 'Orders',
        value: 100,
        conversionLabel: `${conversion.totalOrders} · 100.0%`,
        color: '#ea580c',
      },
      {
        label: 'Delivered',
        value: conversion.fulfillmentRate,
        conversionLabel: `${conversion.deliveredOrders} · ${formatPercent(conversion.fulfillmentRate)}`,
        color: '#f97316',
      },
      {
        label: 'Cancelled',
        value: conversion.cancellationRate,
        conversionLabel: `${conversion.cancelledOrders} · ${formatPercent(conversion.cancellationRate)}`,
        color: '#fb923c',
      },
    ],
    topProducts: topProducts.slice(0, 6).map((item, index) => ({
      id: item.variantId,
      rank: index + 1,
      name: item.productName ?? `Variant ${item.variantId}`,
      imageUrl: item.imageUrl ?? 'https://placehold.co/96x96',
      units: item.unitsSold,
      revenue: formatCurrency(item.revenue),
      conversion:
        totalTopProductRevenue > 0
          ? formatPercent((item.revenue / totalTopProductRevenue) * 100)
          : '0.0%',
    })),
  }
}

function mapTransactionKind(type: string): FinanceEntryKind {
  if (type.includes('WITHDRAWAL')) return 'PAYOUT'
  if (type.includes('FEE')) return 'FEE'
  if (type.includes('REFUND')) return 'REFUND'
  if (type.includes('TRANSFER') || type.includes('DEPOSIT')) return 'BANK_TRANSFER'
  return 'SALE'
}

function mapTransactionTab(type: string): FinanceTab {
  if (type.includes('WITHDRAWAL')) return 'PAYOUTS'
  if (type.includes('FEE') || type.includes('COMMISSION')) return 'FEES_AND_TAXES'
  if (type.includes('TRANSFER') || type.includes('DEPOSIT')) return 'BANK'
  return 'TRANSACTIONS'
}

export function buildFinanceProps(input: {
  wallet: SellerWallet
  transactions: SellerWalletTransaction[]
  withdrawals: SellerWalletWithdrawal[]
}): FinanceProps {
  const available = asNumber(input.wallet.balance)
  const pending = asNumber(input.wallet.pendingBalance)
  const balanceMetrics: FinanceBalanceMetric[] = [
    { label: 'Available', amount: available, tone: 'success' },
    { label: 'Pending', amount: pending, tone: 'info' },
    { label: 'On hold', amount: Math.max(0, input.withdrawals.length), tone: 'warning' },
  ]

  const withdrawalRows = input.withdrawals.map((withdrawal) => ({
    id: `withdrawal-${withdrawal.id}`,
    dateLabel: formatDateLabel(withdrawal.createdAt),
    kind: 'PAYOUT' as const,
    reference: withdrawal.bankName ?? withdrawal.id,
    amount: -Math.abs(asNumber(withdrawal.amount)),
    tab: 'PAYOUTS' as const,
  }))

  return {
    title: 'Finance & wallet',
    description: 'Payouts, fees and ledger',
    walletBalanceLabel: 'Wallet balance',
    walletBalance: available,
    balanceMetrics,
    withdrawHref: '/finance',
    statementHref: '/finance',
    tabs: FINANCE_TABS,
    defaultTab: 'TRANSACTIONS',
    entries: [
      ...input.transactions.map((transaction) => ({
        id: transaction.id,
        dateLabel: formatDateLabel(transaction.createdAt),
        kind: mapTransactionKind(transaction.type),
        reference: transaction.referenceId ?? transaction.description ?? transaction.type,
        amount: asNumber(transaction.amount),
        tab: mapTransactionTab(transaction.type),
      })),
      ...withdrawalRows,
    ],
    emptyMessage: 'No ledger entries yet.',
  }
}

export function buildMetricsAnalyticsProps(input: {
  current: SellerMetricsCurrent
  history: SellerMetricHistoryItem[]
}): AnalyticsProps {
  const { current, history } = input

  return {
    title: 'Seller Metrics',
    description: 'Operational health and service quality',
    metrics: [
      {
        label: 'Seller Score',
        value: current.sellerScore.toFixed(1),
        trend: current.sellerScore - 80,
        accent: current.sellerScore >= 90 ? 'success' : 'warning',
        spark: buildSpark(history.map((item) => item.sellerScore ?? 0)),
      },
      {
        label: 'Response Rate',
        value: formatPercent(current.responseRate),
        trend: current.responseRate - 90,
        accent: current.responseRate >= 90 ? 'success' : 'warning',
        spark: buildSpark(history.map((item) => item.responseRate ?? 0)),
      },
      {
        label: 'Late Shipment',
        value: formatPercent(current.lateShipmentRate),
        trend: -current.lateShipmentRate,
        accent: current.lateShipmentRate <= 5 ? 'success' : 'destructive',
        spark: buildSpark(history.map((item) => item.lateShipmentRate ?? 0)),
      },
      {
        label: 'Refund Rate',
        value: formatPercent(current.refundRate),
        trend: -current.refundRate,
        accent: current.refundRate <= 3 ? 'success' : 'destructive',
        spark: buildSpark(history.map((item) => item.refundRate ?? 0)),
      },
    ],
    revenueSeries: history.map((item) => ({
      label: formatDateLabel(item.date),
      revenue: item.sellerScore ?? 0,
    })),
    trafficSources: [
      { label: 'Cancellation', value: current.cancellationRate, color: '#ef4444' },
      { label: 'Late Shipment', value: current.lateShipmentRate, color: '#eab308' },
      { label: 'Response', value: current.responseRate, color: '#16a34a' },
      { label: 'Refund', value: current.refundRate, color: '#0284c7' },
    ],
    ordersByDaySeries: history.map((item) => ({
      label: formatDateIntl(item.date, { weekday: 'short' }, 'en-US'),
      orders: item.totalOrders ?? 0,
    })),
    conversionFunnel: [
      {
        label: 'Orders',
        value: 100,
        conversionLabel: `${current.totalOrders} total`,
        color: '#ea580c',
      },
      {
        label: 'Responses',
        value: current.responseRate,
        conversionLabel: formatPercent(current.responseRate),
        color: '#f97316',
      },
      {
        label: 'Refunds',
        value: current.refundRate,
        conversionLabel: formatPercent(current.refundRate),
        color: '#fb923c',
      },
    ],
    topProducts: [],
  }
}

export function mapShopToProfileForm(shop: SellerShop): ShopProfileFormData {
  const previewHost = shop.slug ? `halomarket.co/shop/${shop.slug}` : 'halomarket.co/shop'

  return {
    shopName: shop.name,
    slug: shop.slug,
    tagline: shop.description?.split('.').at(0)?.trim() ?? '',
    about: shop.description ?? '',
    logoUrl: shop.logo ?? '',
    bannerUrl: shop.banner ?? '',
    supportEmail: shop.email ?? '',
    supportPhone: shop.phone ?? '',
    country: shop.country ?? 'VN',
    responseTarget: 'within 24 hours',
    followersLabel: 'Live buyer metrics coming soon',
    ratingLabel: 'Live rating coming soon',
    previewUrl: previewHost,
  }
}

export function mapProfileFormToUpdateShopPayload(form: ShopProfileFormData) {
  return {
    name: form.shopName,
    description: [form.tagline, form.about].filter(Boolean).join('\n\n').trim(),
    logo: form.logoUrl || undefined,
    banner: form.bannerUrl || undefined,
    email: form.supportEmail || undefined,
    phone: form.supportPhone || undefined,
    country: form.country || undefined,
  }
}

export function mapCouponsToVoucherRows(coupons: SellerCoupon[]): VoucherRow[] {
  return coupons.map((coupon) => ({
    id: coupon.id,
    code: coupon.code,
    type: normalizeVoucherType(coupon.type),
    valueLabel:
      coupon.type === 'FREE_SHIPPING'
        ? 'Free ship'
        : coupon.type === 'PERCENTAGE'
          ? `${asNumber(coupon.discountValue)}%`
          : formatCurrency(asNumber(coupon.discountValue)),
    minSpend: asNumber(coupon.minOrderAmount),
    used: coupon.usedCount ?? 0,
    quota: coupon.usageLimit ?? 0,
    startsAtLabel: formatDateLabel(coupon.startsAt),
    endsAtLabel: formatDateLabel(coupon.expiresAt),
    status: normalizeVoucherStatus(coupon.status),
  }))
}

function toIsoDateTime(value: string) {
  return value.includes('T') ? new Date(value).toISOString() : new Date(`${value}:00`).toISOString()
}

export function mapVoucherFormToCreateCouponPayload(
  form: VoucherDetailFormData,
): CreateCouponPayload {
  const discountValue = form.type === 'FREESHIP' ? 0 : Number(form.value || 0)

  return {
    code: form.code.trim().toUpperCase(),
    name: form.code.trim().toUpperCase(),
    type:
      form.type === 'AMOUNT'
        ? 'FIXED_AMOUNT'
        : form.type === 'FREESHIP'
          ? 'FREE_SHIPPING'
          : 'PERCENTAGE',
    scope: 'ALL_PRODUCTS',
    discountValue,
    ...(form.minSpend.trim() ? { minOrderAmount: Number(form.minSpend) } : {}),
    ...(form.quota.trim() ? { usageLimit: Number(form.quota) } : {}),
    ...(form.perBuyerLimit.trim() ? { usageLimitPerUser: Number(form.perBuyerLimit) } : {}),
    startsAt: toIsoDateTime(form.startsAt),
    expiresAt: toIsoDateTime(form.endsAt),
  }
}

export function flattenCategories(
  categories: SellerCategory[],
): Array<{ id: string; name: string }> {
  return categories.flatMap((category) => [
    { id: category.id, name: category.name },
    ...flattenCategories(category.children ?? []),
  ])
}

export function mapProductFormToCreatePayload(
  form: ProductDetailFormData,
  categories: SellerCategory[],
  targetStatus: ProductStatus,
): CreateProductPayload {
  const categoryMap = new Map(
    flattenCategories(categories).map((category) => [category.name, category.id]),
  )
  const hasVariants = form.optionGroups.some((group) =>
    group.values.some((value) => value.trim() !== ''),
  )

  const firstVariant = form.variantSeeds[0]
  const basePrice = firstVariant?.price ? Number(firstVariant.price) : undefined
  const baseStock = firstVariant?.stock ? Number(firstVariant.stock) : undefined

  const payload: CreateProductPayload = {
    name: form.name,
    ...(form.fullDescription.trim() ? { description: form.fullDescription.trim() } : {}),
    ...(basePrice !== undefined ? { basePrice } : {}),
    ...(firstVariant?.sku ? { baseSku: firstVariant.sku } : {}),
    ...(baseStock !== undefined ? { baseStock } : {}),
    ...(form.weightKg.trim() ? { weight: Number(form.weightKg) * 1000 } : {}),
    hasVariants,
    ...(hasVariants
      ? {
          variantOptionGroups: form.optionGroups.map(
            (group: ProductDetailFormData['optionGroups'][number]) => ({
              name: group.name,
              options: group.values.filter(Boolean).map((value: string) => ({ value })),
            }),
          ),
          variants: form.variantSeeds.map(
            (variant: ProductDetailFormData['variantSeeds'][number]) => ({
              ...(variant.sku ? { sku: variant.sku } : {}),
              price: Number(variant.price || 0),
              stock: Number(variant.stock || 0),
              optionValues: variant.key.split('||').filter(Boolean),
            }),
          ),
        }
      : {}),
    ...(form.media.length > 0
      ? {
          images: form.media.map((item: ProductDetailFormData['media'][number], index: number) => ({
            url: item.url,
            ...(item.alt ? { alt: item.alt } : {}),
            isCover: index === 0,
          })),
        }
      : {}),
    status: targetStatus,
  }

  const categoryId = form.category ? categoryMap.get(form.category) : undefined
  if (categoryId) {
    payload.categoryId = categoryId
  }

  return payload
}

export type SellerApproval = ApprovalRow

export type SellerBulkJob = BulkJobRow

export interface SellerNotification extends SellerNotificationListItem {
  type: string
  isRead: boolean
}

export type SellerWarehouse = WarehouseRow

export interface SellerProductListItem {
  id: string
  name: string
  baseSku: string | null
  basePrice: number | null
  baseStock: number
  status: string
  images: Array<{ url: string }>
  category: { name: string } | null
}

export interface SellerInventoryItem {
  variantId: string
  productName: string
  sku: string | null
  stock: number
  reservedStock: number
  availableStock: number
  isLowStock: boolean
}

export interface SellerReview {
  id: string
  rating: number
  title: string | null
  comment: string | null
  status: string
  createdAt: string
  replies: Array<{ id: string; message: string }>
}

export type SellerReviewAnalytics = ReviewAnalytics

export interface SellerReturnItem {
  id: string
  variantId: string
  quantity: number
}

export interface SellerReturn {
  id: string
  orderId: string
  reason: string
  status: string
  refundAmount: number
  createdAt: string
  items: SellerReturnItem[]
  buyer?: { name?: string }
}

export interface SellerShippingProvider {
  id: string
  name: string
  code: string
  isActive: boolean
}

export interface SellerShippingMethod {
  id: string
  providerId: string
  isEnabled: boolean
}

export interface SellerChatConversation {
  id: string
  buyerId: string
  lastMessageText: string | null
  lastMessageAt: string | null
  sellerUnread: number
}

export interface SellerChatMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

export interface SellerMessageSendPayload {
  content: string
}

export interface SellerOrderDetail {
  id: string
  status: OrderDetailStatus
  totalAmount: number
  subtotal: number
  shippingFee: number
  createdAt: string
  updatedAt: string
  order: {
    id: string
    shippingName: string
    shippingPhone: string | null
    shippingAddress: string | null
  }
  items: Array<{
    id: string
    productName: string
    variantLabel: string | null
    quantity: number
    unitPrice: number
    totalPrice: number
    variant: {
      sku: string
      product: {
        id: string
        name: string
      }
    }
  }>
  shipment: null | {
    status: string
    trackingNumber: string | null
    provider: null | {
      name: string
    }
  }
  auditLogs: Array<{
    id: string
    fromStatus: string | null
    toStatus: string | null
    note: string | null
    createdAt: string
  }>
}

const PRODUCT_STATUS_MAP: Record<string, ProductRow['status']> = {
  PUBLISHED: 'LIVE',
  DRAFT: 'DRAFT',
  ARCHIVED: 'OUT_OF_STOCK',
  PENDING: 'PENDING',
  BLOCKED: 'BLOCKED',
  SCHEDULED: 'SCHEDULED',
}

const ORDER_STATUS_MAP: Record<string, Exclude<OrdersStatusTab, 'ALL'>> = {
  PENDING: 'TO_PAY',
  CONFIRMED: 'TO_SHIP',
  PACKING: 'PACKING',
  SHIPPED: 'SHIPPING',
  DELIVERED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

export const SELLER_ORDER_STATUS_TO_QUERY: Record<Exclude<OrdersStatusTab, 'ALL'>, string> = {
  TO_PAY: 'PENDING',
  TO_SHIP: 'CONFIRMED',
  PACKING: 'PACKING',
  SHIPPING: 'SHIPPED',
  COMPLETED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
}

function formatConversationTime(value: string | null) {
  if (!value) {
    return null
  }

  const label = sharedFormatDateTime(
    value,
    {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
    'en-US',
  )
  if (!label) {
    return null
  }

  return label
}

function formatMessageTime(value: string) {
  return sharedFormatDateTime(value, { hour: 'numeric', minute: '2-digit' }, 'en-US')
}

function formatBuyerLabel(buyerId: string) {
  return `Buyer ${buyerId.slice(0, 6).toUpperCase()}`
}

function formatOrderLabel(conversationId: string) {
  return `Order ${conversationId.slice(0, 8).toUpperCase()}`
}

function formatProductLabel(conversationId: string) {
  return `Product ${conversationId.slice(-4).toUpperCase()}`
}

function mapOrderStatus(status: string): Exclude<OrdersStatusTab, 'ALL'> {
  return ORDER_STATUS_MAP[status] ?? 'TO_PAY'
}

function formatAuditLabel(fromStatus: string | null, toStatus: string | null) {
  if (fromStatus && toStatus) {
    return `${fromStatus} -> ${toStatus}`
  }

  if (toStatus) {
    return `Moved to ${toStatus}`
  }

  return 'Status updated'
}

export function mapApprovalsToRows(approvals: SellerApproval[]): ApprovalRow[] {
  return approvals
}

export function mapNotificationsToRows(notifications: SellerNotification[]): NotificationRow[] {
  return notifications.map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    createdAtLabel: sharedFormatDateTime(notification.createdAt),
  }))
}

export function mapProductsToRows(products: SellerProductListItem[]): ProductRow[] {
  return products.map((product) => ({
    id: product.id,
    image: product.images[0]?.url ?? '',
    name: product.name,
    sku: product.baseSku ?? '',
    category: product.category?.name ?? '',
    status: PRODUCT_STATUS_MAP[product.status] ?? 'DRAFT',
    price: product.basePrice ?? 0,
    stock: product.baseStock,
    sold: '-',
    rating: 0,
  }))
}

export function mapOrdersToRows(orders: SellerOrderListItem[]): OrderRow[] {
  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.order?.id ?? order.id,
    buyerName: order.order?.shippingName ?? 'Unknown buyer',
    items: (order.items ?? []).map((item) => ({
      id: item.id,
      productName: item.productName ?? item.product?.name ?? 'Unnamed product',
      ...(item.variantLabel ? { variantLabel: item.variantLabel } : {}),
      ...(item.product?.images?.[0]?.url ? { image: item.product.images[0].url } : {}),
    })),
    itemCount: order._count?.items ?? order.items?.length ?? 0,
    total: Number(order.totalAmount ?? order.subtotal ?? 0),
    status: mapOrderStatus(order.status),
    createdAtLabel: formatDateLabel(order.createdAt),
    href: `/orders/${order.id}`,
  }))
}

export function mapInventoryToRows(items: SellerInventoryItem[]): InventoryRow[] {
  return items.map((item) => ({
    id: item.variantId,
    image: '',
    name: item.productName,
    category: '',
    sku: item.sku ?? '',
    onHand: item.stock,
    incoming: 0,
    reserved: item.reservedStock,
    available: item.availableStock,
    threshold: 10,
    status: item.isLowStock ? 'Low' : 'OK',
  }))
}

export function mapReviewsToRows(reviews: SellerReview[]): ReviewRow[] {
  return reviews.map((review) => ({
    id: review.id,
    rating: Math.min(5, Math.max(1, review.rating)) as ReviewRow['rating'],
    title: review.title,
    comment: review.comment,
    status:
      review.status === 'PUBLISHED' || review.status === 'HIDDEN' || review.status === 'PENDING'
        ? review.status
        : 'PENDING',
    hasReply: review.replies.length > 0,
    replyMessage: review.replies[0]?.message ?? null,
    createdAtLabel: formatDateIntl(review.createdAt),
  }))
}

export function mapReturnsToRows(items: SellerReturn[]): ReturnRow[] {
  return items.map((item) => ({
    id: item.id,
    caseId: item.id.slice(0, 8).toUpperCase(),
    orderNumber: item.orderId.slice(0, 8).toUpperCase(),
    buyerName: item.buyer?.name ?? '-',
    reason: item.reason.replace(/_/g, ' '),
    amount: Number(item.refundAmount),
    status:
      item.status === 'OPEN' ||
      item.status === 'APPROVED' ||
      item.status === 'REFUNDED' ||
      item.status === 'REJECTED'
        ? item.status
        : 'OPEN',
    openedAtLabel: formatDateIntl(item.createdAt),
  }))
}

export function mapShippingProviders(
  providers: SellerShippingProvider[],
  methods: SellerShippingMethod[],
): ShippingProviderRow[] {
  return providers.map((provider) => ({
    id: provider.id,
    name: provider.name,
    code: provider.code,
    isEnabled: methods.some((method) => method.providerId === provider.id && method.isEnabled),
  }))
}

export function mapConversationsToUi(
  conversations: SellerChatConversation[],
): MessageConversation[] {
  return conversations.map((conversation) => {
    const lastMessageAtLabel = formatConversationTime(conversation.lastMessageAt)

    return {
      id: conversation.id,
      buyerName: formatBuyerLabel(conversation.buyerId),
      buyerInitials: 'BY',
      orderLabel: formatOrderLabel(conversation.id),
      productLabel: formatProductLabel(conversation.id),
      lastMessagePreview: conversation.lastMessageText ?? 'No messages yet',
      unreadCount: conversation.sellerUnread,
      ...(conversation.lastMessageAt ? { lastActivityAt: conversation.lastMessageAt } : {}),
      ...(lastMessageAtLabel ? { lastMessageAtLabel } : {}),
    }
  })
}

export function mapMessagesToUi(
  messages: SellerChatMessage[],
  selectedConversation: SellerChatConversation | undefined,
): MessageEntry[] {
  const lastSellerMessageId = [...messages]
    .reverse()
    .find((message) => message.senderId !== selectedConversation?.buyerId)?.id

  return messages.map((message) => {
    const isBuyerMessage = message.senderId === selectedConversation?.buyerId

    return {
      id: message.id,
      sender: isBuyerMessage ? 'BUYER' : 'SELLER',
      content: message.content,
      sentAtLabel: formatMessageTime(message.createdAt),
      ...(!isBuyerMessage && message.id === lastSellerMessageId
        ? { deliveryStatus: 'DELIVERED' as const }
        : {}),
    }
  })
}

export function sortConversationsByActivity(conversations: SellerChatConversation[]) {
  return [...conversations].sort((left, right) => {
    const leftTime = left.lastMessageAt ? new Date(left.lastMessageAt).getTime() : 0
    const rightTime = right.lastMessageAt ? new Date(right.lastMessageAt).getTime() : 0
    return rightTime - leftTime
  })
}

export function getUnreadConversationCount(conversations: SellerChatConversation[]) {
  return conversations.reduce((sum, conversation) => sum + conversation.sellerUnread, 0)
}

export function getSelectedConversationId(
  currentConversationId: string | undefined,
  conversations: SellerChatConversation[],
) {
  if (
    currentConversationId &&
    conversations.some((conversation) => conversation.id === currentConversationId)
  ) {
    return currentConversationId
  }

  return conversations[0]?.id
}

export function markConversationAsRead(
  conversations: SellerChatConversation[],
  conversationId: string,
) {
  return conversations.map((conversation) =>
    conversation.id === conversationId ? { ...conversation, sellerUnread: 0 } : conversation,
  )
}

export function markConversationAsReadResult(
  conversations: SellerChatConversation[],
  conversationId: string,
) {
  const next = markConversationAsRead(conversations, conversationId)
  return {
    conversations: next,
    unreadCount: getUnreadConversationCount(next),
  }
}

export function appendMessage(messages: SellerChatMessage[], incoming: SellerChatMessage) {
  if (messages.some((message) => message.id === incoming.id)) {
    return messages
  }

  return [...messages, incoming]
}

export function applyIncomingMessage(
  conversations: SellerChatConversation[],
  incoming: SellerChatMessage,
) {
  const updated = conversations.map((conversation) =>
    conversation.id === incoming.conversationId
      ? {
          ...conversation,
          lastMessageText: incoming.content,
          lastMessageAt: incoming.createdAt,
          sellerUnread:
            incoming.senderId === conversation.buyerId
              ? conversation.sellerUnread + 1
              : conversation.sellerUnread,
        }
      : conversation,
  )

  return sortConversationsByActivity(updated)
}

export function applyIncomingMessageResult(
  conversations: SellerChatConversation[],
  incoming: SellerChatMessage,
) {
  const next = applyIncomingMessage(conversations, incoming)
  return {
    conversations: next,
    unreadCount: getUnreadConversationCount(next),
  }
}

export function updateConversationsAfterSend(
  conversations: SellerChatConversation[],
  conversationId: string,
  content: string,
) {
  const sentAt = new Date().toISOString()
  const updated = conversations.map((conversation) =>
    conversation.id === conversationId
      ? {
          ...conversation,
          lastMessageText: content,
          lastMessageAt: sentAt,
          sellerUnread: 0,
        }
      : conversation,
  )

  return sortConversationsByActivity(updated)
}

export function mapOrderDetail(order: SellerOrderDetail): OrderDetailRecord {
  const shipment = order.shipment
    ? {
        status: order.shipment.status,
        ...(order.shipment.trackingNumber ? { trackingNumber: order.shipment.trackingNumber } : {}),
        ...(order.shipment.provider?.name ? { providerName: order.shipment.provider.name } : {}),
      }
    : undefined

  return {
    id: order.id,
    orderNumber: order.order.id,
    status: order.status,
    createdAt: formatDateTime(order.createdAt),
    updatedAt: formatDateTime(order.updatedAt),
    totalAmount: Number(order.totalAmount),
    subtotalAmount: Number(order.subtotal),
    shippingAmount: Number(order.shippingFee),
    itemCount: order.items.reduce((count, item) => count + item.quantity, 0),
    customer: {
      name: order.order.shippingName,
      ...(order.order.shippingPhone ? { phone: order.order.shippingPhone } : {}),
      ...(order.order.shippingAddress ? { address: order.order.shippingAddress } : {}),
    },
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      ...(item.variantLabel ? { variantLabel: item.variantLabel } : {}),
      sku: item.variant.sku,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    })),
    ...(shipment ? { shipment } : {}),
    auditLogs: order.auditLogs.map((log) => ({
      id: log.id,
      label: formatAuditLabel(log.fromStatus, log.toStatus),
      timestamp: formatDateTime(log.createdAt),
      ...(log.note ? { note: log.note } : {}),
    })),
  }
}
