import { getApprovals as getApprovalsBase, resubmitApproval } from '../integration/seller-page-api'

export async function getApprovals(limit?: number) {
  const approvals = await getApprovalsBase(limit)
  return approvals.items
}

export { resubmitApproval }
