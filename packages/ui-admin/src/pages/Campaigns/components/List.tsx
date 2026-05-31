import type { CampaignRecord, CampaignsProps } from '../Campaigns.types'
import { Item } from './Item'

interface ListProps {
  items: CampaignRecord[]
  budgetLabel: string
  editLabel: string
  performanceLabel: string
  impressionsLabel: string
  ctrLabel: string
  redemptionsLabel: string
  onEdit: CampaignsProps['onEdit'] | undefined
  onPerformance: CampaignsProps['onPerformance'] | undefined
}

export function List(props: ListProps) {
  const { items, ...itemProps } = props

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Item key={item.id} item={item} {...itemProps} />
      ))}
    </div>
  )
}
