import { ConsolePageLayout } from '@ecom/core-ui'
import { WalletSummarySection } from './Finance.server'
import { LedgerSectionClient } from './Finance.client'
import { financeDefaultProps } from './Finance.fixtures'
import type { FinanceProps } from './Finance.types'

export function Finance({
  title = financeDefaultProps.title,
  description = financeDefaultProps.description,
  walletBalanceLabel = financeDefaultProps.walletBalanceLabel,
  walletBalance = financeDefaultProps.walletBalance,
  balanceMetrics = financeDefaultProps.balanceMetrics,
  withdrawHref = financeDefaultProps.withdrawHref,
  statementHref = financeDefaultProps.statementHref,
  tabs = financeDefaultProps.tabs,
  tab,
  defaultTab = financeDefaultProps.defaultTab,
  onTabChange,
  entries = financeDefaultProps.entries,
  emptyMessage = financeDefaultProps.emptyMessage,
}: FinanceProps) {
  const optionalProps = {
    ...(tab !== undefined ? { tab } : {}),
    ...(onTabChange !== undefined ? { onTabChange } : {}),
  }

  return (
    <ConsolePageLayout title={title} description={description} mainClassName="space-y-5">
      <WalletSummarySection
        walletBalanceLabel={walletBalanceLabel}
        walletBalance={walletBalance}
        balanceMetrics={balanceMetrics}
        withdrawHref={withdrawHref}
      />
      <LedgerSectionClient
        statementHref={statementHref}
        tabs={tabs}
        defaultTab={defaultTab}
        entries={entries}
        emptyMessage={emptyMessage}
        {...optionalProps}
      />
    </ConsolePageLayout>
  )
}
