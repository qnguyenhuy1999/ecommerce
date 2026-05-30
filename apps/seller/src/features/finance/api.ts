import { getFinanceBundle as getFinanceBundleBase } from '../integration/seller-page-api'

export async function getFinanceBundle(init?: RequestInit) {
  const bundle = await getFinanceBundleBase(init)

  return {
    wallet: bundle.wallet.items,
    transactions: bundle.transactions,
    withdrawals: bundle.withdrawals,
  }
}
