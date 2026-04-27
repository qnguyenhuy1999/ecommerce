import type { OrderDetailSectionProps } from '../../../organisms/OrderDetailSection/OrderDetailSection'
import { OrderDetailSubOrderCard } from './OrderDetailSubOrderCard'

export interface OrderDetailSubOrdersListProps {
  subOrders: OrderDetailSectionProps['subOrders']
}

export function OrderDetailSubOrdersList({ subOrders }: OrderDetailSubOrdersListProps) {
  return (
    <>
      {subOrders.map((subOrder) => (
        <OrderDetailSubOrderCard key={subOrder.id} subOrder={subOrder} />
      ))}
    </>
  )
}
