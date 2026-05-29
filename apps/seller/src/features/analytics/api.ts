import { getAnalyticsBundle as getAnalyticsBundleBase } from '../integration/seller-page-api'

export async function getAnalyticsBundle(rangeParams: { startDate: string; endDate: string }) {
  const bundle = await getAnalyticsBundleBase(rangeParams)

  return {
    revenue: bundle.revenue,
    orders: bundle.orders,
    products: bundle.products,
    conversion: bundle.conversion,
  }
}
