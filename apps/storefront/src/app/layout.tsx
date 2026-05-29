import '../styles/globals.css'
import { AuthProvider } from '../core/auth/auth-provider'
import { StorefrontRealtimeProvider } from '../core/providers/realtime-provider'
import { StorefrontShell } from '../shared/components/storefront-shell'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <StorefrontRealtimeProvider>
            <StorefrontShell>{children}</StorefrontShell>
          </StorefrontRealtimeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
