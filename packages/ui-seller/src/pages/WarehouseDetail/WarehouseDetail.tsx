import { WarehouseDetailClient } from './WarehouseDetail.client'
import type { WarehouseDetailProps } from './WarehouseDetail.types'

export function WarehouseDetail(props: WarehouseDetailProps = {}) {
  return <WarehouseDetailClient {...props} />
}
