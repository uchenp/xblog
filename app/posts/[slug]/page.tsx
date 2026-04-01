import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { PostContent } from "@/components/blog/post-content"
import { getPostBySlug, getPublishedPosts, calculateReadingTime } from "@/lib/posts"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {
      title: "文章未找到",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || !post.published) {
    notFound()
  }

  const readingTime = calculateReadingTime(post.content)

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          {/* 返回链接 */}
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>

          {/* 文章头部 */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <time>
                {format(new Date(post.publishedAt), "yyyy年M月d日", { locale: zhCN })}
              </time>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {readingTime} 分钟阅读
              </span>
            </div>
          </header>

          {/* 文章内容 */}
          <PostContent content={post.content} />
        </article>
      </main>

      <BlogFooter />
    </div>
  )
}
