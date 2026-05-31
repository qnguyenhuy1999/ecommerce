'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { useEffect, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { dashboardActionClassName, dashboardCardClassName } from './Dashboard.constants'
import type { RevenuePoint } from './Dashboard.types'

interface RevenueCardProps {
  revenueSeries: RevenuePoint[]
  revenueValueLabel: string
  revenueTrendLabel: string
}

export function RevenueCard({
  revenueSeries,
  revenueValueLabel,
  revenueTrendLabel,
}: RevenueCardProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Card className={`${dashboardCardClassName} overflow-hidden`}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
        <div className="space-y-1">
          <CardTitle className="text-xl">Revenue (14d)</CardTitle>
          <Typography variant="body-sm" className="text-muted-foreground">
            Net of refunds
          </Typography>
        </div>
        <Button variant="ghost" size="sm" className={dashboardActionClassName}>
          Analytics
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pt-4 pb-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-foreground text-4xl font-semibold tracking-tight">
            {revenueValueLabel}
          </div>
          <div className="text-success text-sm font-medium">{revenueTrendLabel}</div>
        </div>

        <div className="h-[320px] w-full sm:h-[360px]">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={revenueSeries} margin={{ top: 18, right: 8, left: -18, bottom: 0 }}>
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
          )}
        </div>
      </CardContent>
    </Card>
  )
}
