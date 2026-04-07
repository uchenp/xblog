import type { Metadata } from "next"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { PostsList } from "@/components/blog/posts-list"
import { getPublishedPosts, getAllTags, getAllCategories } from "@/lib/posts"

export const metadata: Metadata = {
  title: "全部文章",
  description: "浏览博客的所有文章，包含技术分享、生活感悟等内容",
  robots: {
    index: true,
    follow: true,
  },
}

export default async function PostsPage() {
  const posts = await getPublishedPosts()
  const tags = await getAllTags()
  const categories = await getAllCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              全部文章
            </h1>
            <p className="mt-2 text-muted-foreground">
              共 {posts.length} 篇文章
            </p>
          </header>

          <PostsList posts={posts} tags={tags} categories={categories} />
        </section>
      </main>

      <BlogFooter />
    </div>
  )
}
