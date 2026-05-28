'use client'

import { api } from '../../lib/api'
import { ForgotPassword } from '@ecom/ui-seller'

interface ForgotPasswordResponse {
  data: {
    success: boolean
  }
}

export default function ForgotPasswordPage() {
  const handleSubmit = async ({ email }: { email: string }) => {
    await api<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  return <ForgotPassword onSubmit={handleSubmit} />
}
