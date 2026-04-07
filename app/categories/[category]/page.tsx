import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Folder } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { BlogHeader } from '@/components/blog/header'
import { BlogFooter } from '@/components/blog/footer'
import { getPostsByCategory, getAllCategories } from '@/lib/posts'

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories
    .filter(Boolean) // 过滤掉空值
    .map((category) => ({
      category: category,
    }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  
  if (!category) {
    notFound()
  }
  
  // 确保分类名称被正确解码
  const decodedCategory = decodeURIComponent(category)
  const posts = await getPostsByCategory(decodedCategory)

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="h-6 w-6" />
              <h1 className="text-3xl font-bold">{decodedCategory}</h1>
            </div>
            <p className="text-muted-foreground">
              共有 {posts.length} 篇文章
            </p>
          </div>

          <div className="divide-y divide-border">
            {posts.map((post) => (
              <article key={post.slug} className="py-6">
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-xl font-semibold hover:underline">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <time>
                    {format(new Date(post.publishedAt), 'yyyy 年 M 月 d 日', { locale: zhCN })}
                  </time>
                  <div className="flex gap-2">
                    {post.categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/categories/${encodeURIComponent(cat)}`}
                        className="hover:text-foreground transition-colors"
                      >
                        📁 {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
