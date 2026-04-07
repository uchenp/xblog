import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { BlogHeader } from '@/components/blog/header'
import { BlogFooter } from '@/components/blog/footer'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="mx-auto max-w-md px-4 text-center py-16">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">页面未找到</h2>
          <p className="text-muted-foreground mb-8">
            抱歉，您访问的页面不存在或已被移除。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Home className="h-4 w-4" />
              返回首页
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              浏览文章
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
              搜索内容
            </Link>
          </div>
          
          <div className="mt-12 text-sm text-muted-foreground">
            <p>可能的原因：</p>
            <ul className="mt-2 space-y-1">
              <li>• 链接已过期或失效</li>
              <li>• 页面已被删除或移动</li>
              <li>• 输入的网址有误</li>
            </ul>
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
