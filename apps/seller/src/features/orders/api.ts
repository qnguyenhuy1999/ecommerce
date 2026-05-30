import {
  getOrderDetail as getOrderDetailBase,
  getOrdersList as getOrdersListBase,
  updateOrderStatus,
} from '../integration/seller-page-api'

export async function getOrderDetail(orderId: string, init?: RequestInit) {
  const order = await getOrderDetailBase(orderId, init)

  if (!order) {
    return null
  }

  return 'id' in order ? order : order.items
}

export function getOrdersList(
  params: { page?: number; limit?: number; search?: string; status?: string } = {},
  init?: RequestInit,
) {
  return getOrdersListBase(params, init)
}

export { updateOrderStatus }
