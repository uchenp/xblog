import Link from 'next/link'
import { Tag } from 'lucide-react'
import { getAllTags } from '@/lib/posts'

export async function TagCloud() {
  const tags = await getAllTags()
  
  // 限制显示前 20 个标签
  const displayTags = tags.slice(0, 20)
  
  return (
    <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-6 sm:pb-14">
      <div className="rounded-xl border border-border/50 bg-card/30 p-6">
        <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">热门标签</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {tags.length} 个标签
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {displayTags.map((tag, index) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                text-sm font-medium transition-all
                hover:scale-105
                ${getTagColor(index)}
              `}
            >
              <Tag className="h-3.5 w-3.5" />
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function getTagColor(index: number): string {
  const colors = [
    'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900',
    'bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900',
    'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900',
    'bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-300 dark:hover:bg-orange-900',
    'bg-pink-50 text-pink-700 hover:bg-pink-100 dark:bg-pink-950 dark:text-pink-300 dark:hover:bg-pink-900',
    'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900',
    'bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 dark:hover:bg-teal-900',
    'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900',
  ]
  
  return colors[index % colors.length]
}
