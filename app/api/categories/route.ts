import { getAllCategories } from '@/lib/posts'

export async function GET() {
  const categories = await getAllCategories()
  
  // 统计每个分类的文章数量
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const { getPostsByCategory } = await import('@/lib/posts')
      const posts = await getPostsByCategory(category)
      return {
        name: category,
        count: posts.length,
      }
    })
  )
  
  return Response.json(categoriesWithCount)
}
