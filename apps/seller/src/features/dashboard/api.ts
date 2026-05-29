import 'server-only'

import { headers } from 'next/headers'
import { api } from '@/lib/api'
import type { SellerDashboardBundle, SellerDashboardViewModel } from './normalize'
import { normalizeDashboardBundle } from './normalize'

interface DashboardBundleEnvelope {
  data: {
    items: SellerDashboardBundle
  }
}

export async function getDashboardBundle(): Promise<SellerDashboardViewModel> {
  const requestHeaders = await headers()
  const cookie = requestHeaders.get('cookie')

  const response = await api<DashboardBundleEnvelope>('/dashboard/bundle', {
    cache: 'no-store',
    headers: cookie ? { cookie } : undefined,
  })

  return normalizeDashboardBundle(response.data.items)
}
