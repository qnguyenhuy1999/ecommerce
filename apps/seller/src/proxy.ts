import type { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { withAuth } from './core/auth/with-auth'

export async function proxy(request: NextRequest): Promise<NextResponse> {
  return await withAuth(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login|register|forgot-password|reset-password).*)',
  ],
}
