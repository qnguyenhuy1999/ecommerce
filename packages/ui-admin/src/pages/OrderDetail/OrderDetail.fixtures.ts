import type { OrderDetailProps } from './OrderDetail.types'

export const orderDetailDefaultProps: OrderDetailProps = {
  loading: false,
  backHref: '/orders',
  forceCancelLabel: 'Force Cancel',
  forceCompleteLabel: 'Force Complete',
  order: {
    id: 'ord-1001-aaaa-bbbb-cccc',
    shortId: 'ord-1001…',
    status: 'PACKING',
    totalAmountLabel: '$75.00',
    sellerCount: 1,
    createdAtLabel: 'May 22, 2026, 10:00 AM',
    canForceCancel: true,
    canForceComplete: true,
    sellerOrders: [
      {
        id: 'so-001',
        shopName: 'Demo Shop',
        status: 'PACKING',
        subtotalLabel: '$75.00',
        shipment: {
          id: 'shp-001',
          status: 'IN_TRANSIT',
          trackingNumber: 'TRK123456',
        },
        items: [
          {
            id: 'item-001',
            productName: 'Wireless Headphones',
            quantity: 1,
            unitPriceLabel: '$50.00',
            totalPriceLabel: '$50.00',
          },
          {
            id: 'item-002',
            productName: 'Phone Case',
            quantity: 2,
            unitPriceLabel: '$12.50',
            totalPriceLabel: '$25.00',
          },
        ],
      },
    ],
  },
}
