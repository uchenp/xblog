import { promises as fs } from 'fs'
import path from 'path'
import { unstable_cache } from 'next/cache'
import type { MacroJsonData } from './macro-data'

// 服务端读取 public/data/macro.json（由 npm run fetch:macro 生成）。
// 首页的 MacroSnapshot 与 MacroDataCards 此前各自在客户端 fetch 同一文件，
// 改为在服务端读取一次后通过 props 下发，消除重复请求与客户端加载瀑布。
export const getMacroJson = unstable_cache(
  async (): Promise<MacroJsonData | null> => {
    try {
      const filePath = path.join(process.cwd(), 'public', 'data', 'macro.json')
      const raw = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(raw) as MacroJsonData
    } catch {
      return null
    }
  },
  ['macro-json'],
  { revalidate: 3600 }
)
