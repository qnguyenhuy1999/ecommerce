import { createWarehouse, getWarehouses as getWarehousesBase } from '../integration/seller-page-api'

export async function getWarehouses(init?: RequestInit) {
  const warehouses = await getWarehousesBase(init)
  return warehouses.items
}

export { createWarehouse }
