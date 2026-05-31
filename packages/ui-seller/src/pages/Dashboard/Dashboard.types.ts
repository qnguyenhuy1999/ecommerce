import type { Accent, StatSparkPoint } from '@ecom/core-ui/molecules/StatCard'
import type { ProductStatusPillVariantProps } from '../../atoms/ProductStatusPill/ProductStatusPill.fixtures'

export interface Metric {
  label: string
  value: string | number
  trend?: number
  spark?: StatSparkPoint[]
  accent?: Accent
}

export interface RevenuePoint {
  label: string
  revenue: number
}

export type TodoTone = 'default' | 'warning' | 'destructive' | 'info'

export interface TodoItem {
  label: string
  count: number
  tone?: TodoTone
}

export interface PendingOrder {
  id: string
  customer: string
  amount: string
  status: ProductStatusPillVariantProps['variant']
  imageUrl: string
}

export interface LowStockItem {
  name: string
  sku: string
  remaining: number
  imageUrl: string
}

export interface PromotionItem {
  name: string
  redeemed: number
  total: number
  status: string
}

export interface TopProduct {
  rank: number
  name: string
  sold: number
  revenue: string
  imageUrl: string
}

export interface ActivityItem {
  title: string
  detail: string
  time: string
}

export interface DashboardProps {
  snapshotLabel?: string
  ordersHref?: string
  metrics?: Metric[]
  revenueSeries?: RevenuePoint[]
  todos?: TodoItem[]
  pendingOrders?: PendingOrder[]
  lowStockItems?: LowStockItem[]
  promotions?: PromotionItem[]
  topProducts?: TopProduct[]
  recentActivity?: ActivityItem[]
}
