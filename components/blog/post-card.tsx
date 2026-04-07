import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Clock } from "lucide-react"
import type { Post } from "@/lib/posts"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  // 使用预计算的阅读时间
  const readingTime = post.readingTime || 1
  
  return (
    <article className="group">
      <div className="flex flex-col gap-3 py-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <time>
            {format(new Date(post.publishedAt), "yyyy 年 M 月 d 日", { locale: zhCN })}
          </time>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingTime} 分钟阅读
          </span>
        </div>
        <Link href={`/posts/${post.slug}`} className="block">
          <h2 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </Link>
        {(post.tags?.length > 0 || post.categories?.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {post.categories?.map((category) => (
              <Link
                key={category}
                href={`/categories/${encodeURIComponent(category)}`}
                className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                📁 {category}
              </Link>
            ))}
            {post.tags?.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
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
