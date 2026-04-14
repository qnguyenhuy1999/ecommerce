'use client'

import { cn, Card, CardHeader, CardTitle, CardContent, Select } from '@ecom/ui'

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
              onChange={(e) => {
                onPeriodChange(e.target.value)
              }}
              className="h-8 text-xs py-1"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Placeholder for actual chart implementation like Recharts */}
        <div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed border-border rounded-[8px] bg-muted/20">
          <div className="text-center text-muted-foreground flex flex-col items-center">
            <div className="flex items-end gap-2 h-16 mb-4 opacity-50">
              <div className="w-8 bg-chart-1 rounded-t-sm h-[40%]" />
              <div className="w-8 bg-chart-2 rounded-t-sm h-[70%]" />
              <div className="w-8 bg-chart-3 rounded-t-sm h-[50%]" />
              <div className="w-8 bg-chart-4 rounded-t-sm h-[90%]" />
              <div className="w-8 bg-chart-5 rounded-t-sm h-[60%]" />
            </div>
            <p className="text-sm">Chart Visualization Area</p>
            <p className="text-xs">Inject Recharts or Chart.js here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { RevenueChart }
