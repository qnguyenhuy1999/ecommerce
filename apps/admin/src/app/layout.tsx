import '../styles/globals.css'
import { AuthProvider } from '@/core/auth/auth-provider'
import { QueryProvider } from '@/core/query/query-provider'
import { TooltipProvider } from '@ecom/core-ui'

export const metadata = {
  title: 'Admin Panel — Marketplace',
  description: 'Multi-vendor marketplace admin dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
