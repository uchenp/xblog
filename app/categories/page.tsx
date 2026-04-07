import type { Metadata } from "next"
import Link from "next/link"
import { Folder } from "lucide-react"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { getAllCategories, getPostsByCategory } from "@/lib/posts"

export const metadata: Metadata = {
  title: "分类",
  description: "浏览博客的所有分类",
}

export default async function CategoriesPage() {
  const categories = await getAllCategories()
  
  const categoriesWithCount = await Promise.all(
    categories.map(async (category) => {
      const posts = await getPostsByCategory(category)
      return {
        name: category,
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
              <Folder className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                分类
              </h1>
            </div>
            <p className="text-muted-foreground">
              共 {categories.length} 个分类
            </p>
          </header>

          {categoriesWithCount.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {categoriesWithCount.map(({ name, count }) => (
                <Link
                  key={name}
                  href={`/categories/${encodeURIComponent(name)}`}
                  className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                    <span className="font-medium">{name}</span>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground group-hover:bg-background">
                    {count} 篇
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">
              暂无分类
            </p>
          )}
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
