import { StatCard } from '@ecom/core-ui/molecules/StatCard'
import { withDefined } from '@ecom/shared/utils/optional-object'
import type { Metric } from './Dashboard.types'

interface DashboardMetricsSectionProps {
  metrics: Metric[]
}

export function DashboardMetricsSection({ metrics }: DashboardMetricsSectionProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          {...withDefined({
            trend: metric.trend,
            spark: metric.spark,
            accent: metric.accent,
          })}
        />
      ))}
    </section>
  )
}
