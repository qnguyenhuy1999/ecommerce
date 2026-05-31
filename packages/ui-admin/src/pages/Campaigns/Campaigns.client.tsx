'use client'

import { useCampaignsController } from './Campaigns.controller'
import type { CampaignRecord, CampaignStatus, CampaignsProps } from './Campaigns.types'
import { Empty } from './components/Empty'
import { Filters } from './components/Filters'
import { List } from './components/List'

export interface CampaignsClientProps {
  newCampaignLabel: string
  budgetLabel: string
  editLabel: string
  performanceLabel: string
  impressionsLabel: string
  ctrLabel: string
  redemptionsLabel: string
  tabLabels: Partial<Record<CampaignStatus, string>>
  items: CampaignRecord[]
  onNewCampaign: CampaignsProps['onNewCampaign'] | undefined
  onEdit: CampaignsProps['onEdit'] | undefined
  onPerformance: CampaignsProps['onPerformance'] | undefined
}

export function CampaignsClient({
  newCampaignLabel,
  budgetLabel,
  editLabel,
  performanceLabel,
  impressionsLabel,
  ctrLabel,
  redemptionsLabel,
  tabLabels,
  items,
  onNewCampaign,
  onEdit,
  onPerformance,
}: CampaignsClientProps) {
  const { state, computed, handlers } = useCampaignsController({ items })

  return (
    <div className="space-y-6">
      <Filters
        activeTab={state.activeTab}
        counts={computed.counts}
        tabLabels={tabLabels}
        newCampaignLabel={newCampaignLabel}
        onTabChange={handlers.setActiveTab}
        onNewCampaign={computed.filtered.length > 0 ? onNewCampaign : undefined}
      />

      {computed.filtered.length === 0 ? (
        <Empty newCampaignLabel={newCampaignLabel} onNewCampaign={onNewCampaign} />
      ) : (
        <List
          items={computed.filtered}
          budgetLabel={budgetLabel}
          editLabel={editLabel}
          performanceLabel={performanceLabel}
          impressionsLabel={impressionsLabel}
          ctrLabel={ctrLabel}
          redemptionsLabel={redemptionsLabel}
          onEdit={onEdit}
          onPerformance={onPerformance}
        />
      )}
    </div>
  )
}
