import type { Metadata } from "next"
import Link from "next/link"
import { Archive } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { getPublishedPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "文章归档",
  description: "按时间归档的所有文章",
}

export default async function ArchivePage() {
  const posts = await getPublishedPosts()
  
  // 按年月分组
  const postsByYearMonth = posts.reduce((acc, post) => {
    const date = new Date(post.publishedAt)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const key = `${year}年${month}月`
    
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(post)
    
    return acc
  }, {} as Record<string, typeof posts>)

  const sortedKeys = Object.keys(postsByYearMonth).sort((a, b) => {
    const [yearA, monthA] = a.split('年').map(n => parseInt(n.replace('月', '')))
    const [yearB, monthB] = b.split('年').map(n => parseInt(n.replace('月', '')))
    
    if (yearA !== yearB) return yearB - yearA
    return monthB - monthA
  })

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Archive className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                文章归档
              </h1>
            </div>
            <p className="text-muted-foreground">
              共 {posts.length} 篇文章
            </p>
          </header>

          <div className="space-y-8">
            {sortedKeys.map((key) => (
              <section key={key}>
                <h2 className="text-xl font-semibold mb-4 sticky top-14 bg-background/95 backdrop-blur py-2">
                  {key}
                </h2>
                <div className="divide-y divide-border">
                  {postsByYearMonth[key].map((post) => (
                    <article key={post.slug} className="py-3">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="group flex items-start justify-between gap-4"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium group-hover:underline">
                            {post.title}
                          </h3>
                        </div>
                        <time className="text-sm text-muted-foreground whitespace-nowrap">
                          {format(new Date(post.publishedAt), 'MM-dd', { locale: zhCN })}
                        </time>
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
