export const campaignStatuses = ['LIVE', 'SCHEDULED', 'ENDED', 'DRAFT'] as const

export type CampaignStatus = (typeof campaignStatuses)[number]

export interface CampaignRecord {
  id: string
  name: string
  type: string
  category: string
  dateRange: string
  status: CampaignStatus
  impressions: string
  ctr: string
  redemptions: string
  budgetSpent: string
  budgetTotal: string
  budgetPercent: number
}

export interface CampaignsProps {
  title?: string
  description?: string
  newCampaignLabel?: string
  budgetLabel?: string
  editLabel?: string
  performanceLabel?: string
  impressionsLabel?: string
  ctrLabel?: string
  redemptionsLabel?: string
  tabLabels?: Partial<Record<CampaignStatus, string>>
  items?: CampaignRecord[]
  onNewCampaign?: (() => void | Promise<void>) | undefined
  onEdit?: ((item: CampaignRecord) => void | Promise<void>) | undefined
  onPerformance?: ((item: CampaignRecord) => void | Promise<void>) | undefined
}
