import { getMetricsBundle as getMetricsBundleBase } from '../integration/seller-page-api'

export async function getMetricsBundle() {
  const bundle = await getMetricsBundleBase()

  return {
    current: bundle.current.items,
    history: bundle.history.items,
  }
}
