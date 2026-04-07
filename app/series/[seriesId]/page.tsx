import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, CheckCircle2, Circle } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { getSeriesById } from "@/lib/series"
import { getPostBySlug } from "@/lib/posts"

interface SeriesDetailPageProps {
  params: Promise<{ seriesId: string }>
}

export async function generateMetadata({ params }: SeriesDetailPageProps): Promise<Metadata> {
  const { seriesId } = await params
  // URL 解码（处理中文等字符）
  const decodedSeriesId = decodeURIComponent(seriesId)
  const series = await getSeriesById(decodedSeriesId)
  
  if (!series) {
    return {
      title: "系列未找到",
    }
  }

  return {
    title: series.name,
    description: series.description,
  }
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { seriesId } = await params
  // URL 解码（处理中文等字符）
  const decodedSeriesId = decodeURIComponent(seriesId)
  const series = await getSeriesById(decodedSeriesId)
  
  if (!series) {
    notFound()
  }

  // 获取系列中的所有文章
  const posts = await Promise.all(
    series.posts.map(async (slug) => {
      const post = await getPostBySlug(slug)
      return post
    })
  )
  
  const publishedPosts = posts.filter((post): post is NonNullable<typeof post> => 
    post !== null && post.published
  )

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          {/* 返回按钮 */}
          <Link
            href="/series"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            返回系列列表
          </Link>
          
          {/* 系列头部 */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {series.name}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  共 {publishedPosts.length} 篇文章
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {series.description}
            </p>
          </header>

          {/* 文章列表 */}
          <div className="space-y-4">
            {publishedPosts.map((post, index) => (
              <article
                key={post.slug}
                className="group rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-primary/50"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <Link href={`/posts/${post.slug}`}>
                      <h2 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <time>
                        {format(new Date(post.publishedAt), "yyyy 年 M 月 d 日", { locale: zhCN })}
                      </time>
                      <span className="flex items-center gap-1">
                        {index === 0 ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            开始学习
                          </>
                        ) : (
                          <>
                            <Circle className="h-3 w-3" />
                            继续学习
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* 学习建议 */}
          <div className="mt-8 rounded-lg border bg-muted/50 p-6">
            <h3 className="font-semibold mb-2">💡 学习建议</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>建议按顺序阅读，从基础到进阶</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>每篇文章都有实践代码，建议动手尝试</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>遇到问题可以在评论区提问</span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  )
}
