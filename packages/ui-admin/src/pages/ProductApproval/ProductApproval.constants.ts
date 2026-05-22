import type {
  ProductApprovalItem,
  ProductApprovalStatus,
  ProductApprovalStatusCounts,
  ProductApprovalStatusTab,
} from './ProductApproval.types'

export const productApprovalStatusToneClassNames = {
  PENDING: 'bg-muted text-muted-foreground',
  REPORTED: 'bg-warning/10 text-warning',
  APPROVED: 'bg-success/10 text-success',
  REJECTED: 'bg-destructive/10 text-destructive',
} as const satisfies Record<ProductApprovalStatus, string>

export function filterProductApprovalItems(
  items: ProductApprovalItem[],
  activeStatus: ProductApprovalStatus,
  search: string,
) {
  const query = search.trim().toLowerCase()

  return items.filter((item) => {
    const matchesStatus = item.status === activeStatus
    const matchesSearch =
      query.length === 0 ||
      item.title.toLowerCase().includes(query) ||
      item.sellerName.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })
}

export function buildProductApprovalStatusCounts(
  statusTabs: ProductApprovalStatusTab[],
): ProductApprovalStatusCounts {
  return statusTabs.reduce<ProductApprovalStatusCounts>(
    (accumulator, tab) => {
      accumulator[tab.value] = tab.count
      return accumulator
    },
    {
      PENDING: 0,
      REPORTED: 0,
      APPROVED: 0,
      REJECTED: 0,
    },
  )
}

export function areSelectedIdsEqual(current: string[], next: string[]) {
  return current.length === next.length && current.every((id, index) => id === next[index])
}
