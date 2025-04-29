import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const role = token?.role as string

  console.log(token)
  console.log(token)

  const { pathname } = request.nextUrl

  // Define access rules
  const accessMatrix: Record<string, string[]> = {
    '/enrolled-courses': ['student', 'instructor', 'admin'],
    '/managed-courses': ['instructor', 'admin'],
    '/users': ['admin'],
    '/all-courses': ['admin'],
  }

  // Check if the path has restricted access
  for (const path in accessMatrix) {
    if (pathname.startsWith(path)) {
      const allowedRoles = accessMatrix[path]
      if (!role || !allowedRoles.includes(role)) {
        // Redirect unauthorized users to homepage
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return NextResponse.next()
}

// Specify the paths that require middleware checks
export const config = {
  matcher: [
    '/enrolled-courses/:path*',
    '/managed-courses/:path*',
    '/users/:path*',
    '/all-courses/:path*',
  ],
}
