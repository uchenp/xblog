'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

interface ViewCountProps {
  slug: string
}

export function ViewCount({ slug }: ViewCountProps) {
  const [views, setViews] = useState<number | null>(null)

  useEffect(() => {
    // 从本地存储获取阅读量
    const stored = localStorage.getItem(`views:${slug}`)
    if (stored) {
      setViews(parseInt(stored, 10))
    }

    // 增加阅读量
    const newViews = stored ? parseInt(stored, 10) + 1 : 1
    localStorage.setItem(`views:${slug}`, newViews.toString())
    setViews(newViews)

    // TODO: 可以同步到服务器
    // fetch('/api/views', {
    //   method: 'POST',
    //   body: JSON.stringify({ slug }),
    // })
  }, [slug])

  if (views === null) {
    return null
  }

  return (
    <span className="flex items-center gap-1" title="阅读量">
      <Eye className="h-4 w-4" />
      {views}
    </span>
  )
}
