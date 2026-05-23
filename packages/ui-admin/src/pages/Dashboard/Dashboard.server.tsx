import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatCard,
  Typography,
} from '@ecom/core-ui'
import { Activity, ArrowRight, Circle, Megaphone, ShieldCheck } from 'lucide-react'
import {
  dashboardActionClassName,
  dashboardCardClassName,
  getCampaignToneClassName,
  getDisputeToneClassNames,
  warningBadgeClassName,
} from './Dashboard.constants'
import type { DashboardProps } from './Dashboard.types'

type DashboardServerProps = {
  metrics: NonNullable<DashboardProps['metrics']>
  revenueSeries: NonNullable<DashboardProps['revenueSeries']>
  revenueValueLabel: string
  revenueTrendLabel: string
  pendingApprovals: NonNullable<DashboardProps['pendingApprovals']>
  systemHealth: NonNullable<DashboardProps['systemHealth']>
  moderationQueue: NonNullable<DashboardProps['moderationQueue']>
  disputeQueue: NonNullable<DashboardProps['disputeQueue']>
  campaigns: NonNullable<DashboardProps['campaigns']>
  auditEvents: NonNullable<DashboardProps['auditEvents']>
}

export function SystemHealthStatus({ status }: { status: 'Operational' | 'Degraded' }) {
  return (
    <span className={status === 'Operational' ? 'text-muted-foreground' : 'text-warning'}>
      {status}
    </span>
  )
}

export function MetricsGrid({ metrics }: Pick<DashboardServerProps, 'metrics'>) {
  return (
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
  )
}

export function PendingApprovalsCard({
  pendingApprovals,
}: Pick<DashboardServerProps, 'pendingApprovals'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl">Pending approvals</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {pendingApprovals.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 border-b px-5 py-4 last:border-b-0 sm:px-6"
          >
            <div className="bg-warning/12 text-warning flex size-11 shrink-0 items-center justify-center rounded-2xl">
              <ShieldCheck className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{item.label}</div>
            </div>
            <Badge variant="secondary" className={warningBadgeClassName}>
              {item.countLabel}
            </Badge>
            <ArrowRight className="text-muted-foreground size-4 shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function SystemHealthCard({ systemHealth }: Pick<DashboardServerProps, 'systemHealth'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <div className="space-y-1">
          <CardTitle className="text-xl">System health</CardTitle>
          <Typography variant="body-sm" className="text-muted-foreground">
            Live status
          </Typography>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {systemHealth.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b px-5 py-4 text-sm last:border-b-0 sm:px-6"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Circle
                className={
                  item.status === 'Operational'
                    ? 'text-success size-3 fill-current'
                    : 'text-warning size-3 fill-current'
                }
              />
              <span className="truncate font-medium">{item.label}</span>
              <SystemHealthStatus status={item.status} />
            </div>
            <span className="text-muted-foreground">{item.uptimeLabel}</span>
            <span className="text-muted-foreground text-right">{item.latencyLabel}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ModerationQueueCard({
  moderationQueue,
}: Pick<DashboardServerProps, 'moderationQueue'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl">Moderation queue</CardTitle>
        <Button variant="ghost" size="sm" className={dashboardActionClassName}>
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {moderationQueue.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[minmax(0,1.2fr)_auto_auto] items-center gap-3 border-b px-5 py-4 last:border-b-0 sm:px-6"
          >
            <div className="truncate font-medium">{item.sellerName}</div>
            <div className="text-muted-foreground text-sm">{item.stateLabel}</div>
            <div className="flex items-center gap-3 justify-self-end">
              <Badge variant="secondary" className={warningBadgeClassName}>
                {item.tagLabel}
              </Badge>
              <span className="text-muted-foreground text-sm">{item.dateLabel}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DisputeQueueCard({ disputeQueue }: Pick<DashboardServerProps, 'disputeQueue'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl">Dispute queue</CardTitle>
        <Button variant="ghost" size="sm" className={dashboardActionClassName}>
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {disputeQueue.map((item) => {
          const tone = getDisputeToneClassNames(item.tone)

          return (
            <div
              key={item.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 border-b px-5 py-4 last:border-b-0 sm:px-6"
            >
              <Circle className={`size-3 fill-current ${tone.dot}`} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{item.ticket}</span>
                  <span className="text-muted-foreground truncate">{item.counterparties}</span>
                </div>
              </div>
              <Badge variant="outline" className={`rounded-full border ${tone.badge}`}>
                {item.stateLabel}
              </Badge>
              <span className="text-primary text-right font-semibold">{item.amountLabel}</span>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export function CampaignsCard({ campaigns }: Pick<DashboardServerProps, 'campaigns'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <CardTitle className="text-xl">Active campaigns</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-5 sm:px-6">
        {campaigns.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground flex size-11 shrink-0 items-center justify-center rounded-2xl">
              <Megaphone className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium">{item.name}</div>
              <div className="text-muted-foreground text-sm">{item.detail}</div>
            </div>
            <Badge variant="secondary" className={getCampaignToneClassName(item.tone)}>
              {item.statusLabel}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function AuditEventsCard({ auditEvents }: Pick<DashboardServerProps, 'auditEvents'>) {
  return (
    <Card className={dashboardCardClassName}>
      <CardHeader className="border-b px-5 py-4 sm:px-6">
        <div className="space-y-1">
          <CardTitle className="text-xl">Recent audit events</CardTitle>
          <Typography variant="body-sm" className="text-muted-foreground">
            Live, last 24h
          </Typography>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5 py-5 sm:px-6">
        {auditEvents.map((item) => (
          <div key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3">
            <div className="pt-1">
              <div className="border-warning/25 flex size-4 items-center justify-center rounded-full border">
                <div className="bg-primary size-2 rounded-full" />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-sm">
                <span className="font-semibold">{item.actor}</span>
                <span className="text-muted-foreground"> {item.action} </span>
                <span className="font-semibold">{item.subject}</span>
              </div>
              {item.detail ? (
                <div className="text-muted-foreground text-sm">{item.detail}</div>
              ) : null}
            </div>
            <div className="text-muted-foreground text-sm">{item.dateLabel}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DashboardFooter() {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <Activity className="size-4" />
      <span>Logged in as Ops Admin | 3 active admins | 24 orders today</span>
    </div>
  )
}
