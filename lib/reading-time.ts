import matter from 'gray-matter'

/**
 * 计算阅读时间（分钟）
 * 假设每分钟阅读 200-250 个中文字符或 200 个英文单词
 */
export function calculateReadingTime(content: string): number {
  // 移除代码块、链接等 Markdown 语法
  const text = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
    .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
    .replace(/^[#*>-]+/gm, '') // 移除标题、列表标记
    .replace(/\s+/g, ' ') // 移除多余空白
    .trim()

  // 计算中文字符数
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  
  // 计算英文单词数
  const englishWords = text.replace(/[\u4e00-\u9fa5]/g, '').split(/\s+/).filter(word => word.length > 0).length
  
  // 中文字符按每分钟 200 字计算，英文单词按每分钟 200 词计算
  const chineseTime = chineseChars / 200
  const englishTime = englishWords / 200
  
  // 总阅读时间（分钟），向上取整，最少 1 分钟
  const totalTime = Math.max(1, Math.ceil(chineseTime + englishTime))
  
  return totalTime
}

/**
 * 从 Markdown 文件读取内容并计算阅读时间
 */
export async function getReadingTimeFromMarkdown(filePath: string): Promise<number> {
  const fs = await import('fs/promises')
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const { content } = matter(fileContent)
  return calculateReadingTime(content)
}

/**
 * 格式化阅读时间显示
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '1 分钟'
  } else if (minutes === 1) {
    return '1 分钟'
  } else {
    return `${minutes} 分钟`
  }
}
