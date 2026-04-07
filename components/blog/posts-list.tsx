'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PostCard } from '@/components/blog/post-card'
import type { Post } from '@/lib/posts'
import { Filter, SortAsc, X } from 'lucide-react'

interface PostsListProps {
  posts: Post[]
  tags: string[]
  categories: string[]
}

export function PostsList({ posts, tags, categories }: PostsListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')
  const [showFilters, setShowFilters] = useState(false)

  // 筛选和排序
  const filteredPosts = useMemo(() => {
    let result = [...posts]

    // 按标签筛选
    if (selectedTag) {
      result = result.filter(post => post.tags?.includes(selectedTag))
    }

    // 按分类筛选
    if (selectedCategory) {
      result = result.filter(post => post.categories?.includes(selectedCategory))
    }

    // 排序
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
        break
      case 'popular':
        // 目前按发布时间模拟，后续可以按阅读量排序
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        break
    }

    return result
  }, [posts, selectedTag, selectedCategory, sortBy])

  const clearFilters = () => {
    setSelectedTag(null)
    setSelectedCategory(null)
    setSortBy('newest')
  }

  const hasActiveFilters = selectedTag || selectedCategory || sortBy !== 'newest'

  return (
    <div>
      {/* 工具栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            共 {filteredPosts.length} 篇文章
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              清除筛选
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              p-2 rounded-md transition-colors
              ${showFilters ? 'bg-accent text-accent-foreground' : 'hover:bg-accent'}
            `}
          >
            <Filter className="h-4 w-4" />
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="
              px-3 py-2 rounded-md border border-border
              bg-background text-sm
              focus:outline-none focus:ring-2 focus:ring-primary
            "
          >
            <option value="newest">最新发布</option>
            <option value="oldest">最早发布</option>
            <option value="popular">最受欢迎</option>
          </select>
        </div>
      </div>

      {/* 筛选面板 */}
      {showFilters && (
        <div className="mb-6 p-4 rounded-lg border border-border bg-card">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* 分类筛选 */}
            <div>
              <h3 className="text-sm font-medium mb-2">按分类筛选</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                    ${!selectedCategory
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  全部
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                      ${selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* 标签筛选 */}
            <div>
              <h3 className="text-sm font-medium mb-2">按标签筛选</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`
                    px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                    ${!selectedTag
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  全部
                </button>
                {tags.slice(0, 15).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                      ${selectedTag === tag
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 文章列表 */}
      <div className="divide-y divide-border">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))
        ) : (
          <div className="py-16 text-center">
            <p className="text-muted-foreground mb-4">没有找到符合条件的文章</p>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary/80"
            >
              清除筛选条件
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
