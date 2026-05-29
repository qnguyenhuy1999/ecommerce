import { type NextRequest } from 'next/server'
import { withAuth } from './core/auth/with-auth'

export async function proxy(request: NextRequest): Promise<Response> {
  return withAuth(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
