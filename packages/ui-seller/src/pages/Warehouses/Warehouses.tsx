import { WarehousesClient } from './Warehouses.client'
import type { WarehousesProps } from './Warehouses.types'

export function Warehouses(props: WarehousesProps = {}) {
  return <WarehousesClient {...props} />
}
