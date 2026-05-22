import { SellerListPage } from '../../organisms'
import { CommissionFeesClient } from './CommissionFees.client'
import { commissionFeesDefaultProps, defaultGlobalRate } from './CommissionFees.fixtures'
import type { CommissionFeesProps } from './CommissionFees.types'

export function CommissionFees({
  title = commissionFeesDefaultProps.title,
  description = commissionFeesDefaultProps.description,
  addRuleLabel = commissionFeesDefaultProps.addRuleLabel,
  sampleOrderAmount = commissionFeesDefaultProps.sampleOrderAmount,
  globalRate = defaultGlobalRate,
  categoryOverrides = commissionFeesDefaultProps.categoryOverrides,
  vendorOverrides = commissionFeesDefaultProps.vendorOverrides,
  onSave = commissionFeesDefaultProps.onSave,
  onAddRule = commissionFeesDefaultProps.onAddRule,
}: CommissionFeesProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      breadcrumb={[{ label: 'Admin', href: '#' }, { label: 'Commission' }]}
      mainClassName="space-y-5"
    >
      <CommissionFeesClient
        addRuleLabel={addRuleLabel ?? 'Add rule'}
        sampleOrderAmount={sampleOrderAmount ?? 100}
        globalRate={globalRate}
        categoryOverrides={categoryOverrides ?? []}
        vendorOverrides={vendorOverrides ?? []}
        onSave={onSave}
        onAddRule={onAddRule}
      />
    </SellerListPage>
  )
}
