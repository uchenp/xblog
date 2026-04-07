import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Tag } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { getAllTags, getPostsByTag } from "@/lib/posts"

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags
    .filter(Boolean)
    .map((tag) => ({ tag }))
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  
  if (!tag) {
    notFound()
  }
  
  // 确保标签名称被正确解码
  const decodedTag = decodeURIComponent(tag)
  const posts = await getPostsByTag(decodedTag)

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Link
            href="/tags"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回标签列表
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">#{decodedTag}</h1>
            </div>
            <p className="text-muted-foreground">
              共有 {posts.length} 篇文章
            </p>
          </div>

          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group relative flex flex-col gap-2 p-4 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Link href={`/posts/${post.slug}`} className="absolute inset-0" />
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <time dateTime={post.publishedAt}>
                    {format(new Date(post.publishedAt), 'yyyy 年 M 月 d 日', {
                      locale: zhCN,
                    })}
                  </time>
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
