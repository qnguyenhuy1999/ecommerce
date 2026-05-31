import { SellerListPage } from '../../organisms'
import { CampaignsClient } from './Campaigns.client'
import { campaignsDefaultProps } from './Campaigns.fixtures'
import type { CampaignsProps } from './Campaigns.types'

export function Campaigns({
  title = campaignsDefaultProps.title,
  description = campaignsDefaultProps.description,
  newCampaignLabel = campaignsDefaultProps.newCampaignLabel,
  budgetLabel = campaignsDefaultProps.budgetLabel,
  editLabel = campaignsDefaultProps.editLabel,
  performanceLabel = campaignsDefaultProps.performanceLabel,
  impressionsLabel = campaignsDefaultProps.impressionsLabel,
  ctrLabel = campaignsDefaultProps.ctrLabel,
  redemptionsLabel = campaignsDefaultProps.redemptionsLabel,
  tabLabels = campaignsDefaultProps.tabLabels,
  items = campaignsDefaultProps.items,
  onNewCampaign = campaignsDefaultProps.onNewCampaign,
  onEdit = campaignsDefaultProps.onEdit,
  onPerformance = campaignsDefaultProps.onPerformance,
}: CampaignsProps) {
  const normalizedItems = items ?? []
  const normalizedTabLabels = tabLabels ?? {}

  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Campaigns' }]}
      mainClassName="space-y-5"
    >
      <CampaignsClient
        newCampaignLabel={newCampaignLabel ?? 'New campaign'}
        budgetLabel={budgetLabel ?? 'Usage'}
        editLabel={editLabel ?? 'Edit'}
        performanceLabel={performanceLabel ?? 'Performance'}
        impressionsLabel={impressionsLabel ?? 'Impr'}
        ctrLabel={ctrLabel ?? 'CTR'}
        redemptionsLabel={redemptionsLabel ?? 'Redm'}
        tabLabels={normalizedTabLabels}
        items={normalizedItems}
        onNewCampaign={onNewCampaign}
        onEdit={onEdit}
        onPerformance={onPerformance}
      />
    </SellerListPage>
  )
}
