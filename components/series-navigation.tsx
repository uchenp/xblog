import Link from 'next/link'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import { getPostSeriesInfo } from '@/lib/series'

interface SeriesNavigationProps {
  slug: string
}

export async function SeriesNavigation({ slug }: SeriesNavigationProps) {
  const seriesInfo = await getPostSeriesInfo(slug)
  
  if (!seriesInfo) return null
  
  const { series, currentIndex, totalPosts, prevPost, nextPost } = seriesInfo
  
  // 获取上一篇文章和下一篇文章的详情
  const { getPostBySlug } = await import('@/lib/posts')
  const prevPostData = prevPost ? await getPostBySlug(prevPost) : null
  const nextPostData = nextPost ? await getPostBySlug(nextPost) : null

  return (
    <div className="my-8 rounded-lg border bg-muted/50 p-6">
      {/* 系列标题 */}
      <div className="mb-4 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <div>
          <Link
            href={`/series/${series.id}`}
            className="font-semibold text-primary hover:underline"
          >
            {series.name}
          </Link>
          <p className="text-sm text-muted-foreground mt-1">
            第 {currentIndex + 1} 篇 · 共 {totalPosts} 篇
          </p>
        </div>
      </div>
      
      {/* 系列描述 */}
      <p className="text-sm text-muted-foreground mb-4">
        {series.description}
      </p>
      
      {/* 上一篇/下一篇导航 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 上一篇 */}
        <div>
          {prevPostData ? (
            <Link
              href={`/posts/${prevPost}`}
              className="group flex flex-col gap-1 rounded-md border bg-background p-4 transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
                上一篇
              </div>
              <div className="font-medium text-foreground group-hover:text-primary line-clamp-1">
                {prevPostData.title}
              </div>
            </Link>
          ) : (
            <div className="flex flex-col gap-1 rounded-md border bg-background p-4 opacity-50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
                上一篇
              </div>
              <div className="font-medium text-muted-foreground">
                已经是第一篇了
              </div>
            </div>
          )}
        </div>
        
        {/* 下一篇 */}
        <div>
          {nextPostData ? (
            <Link
              href={`/posts/${nextPost}`}
              className="group flex flex-col gap-1 rounded-md border bg-background p-4 transition-all hover:border-primary/50 hover:bg-primary/5 sm:ml-auto sm:w-fit"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground sm:justify-end">
                下一篇
                <ChevronRight className="h-4 w-4" />
              </div>
              <div className="font-medium text-foreground group-hover:text-primary line-clamp-1">
                {nextPostData.title}
              </div>
            </Link>
          ) : (
            <div className="flex flex-col gap-1 rounded-md border bg-background p-4 opacity-50 sm:ml-auto sm:w-fit">
              <div className="flex items-center gap-2 text-sm text-muted-foreground sm:justify-end">
                下一篇
                <ChevronRight className="h-4 w-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                已经是最后一篇了
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
