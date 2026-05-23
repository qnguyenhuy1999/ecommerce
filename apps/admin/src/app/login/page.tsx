import { AuthPageShell } from '@ecom/ui-admin'
import { LoginPageClient } from './LoginPage.client'

export default function LoginPage() {
  return (
    <AuthPageShell title="Sign in">
      <LoginPageClient />
    </AuthPageShell>
  )
}
