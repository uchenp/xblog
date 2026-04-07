'use client'

import { useEffect, useState } from 'react'
import { FileText, Tag, Folder, Type, Calendar, Clock } from 'lucide-react'
import { BlogHeader } from '@/components/blog/header'
import { BlogFooter } from '@/components/blog/footer'

interface Stats {
  totalPosts: number
  totalTags: number
  totalCategories: number
  totalWords: number
  runningDays: number
  firstPostDate: string
  lastPostDate: string
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <BlogHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">加载中...</div>
        </main>
        <BlogFooter />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen flex-col">
        <BlogHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">加载失败</div>
        </main>
        <BlogFooter />
      </div>
    )
  }

  const statCards = [
    {
      icon: FileText,
      label: '文章总数',
      value: stats.totalPosts,
      color: 'text-blue-500',
    },
    {
      icon: Tag,
      label: '标签数量',
      value: stats.totalTags,
      color: 'text-green-500',
    },
    {
      icon: Folder,
      label: '分类数量',
      value: stats.totalCategories,
      color: 'text-orange-500',
    },
    {
      icon: Type,
      label: '总字数',
      value: stats.totalWords.toLocaleString(),
      color: 'text-purple-500',
    },
    {
      icon: Calendar,
      label: '运行天数',
      value: stats.runningDays,
      color: 'text-red-500',
    },
    {
      icon: Clock,
      label: '最后更新',
      value: stats.lastPostDate 
        ? new Date(stats.lastPostDate).toLocaleDateString('zh-CN')
        : '无',
      color: 'text-gray-500',
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              站点统计
            </h1>
            <p className="text-muted-foreground mt-2">
              博客数据统计
            </p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-4">
                  <Icon className={`h-8 w-8 ${color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {stats.firstPostDate && (
            <div className="mt-8 rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">博客历程</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">首篇文章</span>
                  <time>
                    {new Date(stats.firstPostDate).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">最新文章</span>
                  <time>
                    {new Date(stats.lastPostDate!).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
