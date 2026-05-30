import { Suspense } from 'react'
import { ResetPasswordClient } from './_components/reset-password.client'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordClient />
    </Suspense>
  )
}
