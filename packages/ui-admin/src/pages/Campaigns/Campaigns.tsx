import { SellerListPage } from '../../organisms'
import { VouchersClient } from './Campaigns.client'
import { vouchersDefaultProps } from './Campaigns.fixtures'
import type { VouchersProps } from './Campaigns.types'

export function Vouchers({
  title = vouchersDefaultProps.title,
  description = vouchersDefaultProps.description,
  newVoucherLabel = vouchersDefaultProps.newVoucherLabel,
  budgetLabel = vouchersDefaultProps.budgetLabel,
  editLabel = vouchersDefaultProps.editLabel,
  performanceLabel = vouchersDefaultProps.performanceLabel,
  impressionsLabel = vouchersDefaultProps.impressionsLabel,
  ctrLabel = vouchersDefaultProps.ctrLabel,
  redemptionsLabel = vouchersDefaultProps.redemptionsLabel,
  tabLabels = vouchersDefaultProps.tabLabels,
  items = vouchersDefaultProps.items,
  onNewVoucher = vouchersDefaultProps.onNewVoucher,
  onEdit = vouchersDefaultProps.onEdit,
  onPerformance = vouchersDefaultProps.onPerformance,
}: VouchersProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Vouchers' }]}
      mainClassName="space-y-5"
    >
      <VouchersClient
        newVoucherLabel={newVoucherLabel ?? '+ New voucher'}
        budgetLabel={budgetLabel ?? 'Usage'}
        editLabel={editLabel ?? 'Edit'}
        performanceLabel={performanceLabel ?? 'Performance'}
        impressionsLabel={impressionsLabel ?? 'Impr'}
        ctrLabel={ctrLabel ?? 'CTR'}
        redemptionsLabel={redemptionsLabel ?? 'Redm'}
        tabLabels={tabLabels ?? {}}
        items={items ?? []}
        onNewVoucher={onNewVoucher}
        onEdit={onEdit}
        onPerformance={onPerformance}
      />
    </SellerListPage>
  )
}
