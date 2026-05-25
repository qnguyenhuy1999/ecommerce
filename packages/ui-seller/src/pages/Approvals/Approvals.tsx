import { ApprovalsClient } from './Approvals.client'
import type { ApprovalsProps } from './Approvals.types'

export function Approvals(props: ApprovalsProps = {}) {
  return <ApprovalsClient {...props} />
}
