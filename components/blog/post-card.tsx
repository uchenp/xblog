import Link from "next/link"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import type { Post } from "@/lib/posts"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="flex flex-col gap-2 py-4">
          <time className="text-sm text-muted-foreground">
            {format(new Date(post.publishedAt), "yyyy年M月d日", { locale: zhCN })}
          </time>
          <h2 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  )
}
