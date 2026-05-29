import '../styles/globals.css'

import { AuthProvider } from '../core/auth/auth-provider'
import { SellerRealtimeProvider } from '../core/providers/realtime-provider'

export const metadata = {
  title: 'Seller Center',
  description: 'Multi-vendor marketplace Seller Center',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 antialiased">
        <AuthProvider>
          <SellerRealtimeProvider>{children}</SellerRealtimeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
