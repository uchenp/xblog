'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

export function Comments() {
  const { resolvedTheme } = useTheme()

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO || ''
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ''
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ''

  // 未配置时不渲染任何内容，避免报错
  if (!repo || !repoId || !categoryId) {
    return null
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
