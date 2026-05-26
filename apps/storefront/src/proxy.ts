import { type NextRequest } from 'next/server'
import { getWebAuthPreset } from '@ecom/auth'
import { createWithAuth } from '@ecom/auth/middleware'

const { middleware } = getWebAuthPreset('storefront')
const withAuth = createWithAuth(middleware)

export async function proxy(request: NextRequest): Promise<Response> {
  return withAuth(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
