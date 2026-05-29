import '../styles/globals.css'

import { AuthProvider } from '../core/auth/auth-provider'
import { QueryProvider } from '../core/query/query-provider'
import { SellerRealtimeProvider } from '../core/providers/realtime-provider'

export const metadata = {
  title: 'Seller Center',
  description: 'Multi-vendor marketplace Seller Center',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <QueryProvider>
          <AuthProvider>
            <SellerRealtimeProvider>{children}</SellerRealtimeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
