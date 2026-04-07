import type { Metadata } from "next"
import Link from "next/link"
import { Tag } from "lucide-react"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { getAllTags, getPostsByTag } from "@/lib/posts"

export const metadata: Metadata = {
  title: "标签",
  description: "浏览博客的所有标签",
}

export default async function TagsPage() {
  const tags = await getAllTags()
  
  const tagsWithCount = await Promise.all(
    tags.map(async (tag) => {
      const posts = await getPostsByTag(tag)
      return {
        name: tag,
        count: posts.length,
      }
    })
  )

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                标签
              </h1>
            </div>
            <p className="text-muted-foreground">
              共 {tags.length} 个标签
            </p>
          </header>

          {tagsWithCount.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {tagsWithCount.map(({ name, count }) => (
                <Link
                  key={name}
                  href={`/tags/${encodeURIComponent(name)}`}
                  className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span>#{name}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              暂无标签
            </p>
          )}
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
