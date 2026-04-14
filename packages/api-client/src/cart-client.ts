// TODO: implement
import { getApiClient } from './client'

export const cartClient = {
  get: async (): Promise<unknown> => {
    const { data } = await getApiClient().get<unknown>('/cart')
    return data
  },

  addItem: async (variantId: string, quantity: number): Promise<unknown> => {
    const { data } = await getApiClient().post<unknown>('/cart/items', { variantId, quantity })
    return data
  },

  updateItem: async (itemId: string, quantity: number): Promise<unknown> => {
    const { data } = await getApiClient().patch<unknown>(`/cart/items/${itemId}`, { quantity })
    return data
  },

  removeItem: async (itemId: string): Promise<void> => {
    await getApiClient().delete(`/cart/items/${itemId}`)
  },

  clear: async (): Promise<void> => {
    await getApiClient().delete('/cart')
  },
}
