import type { Accent, StatSparkPoint } from '@ecom/core-ui/molecules/StatCard'

export interface DashboardMetric {
  label: string
  value: string | number
  trend?: number
  spark?: StatSparkPoint[]
  accent?: Accent
}

export interface RevenuePoint {
  label: string
  revenue: number
}

export interface PendingApprovalItem {
  id: string
  label: string
  countLabel: string
}

export interface SystemHealthItem {
  id: string
  label: string
  status: 'Operational' | 'Degraded'
  uptimeLabel: string
  latencyLabel: string
}

export interface ModerationQueueItem {
  id: string
  sellerName: string
  stateLabel: string
  tagLabel: string
  dateLabel: string
}

export type DashboardTone = 'info' | 'warning' | 'destructive' | 'success' | 'muted'

export interface DisputeQueueItem {
  id: string
  ticket: string
  counterparties: string
  stateLabel: string
  amountLabel: string
  tone: DashboardTone
}

export interface CampaignItem {
  id: string
  name: string
  detail: string
  statusLabel: string
  tone: 'info' | 'success'
}

export interface AuditEventItem {
  id: string
  actor: string
  action: string
  subject: string
  detail?: string
  dateLabel: string
}

export interface DashboardProps {
  title?: string
  description?: string
  exportReportHref?: string
  openQueueHref?: string
  metrics?: DashboardMetric[]
  revenueSeries?: RevenuePoint[]
  revenueValueLabel?: string
  revenueTrendLabel?: string
  pendingApprovals?: PendingApprovalItem[]
  systemHealth?: SystemHealthItem[]
  moderationQueue?: ModerationQueueItem[]
  disputeQueue?: DisputeQueueItem[]
  campaigns?: CampaignItem[]
  auditEvents?: AuditEventItem[]
}

export interface NormalizedDashboardProps {
  title: string
  description: string
  exportReportHref: string
  openQueueHref: string
  metrics: DashboardMetric[]
  revenueSeries: RevenuePoint[]
  revenueValueLabel: string
  revenueTrendLabel: string
  pendingApprovals: PendingApprovalItem[]
  systemHealth: SystemHealthItem[]
  moderationQueue: ModerationQueueItem[]
  disputeQueue: DisputeQueueItem[]
  campaigns: CampaignItem[]
  auditEvents: AuditEventItem[]
}
