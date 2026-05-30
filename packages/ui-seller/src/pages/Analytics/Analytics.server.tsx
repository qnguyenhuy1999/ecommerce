import { Avatar, AvatarFallback, AvatarImage } from '@ecom/core-ui/atoms/Avatar'
import { Typography } from '@ecom/core-ui/atoms/Typography'
import { StatCard } from '@ecom/core-ui/molecules/StatCard'
import { cn } from '@ecom/shared/utils/cn'
import { SectionCard } from '../../atoms/SectionCard'
import type {
  AnalyticsFunnelStage,
  AnalyticsMetric,
  AnalyticsTopProduct,
  AnalyticsTrafficSource,
} from './Analytics.types'

export function TrafficLegend({ trafficSources }: { trafficSources: AnalyticsTrafficSource[] }) {
  return (
    <div className="space-y-2">
      {trafficSources.map((source) => (
        <div key={source.label} className="flex items-center justify-between gap-3 text-sm">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="inline-flex size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: source.color }}
            />
            <span className="text-muted-foreground truncate">{source.label}</span>
          </div>
          <span className="font-medium tabular-nums">{source.value}%</span>
        </div>
      ))}
    </div>
  )
}

export function FunnelBar({ value, color }: { value: number; color?: string }) {
  return (
    <div className="bg-muted h-2.5 overflow-hidden rounded-full">
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.max(0, Math.min(value, 100))}%`,
          background: color
            ? `linear-gradient(90deg, ${color} 0%, ${color} 100%)`
            : 'linear-gradient(90deg, #ea580c 0%, #fb923c 100%)',
        }}
      />
    </div>
  )
}

export function ConversionFunnelSection({
  conversionFunnel,
}: {
  conversionFunnel: AnalyticsFunnelStage[]
}) {
  return (
    <SectionCard title="Conversion funnel">
      <div className="space-y-4">
        {conversionFunnel.map((stage) => (
          <div key={stage.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{stage.label}</span>
              <span className="text-muted-foreground tabular-nums">{stage.conversionLabel}</span>
            </div>
            <FunnelBar value={stage.value} {...(stage.color ? { color: stage.color } : {})} />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

export function TopProductsSection({ topProducts }: { topProducts: AnalyticsTopProduct[] }) {
  return (
    <SectionCard title="Top products" padded={false}>
      <div className="overflow-x-auto">
        <div className="min-w-176">
          <div className="text-muted-foreground grid grid-cols-[4rem_minmax(0,1.6fr)_7rem_8rem_6rem] gap-3 border-b px-4 py-3 text-xs font-semibold tracking-[0.02em] uppercase">
            <span>#</span>
            <span>Product</span>
            <span className="text-right">Units</span>
            <span className="text-right">Revenue</span>
            <span className="text-right">Conv.</span>
          </div>

          {topProducts.map((product, index) => (
            <div
              key={product.id}
              className={cn(
                'grid grid-cols-[4rem_minmax(0,1.6fr)_7rem_8rem_6rem] gap-3 px-4 py-3.5',
                index !== 0 && 'border-border border-t',
              )}
            >
              <div className="text-muted-foreground text-sm tabular-nums">{product.rank}</div>
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="rounded-xl" size="lg">
                  <AvatarImage alt={product.name} className="rounded-xl" src={product.imageUrl} />
                  <AvatarFallback className="rounded-xl">P{product.rank}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 text-sm font-medium">
                  <Typography variant="label" className="truncate text-sm">
                    {product.name}
                  </Typography>
                </div>
              </div>
              <div className="text-right text-sm tabular-nums">{product.units}</div>
              <div className="text-right text-sm font-medium tabular-nums">{product.revenue}</div>
              <div className="text-right text-sm tabular-nums">{product.conversion}</div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

export function MetricsSection({ metrics }: { metrics: AnalyticsMetric[] }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          {...(typeof metric.trend === 'number' ? { trend: metric.trend } : {})}
          {...(metric.spark ? { spark: metric.spark } : {})}
          {...(metric.accent ? { accent: metric.accent } : {})}
          {...(metric.description ? { description: metric.description } : {})}
        />
      ))}
    </section>
  )
}
