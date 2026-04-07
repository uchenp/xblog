'use client'

import { useState, useEffect } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { BlogHeader } from '@/components/blog/header'
import { BlogFooter } from '@/components/blog/footer'
import { EnhancedSearch } from '@/components/blog/enhanced-search'
import { HighlightText } from '@/components/blog/highlight-text'

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  tags: string[]
  categories: string[]
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setHasSearched(true)
  }

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true)
        setHasSearched(true)
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
          const data = await response.json()
          setResults(data)
        } catch (error) {
          console.error('Search error:', error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  return (
    <div className="flex min-h-screen flex-col">
      <BlogHeader />
      
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              搜索
            </h1>
            <EnhancedSearch onSearch={handleSearch} onClose={() => {}} initialQuery={query} />
          </header>

          {isLoading && (
            <div className="py-12 text-center text-muted-foreground">
              搜索中...
            </div>
          )}

          {!isLoading && results.length === 0 && hasSearched && (
            <div className="py-12 text-center text-muted-foreground">
              <SearchIcon className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>未找到相关文章</p>
              <p className="text-sm mt-2">试试其他关键词</p>
            </div>
          )}

          {!hasSearched && (
            <div className="py-12 text-center text-muted-foreground">
              <SearchIcon className="mx-auto h-12 w-12 opacity-20 mb-4" />
              <p>输入关键词开始搜索</p>
            </div>
          )}

          {results.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                找到 {results.length} 篇相关文章
              </p>
              <div className="divide-y divide-border">
                {results.map((result) => (
                  <article key={result.slug} className="py-6">
                    <Link href={`/posts/${result.slug}`}>
                      <h2 className="text-xl font-semibold hover:underline">
                        <HighlightText text={result.title} query={query} />
                      </h2>
                    </Link>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      <HighlightText text={result.excerpt} query={query} />
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <time>
                        {format(new Date(result.publishedAt), 'yyyy 年 M 月 d 日', { locale: zhCN })}
                      </time>
                      {result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {result.tags.slice(0, 5).map((tag) => (
                            <Link
                              key={tag}
                              href={`/tags/${encodeURIComponent(tag)}`}
                              className="hover:text-foreground transition-colors"
                            >
                              #{tag}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
