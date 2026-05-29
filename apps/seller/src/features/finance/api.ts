import { getFinanceBundle as getFinanceBundleBase } from '../integration/seller-page-api'

export async function getFinanceBundle() {
  const bundle = await getFinanceBundleBase()

  return {
    wallet: bundle.wallet.items,
    transactions: bundle.transactions,
    withdrawals: bundle.withdrawals,
  }
}
