import type { CampaignStatus } from './Campaigns.types'

export const CAMPAIGN_STATUS_DOT_CLASS: Record<CampaignStatus, string> = {
  LIVE: 'bg-success',
  SCHEDULED: 'bg-info',
  ENDED: 'bg-muted-foreground',
  DRAFT: 'bg-muted-foreground',
}

export const CAMPAIGN_STATUS_LABEL_CLASS: Record<CampaignStatus, string> = {
  LIVE: 'text-success',
  SCHEDULED: 'text-info',
  ENDED: 'text-muted-foreground',
  DRAFT: 'text-muted-foreground',
}

export const CAMPAIGN_STATUS_TEXT: Record<CampaignStatus, string> = {
  LIVE: 'Live',
  SCHEDULED: 'Scheduled',
  ENDED: 'Ended',
  DRAFT: 'Draft',
}

export const CAMPAIGNS_EMPTY_MESSAGE = 'No campaigns in this tab.'
