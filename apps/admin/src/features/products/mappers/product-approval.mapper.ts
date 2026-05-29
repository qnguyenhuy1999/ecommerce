import { formatDateIntl } from '@ecom/shared'
import type {
  ProductApprovalItem,
  ProductApprovalStatus,
  ProductApprovalStatusTab,
} from '@ecom/ui-admin'
import type { ProductListItem } from '../api/products.api'

function toApprovalStatus(status: string): ProductApprovalStatus {
  const map: Record<string, ProductApprovalStatus> = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    REPORTED: 'REPORTED',
    HIDDEN: 'APPROVED',
    ACTIVE: 'APPROVED',
  }
  return map[status] ?? 'PENDING'
}

export function mapProductToApprovalItem(product: ProductListItem): ProductApprovalItem {
  return {
    id: product.id,
    title: product.name,
    sellerName: product.shop.name,
    submittedAtLabel: formatDateIntl(product.createdAt),
    priceLabel: product.basePrice ? `$${Number(product.basePrice).toFixed(2)}` : '—',
    status: toApprovalStatus(product.status),
    flagsLabel: '',
    reasonTags: [],
    stockLabel: String(product.baseStock),
    soldLabel: '—',
    ratingLabel: '—',
    images: product.images.map((img, i) => ({
      id: String(i),
      src: img.url,
      alt: product.name,
    })),
  } satisfies ProductApprovalItem
}

export function buildProductStatusTabs(counts: Record<string, number>): ProductApprovalStatusTab[] {
  const statuses: ProductApprovalStatus[] = ['PENDING', 'REPORTED', 'APPROVED', 'REJECTED']
  return statuses.map((value) => ({
    value,
    label: value.charAt(0) + value.slice(1).toLowerCase(),
    count: counts[value] ?? 0,
  }))
}
