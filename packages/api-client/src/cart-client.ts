// TODO: implement
import { getApiClient } from './client';

export const cartClient = {
  get: async () => {
    const { data } = await getApiClient().get('/cart');
    return data;
  },

  addItem: async (variantId: string, quantity: number) => {
    const { data } = await getApiClient().post('/cart/items', { variantId, quantity });
    return data;
  },

  updateItem: async (itemId: string, quantity: number) => {
    const { data } = await getApiClient().patch(`/cart/items/${itemId}`, { quantity });
    return data;
  },

  removeItem: async (itemId: string) => {
    await getApiClient().delete(`/cart/items/${itemId}`);
  },

  clear: async () => {
    await getApiClient().delete('/cart');
  },
};
