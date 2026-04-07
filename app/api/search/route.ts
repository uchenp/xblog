import { NextRequest } from 'next/server'
import { searchPosts, getPublishedPosts } from '@/lib/posts'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  
  // 如果没有查询参数，返回所有文章
  if (!query.trim()) {
    const posts = await getPublishedPosts()
    return Response.json(
      posts.map(post => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        tags: post.tags,
        categories: post.categories,
      }))
    )
  }
  
  const results = await searchPosts(query)
  
  // 只返回必要的字段
  const simplifiedResults = results.map(post => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    tags: post.tags,
    categories: post.categories,
  }))
  
  return Response.json(simplifiedResults)
}
