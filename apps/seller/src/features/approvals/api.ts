import { getApprovals as getApprovalsBase, resubmitApproval } from '../integration/seller-page-api'

export async function getApprovals(limit?: number, init?: RequestInit) {
  const approvals = await getApprovalsBase(limit, init)
  return approvals.items
}

export { resubmitApproval }
