'use client'

import React from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  cn,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@ecom/ui'

import { PERIOD_OPTIONS } from './RevenueChart.fixtures'

export interface RevenueChartDatum {
  name: string
  total: number
  [key: string]: string | number
}

function setDisplayName<T>(component: T, name: string): T {
  ;(component as { displayName?: string }).displayName = name
  return component
}

export interface RevenueChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  totalRevenue?: string
  data?: RevenueChartDatum[]
  period?: string
  onPeriodChange?: (period: string) => void
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value?: number | string | null }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const rawValue = payload[0]?.value
  if (rawValue == null) return null
  const value = typeof rawValue === 'number' ? rawValue : Number(rawValue)
  if (!Number.isFinite(value)) return null
  return (
    <div
      className="min-w-[11rem] rounded-[var(--radius-md)] border px-4 py-3"
      style={{
        backgroundColor: 'var(--surface-inverse)',
        color: 'var(--text-inverse)',
        borderColor: 'var(--surface-inverse-fg)',
        boxShadow: 'var(--elevation-dropdown)',
      }}
    >
      <p className="mb-1 text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
        {label}
      </p>
      <p className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-inverse)' }}>
        ${value.toLocaleString()}
      </p>
    </div>
  )
}
// Context + compound subcomponents
type RevenueChartContextValue = {
  title?: string
  totalRevenue?: string
  data: RevenueChartDatum[]
  period?: string
  onPeriodChange?: (period: string) => void
}

const RevenueChartContext = React.createContext<RevenueChartContextValue | null>(null)

function useRevenueChart() {
  const ctx = React.useContext(RevenueChartContext)
  if (!ctx) throw new Error('useRevenueChart must be used within <RevenueChart>')
  return ctx
}

function RevenueChartRoot({
  title = 'Revenue Overview',
  totalRevenue,
  data = [],
  period = '30d',
  onPeriodChange,
  className,
  children,
  ...props
}: RevenueChartProps & { children?: React.ReactNode }) {
  const providerValue = React.useMemo(
    () => ({ title, totalRevenue, data, period, onPeriodChange }),
    [title, totalRevenue, data, period, onPeriodChange],
  )

  const defaultContent = (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-subtle)] bg-[var(--surface-base)]/96 p-0 backdrop-blur-[10px]',
        className,
      )}
      style={{ boxShadow: 'var(--elevation-surface)' }}
      {...props}
    >
      {/* Subtle rose inner-gradient for premium depth */}
      <div className="pointer-events-none absolute inset-0 z-0 rounded-[var(--radius-lg)]" />

      <Card
        className="relative z-10 border-0 shadow-none"
        style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}
      >
        <RevenueChartHeader />
        <RevenueChartChart />
        <CardContent>
          <RevenueChartPeriod />
        </CardContent>
      </Card>
    </div>
  )

  return (
    <RevenueChartContext.Provider value={providerValue}>
      {children ? children : defaultContent}
    </RevenueChartContext.Provider>
  )
}

function RevenueChartHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { title, totalRevenue } = useRevenueChart()
  return (
    <CardHeader
      className={cn('flex flex-row items-start justify-between pb-1 pt-5 px-6', className)}
      {...props}
    >
      <div className="space-y-0.5">
        <CardTitle
          className="text-sm font-semibold tracking-wide uppercase"
          style={{ color: 'var(--text-secondary)' }}
        >
          {title}
        </CardTitle>
        {totalRevenue && (
          <p
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            {totalRevenue}
          </p>
        )}
      </div>

      <div
        className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full shadow-[var(--elevation-xs)]"
        style={{ background: 'var(--action-muted)' }}
        aria-hidden
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 11V3M3.5 6.5L7 3l3.5 3.5"
            stroke="var(--brand-500)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </CardHeader>
  )
}
setDisplayName(RevenueChartHeader, 'RevenueChart.Header')

function RevenueChartChart({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { data } = useRevenueChart()
  return (
    <CardContent className={cn('pb-5 px-6', className)} {...props}>
      <div className="mt-2 w-full" style={{ height: 'var(--chart-height)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data || []} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--text-tertiary)', fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--text-tertiary)', fontWeight: 400 }}
              tickFormatter={(val: number | string) => {
                const n = typeof val === 'number' ? val : Number(val)
                return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`
              }}
              width={48}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'var(--surface-muted)', opacity: 0.5, radius: 8 }}
            />
            <Bar
              dataKey="total"
              radius={[6, 6, 0, 0]}
              maxBarSize={56}
              isAnimationActive
              animationDuration={600}
              animationEasing="ease-out"
              fill="var(--brand-500)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  )
}
setDisplayName(RevenueChartChart, 'RevenueChart.Chart')

function RevenueChartPeriod({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { period, onPeriodChange } = useRevenueChart()
  return (
    <div className={cn('mt-4 flex items-center justify-end', className)} {...props}>
      {onPeriodChange && (
        <Select value={period} onValueChange={(v) => onPeriodChange(v)}>
          <SelectTrigger
            className="h-7 text-xs"
            style={{
              backgroundColor: 'var(--surface-muted)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            style={{ backgroundColor: 'var(--surface-base)', borderColor: 'var(--border-subtle)' }}
          >
            {PERIOD_OPTIONS.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                style={{ color: 'var(--text-primary)', fontSize: '0.8125rem' }}
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
setDisplayName(RevenueChartPeriod, 'RevenueChart.Period')

type RevenueChartComponent = typeof RevenueChartRoot & {
  Header: typeof RevenueChartHeader
  Chart: typeof RevenueChartChart
  Period: typeof RevenueChartPeriod
}

const RevenueChart = Object.assign(RevenueChartRoot, {
  Header: RevenueChartHeader,
  Chart: RevenueChartChart,
  Period: RevenueChartPeriod,
}) as RevenueChartComponent

export { RevenueChart }
