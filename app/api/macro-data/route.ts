import { execSync } from 'child_process'
import path from 'path'

const CACHE_TTL = 3600 // 1 小时缓存
let cachedData: any = null
let cachedAt = 0

export async function GET() {
  // 检查缓存
  const now = Date.now()
  if (cachedData && now - cachedAt < CACHE_TTL * 1000) {
    return Response.json(cachedData)
  }

  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'fetch-macro-data.py')
    const output = execSync(`python3 ${scriptPath}`, {
      encoding: 'utf-8',
      timeout: 30000,
    })
    const data = JSON.parse(output)

    if (data.error) {
      return Response.json({ error: data.error }, { status: 500 })
    }

    cachedData = data
    cachedAt = now
    return Response.json(data)
  } catch (error: any) {
    console.error('Failed to fetch macro data:', error.message)
    return Response.json({ error: '数据获取失败' }, { status: 500 })
  }
}
