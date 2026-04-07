import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { getRelatedPosts } from '@/lib/posts'

interface RelatedPostsProps {
  slug: string
}

export async function RelatedPosts({ slug }: RelatedPostsProps) {
  const relatedPosts = await getRelatedPosts(slug)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6">相关文章</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {relatedPosts.map((post) => (
          <article
            key={post.slug}
            className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
          >
            <Link href={`/posts/${post.slug}`}>
              <h3 className="font-semibold line-clamp-2 hover:underline">
                {post.title}
              </h3>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
            <time className="mt-3 block text-xs text-muted-foreground">
              {format(new Date(post.publishedAt), 'yyyy 年 M 月 d 日', { locale: zhCN })}
            </time>
          </article>
        ))}
      </div>
    </section>
  )
}
