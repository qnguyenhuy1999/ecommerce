'use client'

import { Messages } from '@ecom/ui-admin/pages/Messages'
import { useSupportAdapter } from '@/features/support/hooks/use-support-adapter'

export function SupportPageClient() {
  const { props } = useSupportAdapter()
  return <Messages {...props} />
}
