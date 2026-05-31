import { StatCard } from '@ecom/core-ui/molecules/StatCard'
import { dashboardCardClassName } from '../Dashboard.constants'
import type { DashboardMetric } from '../Dashboard.types'

interface MetricsGridProps {
  metrics: DashboardMetric[]
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  if (metrics.length === 0) {
    return null
  }

  return (
    <section aria-label="Dashboard metrics">
      <div className="grid gap-4 xl:grid-cols-4">
        {metrics.map((metric) => {
          const statCardProps = {
            ...(metric.trend !== undefined ? { trend: metric.trend } : {}),
            ...(metric.spark !== undefined ? { spark: metric.spark } : {}),
            ...(metric.accent !== undefined ? { accent: metric.accent } : {}),
          }

          return (
            <StatCard
              key={metric.label}
              label={metric.label.toUpperCase()}
              value={metric.value}
              className={dashboardCardClassName}
              {...statCardProps}
            />
          )
        })}
      </div>
    </section>
  )
}
