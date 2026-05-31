import { Button } from '@ecom/core-ui/atoms/Button'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { Card, CardContent, CardHeader, CardTitle } from '@ecom/core-ui/molecules/Card'
import { dashboardActionClassName, dashboardCardClassName } from '../../Dashboard.constants'
import type { RevenuePoint } from '../../Dashboard.types'
import { RevenueChart } from './RevenueChart.client'

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
  return (
    <section aria-labelledby="revenue-heading">
      <Card className={`${dashboardCardClassName} overflow-hidden`}>
        <CardHeader className="flex flex-row items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
          <div className="space-y-1">
            <CardTitle id="revenue-heading" className="text-xl">
              Revenue (14d)
            </CardTitle>
            <Typography variant="body-sm" className="text-muted-foreground">
              Net of refunds
            </Typography>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={dashboardActionClassName}
            aria-label="Open revenue analytics"
          >
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

          <RevenueChart data={revenueSeries} />
        </CardContent>
      </Card>
    </section>
  )
}
