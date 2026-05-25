import type {
  SellerKycRow,
  SellerKycStatus,
  SellerKycStatusTabOption,
  SellerKycDetailRecord,
  SellerKycDetailStatus,
  SellerKycDetailDocument,
} from '@ecom/ui-admin'
import type { Seller, SellerDetail } from '../api/sellers.api'

function toKycStatus(status: string): SellerKycStatus {
  const map: Record<string, SellerKycStatus> = {
    PENDING: 'PENDING',
    ACTIVE: 'APPROVED',
    APPROVED: 'APPROVED',
    SUSPENDED: 'SUSPENDED',
    REJECTED: 'REJECTED',
    BANNED: 'SUSPENDED',
  }
  return map[status] ?? 'PENDING'
}

function toKycDetailStatus(status: string): SellerKycDetailStatus {
  const map: Record<string, SellerKycDetailStatus> = {
    PENDING: 'PENDING',
    ACTIVE: 'APPROVED',
    APPROVED: 'APPROVED',
    SUSPENDED: 'REJECTED',
    REJECTED: 'REJECTED',
  }
  return map[status] ?? 'PENDING'
}

export function mapSellerToKycRow(seller: Seller): SellerKycRow {
  return {
    id: seller.id,
    vendorName: seller.shopName,
    vendorEmail: seller.user?.email ?? '—',
    ownerName: seller.user?.email ?? '—',
    category: seller.shopDescription ?? '—',
    productsCount: 0,
    gmv: 0,
    appliedAtLabel: new Date(seller.createdAt).toLocaleDateString(),
    status: toKycStatus(seller.status),
  } satisfies SellerKycRow
}

export function buildSellerKycStatusTabs(
  counts: Record<string, number>,
): SellerKycStatusTabOption[] {
  return [
    { value: 'ALL', label: 'All', count: Object.values(counts).reduce((a, b) => a + b, 0) },
    { value: 'PENDING', label: 'Pending', count: counts['PENDING'] ?? 0 },
    { value: 'APPROVED', label: 'Approved', count: counts['ACTIVE'] ?? counts['APPROVED'] ?? 0 },
    { value: 'REJECTED', label: 'Rejected', count: counts['REJECTED'] ?? 0 },
    { value: 'SUSPENDED', label: 'Suspended', count: counts['SUSPENDED'] ?? 0 },
  ]
}

export function mapSellerDetailToKycDetail(seller: SellerDetail): SellerKycDetailRecord {
  const documents: SellerKycDetailDocument[] = seller.verifications.map((v) => ({
    id: v.id,
    title: v.documentType,
    uploadedAtLabel: new Date(v.createdAt).toLocaleDateString(),
    typeLabel: v.documentType,
    previewSrc: v.documentUrl,
    previewAlt: v.documentType,
    status: toKycDetailStatus(v.status),
  }))

  const approvedCount = documents.filter((d) => d.status === 'APPROVED').length

  return {
    id: seller.id,
    sellerName: seller.shopName,
    ownerName: seller.user?.email ?? '—',
    ownerEmail: seller.user?.email ?? '—',
    appliedAtLabel: new Date(seller.createdAt).toLocaleDateString(),
    status: toKycDetailStatus(seller.status),
    tabs: [
      { value: 'KYC_REVIEW', label: 'KYC Review' },
      { value: 'VIOLATIONS', label: 'Violations' },
      { value: 'PROFILE', label: 'Profile' },
    ],
    applicant: [
      { label: 'Shop Name', value: seller.shopName },
      { label: 'Email', value: seller.user?.email ?? '—' },
      { label: 'Phone', value: seller.phone ?? '—' },
      { label: 'Address', value: seller.address ?? '—' },
    ],
    bankName: '—',
    bankAccountLabel: '—',
    riskScore: 0,
    riskSummary: '—',
    documentsApprovedLabel: `${approvedCount} / ${documents.length} approved`,
    documents,
    approvalHint: 'Review all documents before approving.',
    auditTrail: [],
  } satisfies SellerKycDetailRecord
}
