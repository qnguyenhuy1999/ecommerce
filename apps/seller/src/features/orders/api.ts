import {
  getOrderDetail as getOrderDetailBase,
  getOrdersList,
  updateOrderStatus,
} from '../integration/seller-page-api'

export async function getOrderDetail(orderId: string) {
  const order = await getOrderDetailBase(orderId)

  if (!order) {
    return null
  }

  return 'id' in order ? order : order.items
}

export { getOrdersList, updateOrderStatus }
