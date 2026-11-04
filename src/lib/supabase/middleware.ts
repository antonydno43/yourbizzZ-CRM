import { createMiddlewareClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/builder',
    '/booking',
    '/forms',
    '/crm',
    '/inventory',
    '/ecommerce',
    '/settings',
  ]

  const path = request.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  )

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}
