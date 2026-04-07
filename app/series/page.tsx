import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { getAllSeries } from "@/lib/series"
import { getPublishedPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "系列文章",
  description: "浏览博客的系列文章，系统学习某个主题",
  robots: {
    index: true,
    follow: true,
  },
}

export default async function SeriesPage() {
  const series = await getAllSeries()
  const allPosts = await getPublishedPosts()

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              系列文章
            </h1>
            <p className="mt-2 text-muted-foreground">
              系统学习某个主题，从入门到精通
            </p>
          </header>

          <div className="space-y-6">
            {series.length > 0 ? (
              series.map((s) => {
                const publishedPosts = s.posts.filter(slug => 
                  allPosts.find(post => post.slug === slug && post.published)
                )
                
                return (
                  <article
                    key={s.id}
                    className="rounded-lg border bg-card p-6 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/series/${s.id}`}
                          className="inline-block"
                        >
                          <h2 className="text-xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary">
                            {s.name}
                          </h2>
                        </Link>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {s.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-primary">
                              {publishedPosts.length}
                            </span>
                            {' '}篇文章
                          </div>
                          <Link
                            href={`/series/${s.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            查看详情
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })
            ) : (
              <div className="rounded-lg border bg-muted/50 p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">暂无系列文章</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  系列文章正在创作中，敬请期待...
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  )
}
