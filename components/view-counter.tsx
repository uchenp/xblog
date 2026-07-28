'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

export function ViewCounter({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    // 获取当前阅读量
    fetch(`/api/views?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => setViews(data.views))
      .catch(() => {})

    // 记录本次访问（使用 sessionStorage 避免刷新重复计数）
    const key = `viewed_${slug}`
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, '1')
      fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
        .then((res) => res.json())
        .then((data) => setViews(data.views))
        .catch(() => {})
    }
  }, [slug])

  if (views === null) return null

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Eye className="h-3 w-3" />
      {views}
    </span>
  )
}
