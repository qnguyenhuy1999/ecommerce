'use client'

import { Support } from '@ecom/ui-admin'
import { useSupportAdapter } from '@/features/support/hooks/use-support-adapter'

export function SupportPageClient() {
  // eslint-disable-next-line sonarjs/no-unused-vars
  const { loading: _loading, error: _error, props } = useSupportAdapter()
  return <Support {...props} />
}
