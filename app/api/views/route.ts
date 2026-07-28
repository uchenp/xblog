import { NextRequest, NextResponse } from 'next/server'

// 使用内存 Map 作为简单计数器（Vercel Serverless 环境下为 per-instance）
// 生产环境建议替换为 Vercel KV 或 Upstash Redis
const viewCounts = new Map<string, number>()

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const count = viewCounts.get(slug) || 0
  return NextResponse.json({ slug, views: count })
}

export async function POST(request: NextRequest) {
  const { slug } = await request.json()
  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const current = viewCounts.get(slug) || 0
  const newCount = current + 1
  viewCounts.set(slug, newCount)

  return NextResponse.json({ slug, views: newCount })
}
