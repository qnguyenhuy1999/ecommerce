import { AuthPageShell } from '@ecom/ui-admin/layouts/AuthPageShell'
import { LoginPageClient } from './_components/LoginPage.client'

export default function LoginPage() {
  return (
    <AuthPageShell title="Sign in">
      <LoginPageClient />
    </AuthPageShell>
  )
}
