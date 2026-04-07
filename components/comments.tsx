'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

export function Comments() {
  const { theme, resolvedTheme } = useTheme()

  // 从环境变量读取配置（推荐）
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO || 'your-github-username/your-repo-name'
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || 'your-repo-id'
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || 'your-category-id'

  // 如果是开发环境且未配置，显示提示
  if (process.env.NODE_ENV === 'development' && 
      (repoId === 'your-repo-id' || categoryId === 'your-category-id')) {
    return (
      <div className="mt-16 rounded-lg border bg-muted/50 p-6 text-center">
        <h3 className="font-semibold mb-2">💬 评论系统待配置</h3>
        <p className="text-sm text-muted-foreground mb-4">
          需要配置 Giscus 评论系统
        </p>
        <a
          href="https://giscus.app/zh-CN"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          前往配置 →
        </a>
      </div>
    )
  }

  return (
    <div className="mt-16">
      <Giscus
        id="comments"
        // @ts-ignore - repo type allows string but Giscus types are too strict
        repo={repo}
        repoId={repoId}
        category="General"
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
