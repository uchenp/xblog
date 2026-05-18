import { promises as fs } from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'macro.json')

export const revalidate = 3600

export async function GET() {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8')
    return new Response(content, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return Response.json(
      { error: '宏观数据尚未生成，请运行 npm run fetch:macro' },
      { status: 503 }
    )
  }
}
