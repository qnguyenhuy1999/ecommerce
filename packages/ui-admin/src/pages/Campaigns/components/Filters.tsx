import { Button } from '@ecom/core-ui/atoms/Button'
import { cn } from '@ecom/shared/utils/cn'
import { Plus } from 'lucide-react'
import type { CampaignsProps } from '../Campaigns.types'
import { campaignStatuses, type CampaignStatus } from '../Campaigns.types'

interface FiltersProps {
  activeTab: CampaignStatus
  counts: Record<CampaignStatus, number>
  tabLabels: Partial<Record<CampaignStatus, string>>
  newCampaignLabel: string
  onTabChange: (status: CampaignStatus) => void
  onNewCampaign: CampaignsProps['onNewCampaign'] | undefined
}

export function Filters({
  activeTab,
  counts,
  tabLabels,
  newCampaignLabel,
  onTabChange,
  onNewCampaign,
}: FiltersProps) {
  return (
    <div className="border-border flex items-center justify-between border-b">
      <div className="flex">
        {campaignStatuses.map((status) => {
          const isActive = activeTab === status

          return (
            <button
              key={status}
              type="button"
              onClick={() => onTabChange(status)}
              className={cn(
                'relative -mb-px inline-flex items-center gap-1.5 px-4 pt-2 pb-3 text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary text-foreground border-b-2'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tabLabels[status] ?? status}
              <span
                className={cn(
                  'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs',
                  isActive ? 'bg-primary-soft text-primary-deep' : 'bg-muted text-muted-foreground',
                )}
              >
                {counts[status]}
              </span>
            </button>
          )
        })}
      </div>

      {onNewCampaign && (
        <Button type="button" onClick={() => void onNewCampaign?.()}>
          <Plus className="size-4" />
          {newCampaignLabel}
        </Button>
      )}
    </div>
  )
}
