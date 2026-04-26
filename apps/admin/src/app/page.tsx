'use client'

import dynamic from 'next/dynamic'

import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'

import { MetricCard } from '@ecom/ui-admin'
import type { ActivityItem, NotificationItem } from '@ecom/ui-admin'

import { AdminShell } from '@/components/admin-shell'

/**
 * Lazy-load below-the-fold dashboard widgets so the metric cards (above the
 * fold) hydrate first. Both panels are heavy with icons + dropdowns and don't
 * need to ship to the client until they're about to render.
 */
const ActivityFeed = dynamic(
  () => import('@ecom/ui-admin').then((m) => ({ default: m.ActivityFeed })),
  {
    ssr: false,
    loading: () => <PanelSkeleton />,
  },
)

const NotificationPanel = dynamic(
  () => import('@ecom/ui-admin').then((m) => ({ default: m.NotificationPanel })),
  {
    ssr: false,
    loading: () => <PanelSkeleton />,
  },
)

function PanelSkeleton() {
  return (
    <div className="space-y-[var(--space-3)]">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-12 animate-pulse rounded bg-[var(--surface-muted)]"
        />
      ))}
    </div>
  )
}

interface DashboardMetric {
  label: string
  value: number
  previousValue: number
  format: 'number' | 'currency' | 'percent'
  icon: React.ReactNode
}

const METRICS: DashboardMetric[] = [
  {
    label: 'Revenue (30d)',
    value: 84_215,
    previousValue: 71_402,
    format: 'currency',
    icon: <DollarSign className="h-4 w-4" />,
  },
  {
    label: 'Orders (30d)',
    value: 1_284,
    previousValue: 1_098,
    format: 'number',
    icon: <ShoppingCart className="h-4 w-4" />,
  },
  {
    label: 'Active sellers',
    value: 142,
    previousValue: 128,
    format: 'number',
    icon: <Users className="h-4 w-4" />,
  },
  {
    label: 'Catalog SKUs',
    value: 4_812,
    previousValue: 4_531,
    format: 'number',
    icon: <Package className="h-4 w-4" />,
  },
]

const ACTIVITIES: ActivityItem[] = [
  {
    id: 'a1',
    user: { name: 'Coastal Audio' },
    action: 'was approved as a new seller',
    timestamp: '2h ago',
    isLatest: true,
  },
  {
    id: 'a2',
    user: { name: 'Buyer #4129' },
    action: 'requested a refund on',
    target: 'ORD-1042',
    timestamp: '4h ago',
  },
  {
    id: 'a3',
    user: { name: 'Inventory bot' },
    action: 'flagged low stock on',
    target: 'Pulse Studio Headphones',
    timestamp: '6h ago',
  },
]

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'New seller awaiting approval',
    message: 'Mountain Outfitters submitted KYC documents.',
    timestamp: '1h ago',
    read: false,
    type: 'info',
  },
  {
    id: 'n2',
    title: 'Payout completed',
    message: 'May payouts to 142 sellers completed successfully.',
    timestamp: '1d ago',
    read: true,
    type: 'success',
  },
]

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <div className="space-y-[var(--space-6)]">
        <header className="space-y-[var(--space-1)]">
          <h1 className="text-[length:var(--text-2xl)] font-bold tracking-tight">
            Marketplace overview
          </h1>
          <p className="text-[var(--text-secondary)]">
            Operational metrics across all sellers and orders.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2 xl:grid-cols-4">
          {METRICS.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              previousValue={metric.previousValue}
              format={metric.format}
              icon={metric.icon}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-6)] lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-4)]">
              <h2 className="mb-[var(--space-3)] text-[length:var(--text-base)] font-semibold">
                Recent activity
              </h2>
              <ActivityFeed items={ACTIVITIES} />
            </div>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-4)]">
            <h2 className="mb-[var(--space-3)] text-[length:var(--text-base)] font-semibold">
              Notifications
            </h2>
            <NotificationPanel notifications={NOTIFICATIONS} />
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
