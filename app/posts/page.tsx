import type { Metadata } from "next"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { PostCard } from "@/components/blog/post-card"
import { getPublishedPosts } from "@/lib/posts"

export const metadata: Metadata = {
  title: "全部文章",
  description: "浏览博客的所有文章",
}

export default async function PostsPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              全部文章
            </h1>
            <p className="mt-2 text-muted-foreground">
              共 {posts.length} 篇文章
            </p>
          </header>

          <div className="divide-y divide-border">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                暂无文章
              </p>
            )}
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  )
}
