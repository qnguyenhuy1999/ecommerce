import { RETURN_STATUS_TABS, returnStatusLabels } from './ReturnsRefunds.constants'
import type {
  ReturnRow,
  ReturnsRefundsFilterParams,
  ReturnsRefundsStatusTab,
} from './ReturnsRefunds.types'
export { buildReturnStatusCounts } from './ReturnsRefunds.constants'
export { createReturnsColumns } from './ReturnsRefunds.columns'

export function getReturnStatusLabel(status: ReturnsRefundsStatusTab) {
  return returnStatusLabels[status]
}

export function isReturnsRefundsStatusTab(value: string): value is ReturnsRefundsStatusTab {
  return RETURN_STATUS_TABS.some((tab) => tab === value)
}

export function filterReturnsBySearchAndStatus({
  returns,
  search,
  status,
}: ReturnsRefundsFilterParams): ReturnRow[] {
  const query = search.trim().toLowerCase()

  return returns.filter((item) => {
    const matchesStatus = status === 'ALL' || item.status === status
    const matchesSearch =
      query.length === 0 ||
      item.caseId.toLowerCase().includes(query) ||
      item.orderNumber.toLowerCase().includes(query) ||
      item.buyerName.toLowerCase().includes(query) ||
      item.reason.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })
}
