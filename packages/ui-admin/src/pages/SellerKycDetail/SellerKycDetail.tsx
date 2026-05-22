import { Badge, ConsolePageLayout } from '@ecom/core-ui'
import { sellerKycDetailDefaultProps } from './SellerKycDetail.fixtures'
import { SellerKycDetailClient } from './SellerKycDetail.client'
import type { SellerKycDetailProps, SellerKycDetailStatus } from './SellerKycDetail.types'

function getStatusTone(status: SellerKycDetailStatus): 'approved' | 'warning' | 'rejected' {
  switch (status) {
    case 'APPROVED':
      return 'approved'
    case 'REJECTED':
      return 'rejected'
    case 'PENDING':
    default:
      return 'warning'
  }
}

function formatStatusLabel(status: SellerKycDetailStatus) {
  switch (status) {
    case 'APPROVED':
      return 'Approved'
    case 'REJECTED':
      return 'Rejected'
    case 'PENDING':
    default:
      return 'Pending'
  }
}

export function SellerKycDetail({
  item = sellerKycDetailDefaultProps.item,
  backHref = sellerKycDetailDefaultProps.backHref,
  approveDocumentLabel = sellerKycDetailDefaultProps.approveDocumentLabel,
  rejectDocumentLabel = sellerKycDetailDefaultProps.rejectDocumentLabel,
  requestNewLabel = sellerKycDetailDefaultProps.requestNewLabel,
  rejectSellerLabel = sellerKycDetailDefaultProps.rejectSellerLabel,
  approveSellerLabel = sellerKycDetailDefaultProps.approveSellerLabel,
  onApproveDocument = sellerKycDetailDefaultProps.onApproveDocument,
  onRejectDocument = sellerKycDetailDefaultProps.onRejectDocument,
  onRequestNewDocument = sellerKycDetailDefaultProps.onRequestNewDocument,
  onRejectSeller = sellerKycDetailDefaultProps.onRejectSeller,
  onApproveSeller = sellerKycDetailDefaultProps.onApproveSeller,
}: SellerKycDetailProps) {
  if (!item) {
    return null
  }

  return (
    <ConsolePageLayout
      title={item.sellerName}
      description={`Owner ${item.ownerName} · ${item.ownerEmail} · applied ${item.appliedAtLabel}`}
      breadcrumb={[
        { label: 'Admin', href: '#' },
        backHref ? { label: 'Sellers', href: backHref } : { label: 'Sellers' },
        { label: item.sellerName },
      ]}
      actions={
        <Badge tone={getStatusTone(item.status)} size="lg">
          {formatStatusLabel(item.status)}
        </Badge>
      }
      mainClassName="space-y-6"
    >
      <SellerKycDetailClient
        item={item}
        approveDocumentLabel={approveDocumentLabel ?? 'Approve'}
        rejectDocumentLabel={rejectDocumentLabel ?? 'Reject'}
        requestNewLabel={requestNewLabel ?? 'Request new'}
        rejectSellerLabel={rejectSellerLabel ?? 'Reject'}
        approveSellerLabel={approveSellerLabel ?? 'Approve seller'}
        onApproveDocument={onApproveDocument}
        onRejectDocument={onRejectDocument}
        onRequestNewDocument={onRequestNewDocument}
        onRejectSeller={onRejectSeller}
        onApproveSeller={onApproveSeller}
      />
    </ConsolePageLayout>
  )
}
