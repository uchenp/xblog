import { NextRequest, NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'crypto'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN

// 常量时间字符串比较，避免时序攻击
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8')
  const bufB = Buffer.from(b, 'utf8')
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

// TODO: 限流当前用进程内 Map，serverless 多实例无效。
// 后续接入 Vercel KV / Upstash Redis 做持久化。
const loginAttempts = new Map<string, { count: number; lastReset: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 分钟窗口

function getIpFromRequest(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record || now - record.lastReset > WINDOW_MS) {
    loginAttempts.set(ip, { count: 0, lastReset: now })
    return { allowed: true }
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((record.lastReset + WINDOW_MS - now) / 1000)
    return { allowed: false, retryAfter }
  }

  return { allowed: true }
}

function recordFailure(ip: string) {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (!record || now - record.lastReset > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, lastReset: now })
  } else {
    record.count++
  }
}

function recordSuccess(ip: string) {
  loginAttempts.delete(ip)
}

export async function POST(request: NextRequest) {
  if (!ADMIN_TOKEN) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    )
  }

  const ip = getIpFromRequest(request)
  const limit = checkRateLimit(ip)

  if (!limit.allowed) {
    return NextResponse.json(
      { error: `登录尝试次数过多，请在 ${limit.retryAfter} 秒后重试` },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { token } = body

    if (!token || typeof token !== 'string') {
      recordFailure(ip)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (!safeEqual(token, ADMIN_TOKEN)) {
      recordFailure(ip)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    recordSuccess(ip)

    const response = NextResponse.json({ success: true })
    const tokenHash = createHash('sha256').update(ADMIN_TOKEN).digest('hex').slice(0, 16)
    response.cookies.set('xblog_admin_auth', tokenHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
