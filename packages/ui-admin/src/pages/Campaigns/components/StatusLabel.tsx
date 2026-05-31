import { Typography } from '@ecom/core-ui/atoms/Typography'
import { cn } from '@ecom/shared/utils/cn'
import { CAMPAIGN_STATUS_LABEL_CLASS, CAMPAIGN_STATUS_TEXT } from '../Campaigns.constants'
import type { CampaignStatus } from '../Campaigns.types'

export function StatusLabel({ status }: { status: CampaignStatus }) {
  return (
    <Typography
      variant="caption"
      className={cn('font-medium', CAMPAIGN_STATUS_LABEL_CLASS[status])}
    >
      {CAMPAIGN_STATUS_TEXT[status]}
    </Typography>
  )
}
