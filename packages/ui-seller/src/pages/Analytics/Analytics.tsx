import { ConsolePageLayout } from '@ecom/core-ui'
import {
  AnalyticsPageActions,
  OrdersByDaySection,
  RevenueTrendSection,
  TrafficSourcesSection,
} from './Analytics.client'
import { analyticsDefaultProps } from './Analytics.fixtures'
import { ConversionFunnelSection, MetricsSection, TopProductsSection } from './Analytics.server'
import type { AnalyticsProps } from './Analytics.types'

export function Analytics({
  title = analyticsDefaultProps.title,
  description = analyticsDefaultProps.description,
  breadcrumb,
  dateRange = analyticsDefaultProps.dateRange,
  dateRangeOptions = analyticsDefaultProps.dateRangeOptions,
  onDateRangeChange,
  exportHref = analyticsDefaultProps.exportHref,
  onExport,
  metrics = analyticsDefaultProps.metrics,
  revenueSeries = analyticsDefaultProps.revenueSeries,
  trafficSources = analyticsDefaultProps.trafficSources,
  ordersByDaySeries = analyticsDefaultProps.ordersByDaySeries,
  conversionFunnel = analyticsDefaultProps.conversionFunnel,
  topProducts = analyticsDefaultProps.topProducts,
}: AnalyticsProps) {
  const pageLayoutProps = {
    ...(breadcrumb ? { breadcrumb } : {}),
  }

  const pageActionProps = {
    ...(onDateRangeChange ? { onDateRangeChange } : {}),
    ...(onExport ? { onExport } : {}),
  }

  return (
    <ConsolePageLayout
      title={title}
      description={description}
      {...pageLayoutProps}
      actions={
        <AnalyticsPageActions
          dateRange={dateRange}
          dateRangeOptions={dateRangeOptions}
          exportHref={exportHref}
          {...pageActionProps}
        />
      }
      mainClassName="space-y-5"
    >
      <div className="space-y-4">
        <MetricsSection metrics={metrics} />

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.95fr)_minmax(0,0.95fr)]">
          <RevenueTrendSection revenueSeries={revenueSeries} />
          <TrafficSourcesSection trafficSources={trafficSources} />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <OrdersByDaySection ordersByDaySeries={ordersByDaySeries} />
          <ConversionFunnelSection conversionFunnel={conversionFunnel} />
        </section>

        <TopProductsSection topProducts={topProducts} />
      </div>
    </ConsolePageLayout>
  )
}
