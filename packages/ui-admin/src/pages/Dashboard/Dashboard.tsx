import { Button } from '@ecom/core-ui/atoms/Button'
import { ConsolePageLayout } from '@ecom/core-ui/layouts/ConsolePageLayout'
import { RevenueCard } from './Dashboard.client'
import { dashboardDefaultProps } from './Dashboard.fixtures'
import {
  AuditEventsCard,
  CampaignsCard,
  DashboardFooter,
  DisputeQueueCard,
  MetricsGrid,
  ModerationQueueCard,
  PendingApprovalsCard,
  SystemHealthCard,
} from './Dashboard.server'
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
          <Button asChild variant="outline" className="rounded-2xl">
            <a href={exportReportHref}>Export report</a>
          </Button>
          <Button asChild className="rounded-2xl">
            <a href={openQueueHref}>Open queue</a>
          </Button>
        </>
      }
      mainClassName="space-y-5"
    >
      <div className="space-y-5">
        <MetricsGrid metrics={metrics} />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.9fr)_minmax(22rem,1fr)]">
          <RevenueCard
            revenueSeries={revenueSeries}
            revenueValueLabel={revenueValueLabel}
            revenueTrendLabel={revenueTrendLabel}
          />

          <div className="space-y-4">
            <PendingApprovalsCard pendingApprovals={pendingApprovals} />
            <SystemHealthCard systemHealth={systemHealth} />
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <ModerationQueueCard moderationQueue={moderationQueue} />
          <DisputeQueueCard disputeQueue={disputeQueue} />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          <CampaignsCard campaigns={campaigns} />
          <AuditEventsCard auditEvents={auditEvents} />
        </div>

        <DashboardFooter />
      </div>
    </ConsolePageLayout>
  )
}
