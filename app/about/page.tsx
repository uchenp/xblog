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
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
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
              这是一个用于记录技术学习、分享生活感悟的个人空间。我相信写作是一种很好的思考方式，
              通过把想法写下来，我们可以更清晰地理解自己的想法，也能帮助到其他人。
            </p>

            <h2 className="mt-8 text-xl font-semibold">我的兴趣</h2>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>前端开发与用户体验设计</li>
              <li>开源软件与技术分享</li>
              <li>阅读与写作</li>
              <li>摄影与旅行</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">联系方式</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              如果你想和我交流，可以通过以下方式联系我：
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li>
                GitHub:{" "}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                >
                  @username
                </a>
              </li>
              <li>
                Twitter:{" "}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                >
                  @username
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href="mailto:hello@example.com"
                  className="text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
                >
                  hello@example.com
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
