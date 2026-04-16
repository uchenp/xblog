import Link from "next/link"
import { ArrowRight, TrendingUp } from "lucide-react"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { PostCard } from "@/components/blog/post-card"
import { DailyQuote } from "@/components/daily-quote"
import { TagCloud } from "@/components/blog/tag-cloud"
import { MacroDataCards } from "@/components/macro-data-cards"
import { EconomicCalendarWidget } from "@/components/economic-calendar-widget"
import { HeroBackground } from "@/components/hero-background"
import { WorldHeatmap } from "@/components/world-heatmap"
import { MacroSnapshot } from "@/components/macro-snapshot"
import { getPublishedPosts } from "@/lib/posts"

export default async function HomePage() {
  const posts = await getPublishedPosts()
  const recentPosts = posts.slice(0, 5)

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative mx-auto max-w-5xl px-4 pt-8 pb-8 sm:px-6 sm:pt-10 sm:pb-10 overflow-hidden">
          {/* 动态背景 */}
          <div className="absolute inset-4 sm:inset-6 -z-10 rounded-2xl overflow-hidden">
            <HeroBackground />
          </div>
          
          {/* 内容层 */}
          <div className="relative z-10 mx-4 sm:mx-6">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                FelixView
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                聚焦宏观经济数据分析与政策趋势解读，提供全球视野的市场洞察。
              </p>
              <div className="flex gap-4 pt-1">
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
            
            {/* 核心指标快照 */}
            <MacroSnapshot />
          </div>
        </section>

        {/* Daily Quote - 轻量版 */}
        <section className="mx-auto max-w-5xl px-4 pb-8 sm:px-6 sm:pb-10">
          <DailyQuote compact />
        </section>

        {/* Recent Posts */}
        <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 sm:pb-14">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">最新文章</h2>
            </div>
            <Link
              href="/posts"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              查看全部
            </Link>
          </div>
          
          <div className="flex flex-col gap-4">
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

        {/* Tag Cloud */}
        <TagCloud />

        {/* 宏观数据板块 */}
        <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 sm:pb-14">
          <div className="flex flex-col gap-6">
            <MacroDataCards />
            <EconomicCalendarWidget />
            <WorldHeatmap />
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  )
}
