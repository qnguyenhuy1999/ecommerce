import { getMetricsBundle as getMetricsBundleBase } from '../integration/seller-page-api'

export async function getMetricsBundle(init?: RequestInit) {
  const bundle = await getMetricsBundleBase(init)

  return {
    current: bundle.current.items,
    history: bundle.history.items,
  }
}
