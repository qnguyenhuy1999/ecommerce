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
    totalAmountLabel: `$${Number(order.totalAmount).toFixed(2)}`,
    sellerCount: order.sellerOrders.length,
    itemCount,
    createdAtLabel: new Date(order.createdAt).toLocaleDateString(),
  }
}

export function mapOrderToDetailRecord(order: OrderDetail): OrderDetailRecord {
  const canEnd = !['CANCELLED', 'DELIVERED'].includes(order.status)
  return {
    id: order.id,
    shortId: `${order.id.slice(0, 8)}…`,
    status: order.status,
    totalAmountLabel: `$${Number(order.totalAmount).toFixed(2)}`,
    sellerCount: order.sellerOrders.length,
    createdAtLabel: new Date(order.createdAt).toLocaleString(),
    canForceCancel: canEnd,
    canForceComplete: canEnd,
    sellerOrders: order.sellerOrders.map((so) => ({
      id: so.id,
      shopName: so.shop.name,
      status: so.status,
      subtotalLabel: `$${Number(so.subtotal).toFixed(2)}`,
      items: so.items.map((item) => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        unitPriceLabel: `$${Number(item.unitPrice).toFixed(2)}`,
        totalPriceLabel: `$${Number(item.totalPrice).toFixed(2)}`,
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
