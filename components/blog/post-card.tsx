import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Clock, Eye } from "lucide-react"
import type { Post } from "@/lib/posts"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  // 使用预计算的阅读时间
  const readingTime = post.readingTime || 1
  
  return (
    <article className="group rounded-xl border border-border/40 bg-card/30 p-5 transition-all hover:border-border hover:bg-card/50 hover:shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time className="font-medium">
            {format(new Date(post.publishedAt), "yyyy 年 M 月 d 日", { locale: zhCN })}
          </time>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingTime} 分钟
          </span>
          {post.views !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views}
            </span>
          )}
        </div>
        <Link href={`/posts/${post.slug}`} className="block">
          <h2 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed mt-1">
            {post.excerpt}
          </p>
        </Link>
        {(post.tags?.length > 0 || post.categories?.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {post.categories?.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary transition-colors"
              >
                {category}
              </span>
            ))}
            {post.tags?.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
