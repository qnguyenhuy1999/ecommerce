import type { CampaignStatus } from './Campaigns.types'

export const CAMPAIGN_STATUS_DOT_CLASS: Record<CampaignStatus, string> = {
  DRAFT: 'bg-muted-foreground',
  ACTIVE: 'bg-success',
  PAUSED: 'bg-info',
  EXPIRED: 'bg-muted-foreground',
}

export const CAMPAIGN_STATUS_LABEL_CLASS: Record<CampaignStatus, string> = {
  DRAFT: 'text-muted-foreground',
  ACTIVE: 'text-success',
  PAUSED: 'text-info',
  EXPIRED: 'text-muted-foreground',
}

export const CAMPAIGN_STATUS_TEXT: Record<CampaignStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  PAUSED: 'Paused',
  EXPIRED: 'Expired',
}

export const CAMPAIGNS_EMPTY_MESSAGE = 'No campaigns in this tab.'
