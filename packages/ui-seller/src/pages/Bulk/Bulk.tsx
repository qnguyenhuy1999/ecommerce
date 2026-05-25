import { BulkClient } from './Bulk.client'
import type { BulkProps } from './Bulk.types'

export function Bulk(props: BulkProps = {}) {
  return <BulkClient {...props} />
}
