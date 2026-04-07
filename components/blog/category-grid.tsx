import Link from 'next/link'
import { getAllCategories } from '@/lib/posts'
import { Folder } from 'lucide-react'

export async function CategoryGrid() {
  const categories = await getAllCategories()
  
  return (
    <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">文章分类</h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {categories.length} 个分类
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/categories/${encodeURIComponent(category)}`}
            className="
              group flex items-center gap-3 p-4 rounded-lg
              bg-card hover:bg-accent/50
              border border-border hover:border-primary/50
              transition-all duration-200
            "
          >
            <Folder className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium truncate block">
                {category}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
