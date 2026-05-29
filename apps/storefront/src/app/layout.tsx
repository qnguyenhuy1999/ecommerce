import '../styles/globals.css'
import { AuthProvider } from '../core/auth/auth-provider'
import { QueryProvider } from '../core/query/query-provider'
import { StorefrontRealtimeProvider } from '../core/providers/realtime-provider'
import { StorefrontShell } from '../shared/components/storefront-shell'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <StorefrontRealtimeProvider>
              <StorefrontShell>{children}</StorefrontShell>
            </StorefrontRealtimeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
