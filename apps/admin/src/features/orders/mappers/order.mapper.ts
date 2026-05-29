import { formatCurrency, formatDateIntl, formatDateTime } from '@ecom/shared'
import type {
  OrderDetailRecord,
  OrderRecord,
  OrderStatusTabOption,
  OrderStatusTab,
} from '@ecom/ui-admin'
import type { OrderDetail, OrderListItem } from '../api/orders.api'

export function mapOrderToRecord(order: OrderListItem): OrderRecord {
  const itemCount = order.sellerOrders.reduce((acc, so) => acc + so._count.items, 0)
  return {
    id: order.id,
    status: order.status as OrderRecord['status'],
    totalAmountLabel: formatCurrency(Number(order.totalAmount)),
    sellerCount: order.sellerOrders.length,
    itemCount,
    createdAtLabel: formatDateIntl(order.createdAt),
  }
}

export function mapOrderToDetailRecord(order: OrderDetail): OrderDetailRecord {
  const canEnd = !['CANCELLED', 'DELIVERED'].includes(order.status)
  return {
    id: order.id,
    shortId: `${order.id.slice(0, 8)}…`,
    status: order.status,
    totalAmountLabel: formatCurrency(Number(order.totalAmount)),
    sellerCount: order.sellerOrders.length,
    createdAtLabel: formatDateTime(order.createdAt),
    canForceCancel: canEnd,
    canForceComplete: canEnd,
    sellerOrders: order.sellerOrders.map((so) => ({
      id: so.id,
      shopName: so.shop.name,
      status: so.status,
      subtotalLabel: formatCurrency(Number(so.subtotal)),
      items: so.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        unitPriceLabel: formatCurrency(Number(item.unitPrice)),
        totalPriceLabel: formatCurrency(Number(item.totalPrice)),
      })),
      shipment: so.shipment,
    })),
  }
}

export function buildOrderStatusTabs(counts: Record<string, number>): OrderStatusTabOption[] {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const tabs: Array<{ value: OrderStatusTab; label: string }> = [
    { value: 'ALL', label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PACKING', label: 'Packing' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]
  return tabs.map(({ value, label }) => ({
    value,
    label,
    count: value === 'ALL' ? total : (counts[value] ?? 0),
  }))
}
