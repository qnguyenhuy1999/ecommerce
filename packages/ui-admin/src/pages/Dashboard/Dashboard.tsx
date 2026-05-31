import { Button } from '@ecom/core-ui/atoms/Button'
import { ConsolePageLayout } from '@ecom/core-ui/layouts/ConsolePageLayout'
import { AuditEventsSection } from './components/sections/AuditEventsSection'
import { CampaignsSection } from './components/sections/CampaignsSection'
import { DisputeQueueSection } from './components/sections/DisputeQueueSection'
import { ModerationQueueSection } from './components/sections/ModerationQueueSection'
import { PendingApprovalsSection } from './components/sections/PendingApprovalsSection'
import { SystemHealthSection } from './components/sections/SystemHealthSection'
import { RevenueCard } from './Dashboard.client'
import { dashboardDefaultProps } from './Dashboard.fixtures'
import { DashboardFooter, MetricsGrid } from './Dashboard.server'
import type { DashboardProps } from './Dashboard.types'

export function Dashboard({
  title = dashboardDefaultProps.title,
  description = dashboardDefaultProps.description,
  exportReportHref = dashboardDefaultProps.exportReportHref,
  openQueueHref = dashboardDefaultProps.openQueueHref,
  metrics = dashboardDefaultProps.metrics,
  revenueSeries = dashboardDefaultProps.revenueSeries,
  revenueValueLabel = dashboardDefaultProps.revenueValueLabel,
  revenueTrendLabel = dashboardDefaultProps.revenueTrendLabel,
  pendingApprovals = dashboardDefaultProps.pendingApprovals,
  systemHealth = dashboardDefaultProps.systemHealth,
  moderationQueue = dashboardDefaultProps.moderationQueue,
  disputeQueue = dashboardDefaultProps.disputeQueue,
  campaigns = dashboardDefaultProps.campaigns,
  auditEvents = dashboardDefaultProps.auditEvents,
}: DashboardProps) {
  return (
    <ConsolePageLayout
      title={title}
      description={description}
      actions={
        <>
          <Button asChild variant="outline">
            <a href={exportReportHref}>Export report</a>
          </Button>
          <Button asChild>
            <a href={openQueueHref}>Open queue</a>
          </Button>
        </>
      }
      mainClassName="space-y-6"
    >
      <MetricsGrid metrics={metrics} />

      <RevenueCard
        revenueSeries={revenueSeries}
        revenueValueLabel={revenueValueLabel}
        revenueTrendLabel={revenueTrendLabel}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <div className="space-y-6">
          <PendingApprovalsSection items={pendingApprovals} />
          <ModerationQueueSection items={moderationQueue} />
          <DisputeQueueSection items={disputeQueue} />
          <AuditEventsSection items={auditEvents} />
        </div>
        <div className="space-y-6">
          <SystemHealthSection items={systemHealth} />
          <CampaignsSection items={campaigns} />
        </div>
      </div>

      <DashboardFooter />
    </ConsolePageLayout>
  )
}
