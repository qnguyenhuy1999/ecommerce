'use client'

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

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

export interface RevenueChartProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  totalRevenue?: string
  data?: unknown[] // Placeholder for actual chart data format (e.g. Recharts)
  period?: string
  onPeriodChange?: (period: string) => void
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
    <Card className={cn('admin-stat-card', className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {totalRevenue && <p className="text-2xl font-bold tracking-tight">{totalRevenue}</p>}
        </div>
        <div className="flex items-center gap-2">
          {onPeriodChange && (
            <Select
              value={period}
              onValueChange={(v) => {
                onPeriodChange(v)
              }}
            >
              <SelectTrigger className="h-8 text-xs py-1 w-auto min-w-[var(--space-12)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[var(--chart-height)] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
                tickFormatter={(val) => `$${val}`}
                width={60}
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                contentStyle={{
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                }}
              />
              <Bar
                dataKey="total"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export { RevenueChart }
