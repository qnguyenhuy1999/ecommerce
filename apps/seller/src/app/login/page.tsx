'use client'

import { Login, type LoginSubmitValues } from '@ecom/ui-seller'
import { useAuth } from '../../providers/auth-provider'
import { api } from '../../lib/api'
import type { SellerPaths } from '@ecom/contracts/generated'

type LoginResponse =
  SellerPaths['/auth/login']['post']['responses']['200']['content']['application/json']

export default function LoginPage() {
  const { refresh } = useAuth()

  const handleSubmit = async ({ email, password }: LoginSubmitValues) => {
    await api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    await refresh()
  }

  return <Login onSubmit={handleSubmit} />
}
