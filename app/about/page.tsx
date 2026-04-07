import type { Metadata } from "next"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"

export const metadata: Metadata = {
  title: "关于我",
  description: "了解更多关于博主的信息",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <article className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              关于我
            </h1>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed">
              你好！欢迎来到我的个人博客。
            </p>

            <h2 className="mt-8 text-xl font-semibold">关于这个博客</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              这是一个专注于宏观经济数据分析与政策趋势解读的个人博客。
              我相信通过深入分析经济数据和政策动向，可以帮助我们更好地理解全球经济走势，
              做出更明智的投资和生活决策。
            </p>

            <h2 className="mt-8 text-xl font-semibold">我的兴趣</h2>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>宏观经济数据分析</li>
              <li>全球政策趋势解读</li>
              <li>投资与市场研究</li>
              <li>阅读与写作</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">联系方式</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              如果你想和我交流，可以通过以下方式联系我：
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                GitHub:{" "}
                <a
                  href="https://github.com/uchenp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                >
                  @uchenp
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:uchenp@foxmail.com"
                  className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                >
                  uchenp@foxmail.com
                </a>
              </li>
            </ul>
          </div>
        </article>
      </main>

      <BlogFooter />
    </div>
  )
}
