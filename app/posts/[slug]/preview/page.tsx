import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, Eye } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { PostContent } from "@/components/blog/post-content"
import { TableOfContents } from "@/components/table-of-contents"
import { getPostBySlug } from "@/lib/posts"
import { cookies } from "next/headers"
import { createHash } from "crypto"

interface PreviewPageProps {
  params: Promise<{ slug: string }>
}

async function isAuthenticated(): Promise<boolean> {
  const adminToken = process.env.ADMIN_TOKEN
  if (!adminToken) return false

  const expectedHash = createHash("sha256").update(adminToken).digest("hex").slice(0, 16)
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("xblog_admin_auth")
  return !!(authCookie && authCookie.value === expectedHash)
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { slug } = await params
  // 确保 slug 被正确解码
  const decodedSlug = decodeURIComponent(slug)
  const post = await getPostBySlug(decodedSlug)

  if (!post) {
    return { title: "文章未找到" }
  }

  return {
    title: `${post.title} (预览)`,
    description: post.excerpt,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params
  // 确保 slug 被正确解码
  const decodedSlug = decodeURIComponent(slug)

  if (!(await isAuthenticated())) {
    notFound()
  }

  const post = await getPostBySlug(decodedSlug)
  if (!post) {
    notFound()
  }

  const readingTime = post.readingTime || 1

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          {/* 预览提示 */}
          <div className="mb-8 flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            <Eye className="h-4 w-4 shrink-0" />
            <span>
              预览模式{!post.published ? " · 该文章尚未发布" : ""}
            </span>
            <Link
              href={`/admin/posts/${decodedSlug}/edit`}
              className="ml-auto underline"
            >
              返回编辑
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
            <article>
              <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <time>
                    {format(new Date(post.publishedAt), "yyyy 年 M 月 d 日", { locale: zhCN })}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readingTime} 分钟阅读
                  </span>
                  {post.categories?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">📁</span>
                      {post.categories.map((category) => (
                        <span key={category}>{category}</span>
                      ))}
                    </div>
                  )}
                </div>
                {post.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </header>

              <PostContent content={post.content} />
            </article>

            <TableOfContents toc={post.toc || []} />
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
