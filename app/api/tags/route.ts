import { getAllTags } from '@/lib/posts'

export async function GET() {
  const tags = await getAllTags()
  
  // 统计每个标签的文章数量
  const tagsWithCount = await Promise.all(
    tags.map(async (tag) => {
      const { getPostsByTag } = await import('@/lib/posts')
      const posts = await getPostsByTag(tag)
      return {
        name: tag,
        count: posts.length,
      }
    })
  )
  
  return Response.json(tagsWithCount)
}
