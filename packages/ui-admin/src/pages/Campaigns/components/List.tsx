import type { VoucherRecord, VouchersProps } from '../Campaigns.types'
import { Item } from './Item'

interface ListProps {
  items: VoucherRecord[]
  budgetLabel: string
  editLabel: string
  performanceLabel: string
  impressionsLabel: string
  ctrLabel: string
  redemptionsLabel: string
  onEdit: VouchersProps['onEdit'] | undefined
  onPerformance: VouchersProps['onPerformance'] | undefined
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
