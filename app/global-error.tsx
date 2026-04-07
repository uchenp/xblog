"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("全局错误:", error)
  }, [error])

  return (
    <html lang="zh-CN">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-primary">500</h1>
            <h2 className="mt-4 text-2xl font-semibold text-foreground">服务器错误</h2>
            <p className="mt-2 text-muted-foreground">
              应用加载时出现了严重错误。请尝试刷新页面或返回首页。
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button onClick={() => window.location.reload()}>刷新页面</Button>
              <Link href="/">
                <Button variant="outline">返回首页</Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
