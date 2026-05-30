'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/core-ui/molecules/Select'
import { Download } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { SectionCard } from '../../atoms/SectionCard'
import { formatCurrency } from '@ecom/shared/utils/format'
import { analyticsDefaultProps } from './Analytics.fixtures'
import { TrafficLegend } from './Analytics.server'
import type {
  AnalyticsOrdersByDayPoint,
  AnalyticsProps,
  AnalyticsRevenuePoint,
  AnalyticsTrafficSource,
} from './Analytics.types'

export function RevenueTrendSection({ revenueSeries }: { revenueSeries: AnalyticsRevenuePoint[] }) {
  return (
    <SectionCard title="Revenue trend" padded={false}>
      <div className="h-72 px-2 py-4 sm:px-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueSeries} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="analytics-revenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.34} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="label"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              interval="preserveStartEnd"
              minTickGap={28}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ stroke: 'var(--border)', strokeDasharray: '4 4' }}
              contentStyle={{
                borderColor: 'var(--border)',
                borderRadius: 16,
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
              }}
              formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Revenue']}
              labelStyle={{ color: 'var(--muted-foreground)' }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#ea580c"
              strokeWidth={3}
              fill="url(#analytics-revenue)"
              dot={false}
              activeDot={{ r: 4, fill: '#ea580c' }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}

export function TrafficSourcesSection({
  trafficSources,
}: {
  trafficSources: AnalyticsTrafficSource[]
}) {
  const chartData = trafficSources.map((source) => ({ ...source, fill: source.color }))

  return (
    <SectionCard title="Traffic sources">
      <div className="grid gap-4 md:grid-cols-[9rem_minmax(0,1fr)] md:items-center">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={42}
                outerRadius={74}
                paddingAngle={2}
                strokeWidth={0}
                isAnimationActive={false}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <TrafficLegend trafficSources={trafficSources} />
      </div>
    </SectionCard>
  )
}

export function OrdersByDaySection({
  ordersByDaySeries,
}: {
  ordersByDaySeries: AnalyticsOrdersByDayPoint[]
}) {
  return (
    <SectionCard title="Orders by day" padded={false}>
      <div className="h-64 px-2 py-4 sm:px-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ordersByDaySeries} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.35} />
            <XAxis
              axisLine={false}
              tickLine={false}
              dataKey="label"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'rgba(249, 115, 22, 0.08)' }}
              contentStyle={{
                borderColor: 'var(--border)',
                borderRadius: 16,
                backgroundColor: 'var(--card)',
                color: 'var(--foreground)',
              }}
              formatter={(value) => [`${Number(value ?? 0)} orders`, 'Orders']}
              labelStyle={{ color: 'var(--muted-foreground)' }}
            />
            <Bar
              dataKey="orders"
              fill="#fb923c"
              radius={[10, 10, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  )
}

export function AnalyticsPageActions({
  dateRange = analyticsDefaultProps.dateRange,
  dateRangeOptions = analyticsDefaultProps.dateRangeOptions,
  onDateRangeChange,
  exportHref = analyticsDefaultProps.exportHref,
  onExport,
}: Pick<
  AnalyticsProps,
  'dateRange' | 'dateRangeOptions' | 'onDateRangeChange' | 'exportHref' | 'onExport'
>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={dateRange} onValueChange={(value) => onDateRangeChange?.(value)}>
        <SelectTrigger className="bg-background w-39">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {onExport ? (
        <Button variant="outline" onClick={onExport}>
          <Download />
          Export
        </Button>
      ) : (
        <Button asChild variant="outline">
          <a href={exportHref}>
            <Download />
            Export
          </a>
        </Button>
      )}
    </div>
  )
}
