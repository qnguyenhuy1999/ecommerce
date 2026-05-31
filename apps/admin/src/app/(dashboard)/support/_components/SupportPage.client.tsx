'use client'

import { Support } from '@ecom/ui-admin/pages/Support'
import { useSupportAdapter } from '@/features/support/hooks/use-support-adapter'

export function SupportPageClient() {
  const { props } = useSupportAdapter()
  return <Support {...props} />
}
