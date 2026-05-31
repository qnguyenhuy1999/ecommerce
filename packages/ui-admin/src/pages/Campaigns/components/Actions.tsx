'use client'

import { Button } from '@ecom/core-ui/atoms/Button'
import type { CampaignRecord, CampaignsProps } from '../Campaigns.types'

interface ActionsProps {
  item: CampaignRecord
  editLabel: string
  performanceLabel: string
  onEdit: CampaignsProps['onEdit'] | undefined
  onPerformance: CampaignsProps['onPerformance'] | undefined
}

export function Actions({
  item,
  editLabel,
  performanceLabel,
  onEdit,
  onPerformance,
}: ActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={() => void onEdit?.(item)}
      >
        {editLabel}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="flex-1"
        onClick={() => void onPerformance?.(item)}
      >
        {performanceLabel}
      </Button>
    </div>
  )
}
