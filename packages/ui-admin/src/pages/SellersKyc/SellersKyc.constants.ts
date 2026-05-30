import { formatCurrency } from '@ecom/shared/utils/format'
import type {
  SellerKycRow,
  SellerKycStatus,
  SellerKycStatusCounts,
  SellerKycStatusTab,
  SellerKycStatusTabOption,
} from './SellersKyc.types'

export const sellerKycStatusLabels = {
  ALL: 'All',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  SUSPENDED: 'Suspended',
} as const satisfies Record<SellerKycStatusTab, string>

export const sellerKycStatusToneClassNames = {
  PENDING: {
    badge: 'bg-warning/10 text-warning',
    dot: 'bg-warning',
  },
  APPROVED: {
    badge: 'bg-success/10 text-success',
    dot: 'bg-success',
  },
  SUSPENDED: {
    badge: 'bg-destructive/10 text-destructive',
    dot: 'bg-destructive',
  },
} as const satisfies Record<SellerKycStatus, { badge: string; dot: string }>

export function formatSellerKycGmv(value: number) {
  return formatCurrency(value, { fractionDigits: 0 })
}

export function buildSellerKycStatusCounts(
  items: SellerKycRow[],
  statusTabs?: SellerKycStatusTabOption[],
): SellerKycStatusCounts {
  if (statusTabs && statusTabs.length > 0) {
    return statusTabs.reduce<SellerKycStatusCounts>(
      (accumulator, tab) => {
        accumulator[tab.value] = tab.count
        return accumulator
      },
      {
        ALL: 0,
        PENDING: 0,
        APPROVED: 0,
        SUSPENDED: 0,
      },
    )
  }

  return items.reduce<SellerKycStatusCounts>(
    (accumulator, item) => {
      accumulator.ALL += 1
      accumulator[item.status] += 1
      return accumulator
    },
    {
      ALL: 0,
      PENDING: 0,
      APPROVED: 0,
      SUSPENDED: 0,
    },
  )
}

export function filterSellerKycItems(
  items: SellerKycRow[],
  activeStatus: SellerKycStatusTab,
  search: string,
) {
  const query = search.trim().toLowerCase()

  return items.filter((item) => {
    const matchesStatus = activeStatus === 'ALL' || item.status === activeStatus
    const matchesSearch =
      query.length === 0 ||
      item.vendorName.toLowerCase().includes(query) ||
      item.vendorEmail.toLowerCase().includes(query) ||
      item.ownerName.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })
}
