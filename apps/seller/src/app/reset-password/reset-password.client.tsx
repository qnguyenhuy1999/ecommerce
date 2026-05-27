'use client'

import { useSearchParams } from 'next/navigation'
import { ResetPassword, type ResetPasswordSubmitValues } from '@ecom/ui-seller'
import { resetPassword } from '@/features/integration/seller-page-api'

export function ResetPasswordClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const handleSubmit = async ({ password }: ResetPasswordSubmitValues) => {
    await resetPassword({ token, password })
  }

  return <ResetPassword token={token} onSubmit={handleSubmit} />
}
