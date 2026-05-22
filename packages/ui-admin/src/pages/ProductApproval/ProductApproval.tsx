import { ConsolePageLayout } from '@ecom/core-ui'
import { productApprovalDefaultProps } from './ProductApproval.fixtures'
import { ProductApprovalClient } from './ProductApproval.client'
import type { ProductApprovalProps } from './ProductApproval.types'

export function ProductApproval({
  title = productApprovalDefaultProps.title,
  description = productApprovalDefaultProps.description,
  searchPlaceholder = productApprovalDefaultProps.searchPlaceholder,
  approveLabel = productApprovalDefaultProps.approveLabel,
  rejectLabel = productApprovalDefaultProps.rejectLabel,
  approveDialogTitle = productApprovalDefaultProps.approveDialogTitle,
  approveDialogDescription = productApprovalDefaultProps.approveDialogDescription,
  rejectDialogTitle = productApprovalDefaultProps.rejectDialogTitle,
  rejectDialogDescription = productApprovalDefaultProps.rejectDialogDescription,
  reasonLabel = productApprovalDefaultProps.reasonLabel,
  reasonPlaceholder = productApprovalDefaultProps.reasonPlaceholder,
  reasonHint = productApprovalDefaultProps.reasonHint,
  items = productApprovalDefaultProps.items,
  statusTabs = productApprovalDefaultProps.statusTabs,
  onApprove = productApprovalDefaultProps.onApprove,
  onReject = productApprovalDefaultProps.onReject,
}: ProductApprovalProps) {
  return (
    <ConsolePageLayout
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Products' }]}
      mainClassName="space-y-5"
    >
      <ProductApprovalClient
        searchPlaceholder={searchPlaceholder ?? ''}
        approveLabel={approveLabel ?? 'Approve'}
        rejectLabel={rejectLabel ?? 'Reject'}
        approveDialogTitle={approveDialogTitle ?? 'Approve listing(s)'}
        approveDialogDescription={approveDialogDescription ?? ''}
        rejectDialogTitle={rejectDialogTitle ?? 'Reject listing(s)'}
        rejectDialogDescription={rejectDialogDescription ?? ''}
        reasonLabel={reasonLabel ?? 'Reason'}
        reasonPlaceholder={reasonPlaceholder ?? ''}
        reasonHint={reasonHint ?? ''}
        items={items ?? []}
        statusTabs={statusTabs ?? []}
        onApprove={onApprove}
        onReject={onReject}
      />
    </ConsolePageLayout>
  )
}
