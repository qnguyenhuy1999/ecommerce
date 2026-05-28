'use client'

import { Login, type LoginSubmitValues } from '@ecom/ui-seller'
import { useAuth } from '../../providers/auth-provider'

export default function LoginPage() {
  const { login } = useAuth()

  const handleSubmit = async ({ email, password }: LoginSubmitValues) => {
    await login(email, password)
  }

  return <Login onSubmit={handleSubmit} />
}
