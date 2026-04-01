import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { PostCard } from "@/components/blog/post-card"
import { getPublishedPosts } from "@/lib/posts"

export default async function HomePage() {
  const posts = await getPublishedPosts()
  const recentPosts = posts.slice(0, 5)

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              你好，我是博主
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              欢迎来到我的个人博客。这里记录着我的技术探索、学习心得和生活感悟。
              希望这些文字能给你带来一些启发。
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
              >
                阅读全部文章
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                关于我
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-lg font-semibold">最新文章</h2>
            <Link
              href="/posts"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              查看全部
            </Link>
          </div>
          
          <div className="divide-y divide-border">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                暂无文章
              </p>
            )}
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  )
}
