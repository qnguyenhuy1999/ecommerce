'use client'

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

export interface RevenueChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  totalRevenue?: string
  data?: unknown[]
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

function RevenueChart({
  title = 'Revenue Overview',
  totalRevenue,
  data = [],
  period = '30d',
  onPeriodChange,
  className,
  ...props
}: RevenueChartProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-base)] p-0',
        className,
      )}
      style={{ boxShadow: 'var(--elevation-surface)' }}
      {...props}
    >
      {/* Subtle rose inner-gradient for premium depth */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-[var(--radius-lg)]"
        style={{
          background: 'linear-gradient(135deg, rgb(255 56 92 / 0.04) 0%, transparent 55%)',
        }}
      />

      <Card
        className="relative z-10 border-0 shadow-none"
        style={{ background: 'transparent', boxShadow: 'none', border: 'none' }}
      >
        <CardHeader className="flex flex-row items-start justify-between pb-1 pt-5 px-6">
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
                style={{
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {totalRevenue}
              </p>
            )}
          </div>

          {/* Trend icon — small rose circle */}
          <div
            className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
            style={{ background: 'var(--action-muted)' }}
            aria-hidden="true"
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

        <CardContent className="pb-5 px-6">
          <div className="mt-2 w-full" style={{ height: 'var(--chart-height)' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data || []} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: 'var(--text-tertiary)',
                    fontWeight: 500,
                  }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: 'var(--text-tertiary)',
                    fontWeight: 400,
                  }}
                  tickFormatter={(val) =>
                    val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`
                  }
                  width={48}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: 'var(--surface-muted)',
                    opacity: 0.5,
                    radius: 8,
                  }}
                />
                <Bar
                  dataKey="total"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={56}
                  isAnimationActive={true}
                  animationDuration={600}
                  animationEasing="ease-out"
                  fill="var(--brand-500)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Period selector — right-aligned, subtle */}
          <div className="mt-4 flex items-center justify-end">
            {onPeriodChange && (
              <Select
                value={period}
                onValueChange={(v) => {
                  onPeriodChange(v)
                }}
              >
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
                  style={{
                    backgroundColor: 'var(--surface-base)',
                    borderColor: 'var(--border-subtle)',
                  }}
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
        </CardContent>
      </Card>
    </div>
  )
}

export { RevenueChart }
