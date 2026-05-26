import { StorefrontShell } from '../components/storefront-shell'
import { AuthProvider } from '../providers/auth-provider'
import { StorefrontRealtimeProvider } from '../providers/realtime-provider'

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
