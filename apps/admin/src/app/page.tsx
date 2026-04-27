'use client'

import dynamic from 'next/dynamic'

import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { MetricCard } from '@ecom/ui-admin'
import type { ActivityItem, NotificationItem } from '@ecom/ui-admin'
import { adminDashboardClient } from '@ecom/api-client'
import type { AdminDashboardMetric } from '@ecom/api-client'

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

const ICONS: Record<string, React.ReactNode> = {
  'Revenue (30d)': <DollarSign className="h-4 w-4" />,
  'Orders (30d)': <ShoppingCart className="h-4 w-4" />,
  'Active sellers': <Users className="h-4 w-4" />,
  'Catalog SKUs': <Package className="h-4 w-4" />,
}

function toMetric(metric: AdminDashboardMetric): DashboardMetric {
  return {
    ...metric,
    icon: ICONS[metric.label] ?? <Package className="h-4 w-4" />,
  }
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminDashboardClient.get,
  })

  const metrics = (data?.metrics ?? []).map(toMetric)
  const activities: ActivityItem[] = data?.activities ?? []
  const notifications: NotificationItem[] = data?.notifications ?? []

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
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              previousValue={metric.previousValue}
              format={metric.format}
              icon={metric.icon}
            />
          ))}
          {isLoading && Array.from({ length: 4 }).map((_, index) => <PanelSkeleton key={index} />)}
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-6)] lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-4)]">
              <h2 className="mb-[var(--space-3)] text-[length:var(--text-base)] font-semibold">
                Recent activity
              </h2>
              <ActivityFeed items={activities} />
            </div>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-base)] p-[var(--space-4)]">
            <h2 className="mb-[var(--space-3)] text-[length:var(--text-base)] font-semibold">
              Notifications
            </h2>
            <NotificationPanel notifications={notifications} />
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
