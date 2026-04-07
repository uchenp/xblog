import { getPublishedPosts, getAllTags, getAllCategories } from '@/lib/posts'

export async function GET() {
  const posts = await getPublishedPosts()
  const tags = await getAllTags()
  const categories = await getAllCategories()
  
  // 计算总字数
  const totalWords = posts.reduce((sum, post) => {
    return sum + post.content.length
  }, 0)
  
  // 获取最早和最晚的文章日期
  const dates = posts.map(post => new Date(post.publishedAt).getTime())
  const firstPostDate = dates.length > 0 ? new Date(Math.min(...dates)) : null
  const lastPostDate = dates.length > 0 ? new Date(Math.max(...dates)) : null
  
  // 计算运行天数
  const runningDays = firstPostDate 
    ? Math.floor((Date.now() - firstPostDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0

  const stats = {
    totalPosts: posts.length,
    totalTags: tags.length,
    totalCategories: categories.length,
    totalWords,
    runningDays,
    firstPostDate: firstPostDate?.toISOString(),
    lastPostDate: lastPostDate?.toISOString(),
  }

  return Response.json(stats)
}
