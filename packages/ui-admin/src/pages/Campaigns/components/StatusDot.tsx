import { cn } from '@ecom/shared/utils/cn'
import { CAMPAIGN_STATUS_DOT_CLASS } from '../Campaigns.constants'
import type { CampaignStatus } from '../Campaigns.types'

export function StatusDot({ status }: { status: CampaignStatus }) {
  return (
    <span className={cn('inline-block size-2 rounded-full', CAMPAIGN_STATUS_DOT_CLASS[status])} />
  )
}
