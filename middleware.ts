import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PREFIXES = ['/admin']
const PUBLIC_ADMIN_PAGES = ['/admin']

async function getTokenHash(): Promise<string> {
  const token = process.env.ADMIN_TOKEN
  if (!token) return ''
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex.slice(0, 16)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = ADMIN_PREFIXES.some(prefix => pathname.startsWith(prefix))
  if (!isAdminRoute) {
    return NextResponse.next()
  }

  if (PUBLIC_ADMIN_PAGES.includes(pathname)) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get('xblog_admin_auth')
  const expectedHash = await getTokenHash()
  const isAuthenticated = !!(authCookie && expectedHash && authCookie.value === expectedHash)

  if (!isAuthenticated) {
    const loginUrl = new URL('/admin', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
