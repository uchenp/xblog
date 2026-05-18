import { NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'xblog_admin_auth'

function getTokenHash(): string {
  const token = process.env.ADMIN_TOKEN
  if (!token) return ''
  return createHash('sha256').update(token).digest('hex').slice(0, 16)
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

async function verifyCookieAuth(): Promise<boolean> {
  const expectedHash = getTokenHash()
  if (!expectedHash) return false

  try {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME)
    if (!authCookie) return false
    return safeEqual(authCookie.value, expectedHash)
  } catch {
    return false
  }
}

export async function requireAuth(request: Request): Promise<NextResponse | null> {
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) {
    console.error('ADMIN_TOKEN is not set in environment variables')
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  // 优先检查 Bearer token（向后兼容）
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    if (safeEqual(token, adminToken)) {
      return null
    }
  }

  // 检查 HttpOnly cookie
  const cookieAuthValid = await verifyCookieAuth()
  if (cookieAuthValid) {
    return null
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
