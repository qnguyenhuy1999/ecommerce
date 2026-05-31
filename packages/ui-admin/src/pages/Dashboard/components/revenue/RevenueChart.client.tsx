'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { RevenuePoint } from '../../Dashboard.types'

interface RevenueChartProps {
  data: RevenuePoint[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div
      className="h-[320px] w-full sm:h-[360px]"
      role="img"
      aria-label="Revenue trend over the last 14 days"
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={data} margin={{ top: 18, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="adminRevenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.42} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            stroke="var(--muted-foreground)"
            fontSize={12}
          />
          <YAxis hide domain={[0, 'dataMax + 8']} />
          <Tooltip
            cursor={{ stroke: 'var(--chart-1)', strokeDasharray: '4 4' }}
            contentStyle={{
              borderRadius: '16px',
              borderColor: 'var(--border)',
              backgroundColor: 'var(--card)',
              color: 'var(--card-foreground)',
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--chart-1)"
            strokeWidth={3}
            fill="url(#adminRevenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
