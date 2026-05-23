'use client'

import { Login } from '@ecom/ui-admin'
import { useLoginAdapter } from '@/features/auth/hooks/use-login-adapter'

export function LoginPageClient() {
  const props = useLoginAdapter()
  return <Login {...props} />
}
