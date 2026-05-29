import { createWarehouse, getWarehouses as getWarehousesBase } from '../integration/seller-page-api'

export async function getWarehouses() {
  const warehouses = await getWarehousesBase()
  return warehouses.items
}

export { createWarehouse }
