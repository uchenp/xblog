'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Command } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { HighlightText } from './highlight-text'

interface Post {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  tags: string[]
  categories: string[]
}

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      fetch('/api/search')
        .then((res) => res.json())
        .then((data) => {
          setPosts(data)
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    }
  }, [open])

  // Cmd+K / Ctrl+K 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: ['title', 'excerpt', 'tags', 'categories'],
      threshold: 0.3,
      minMatchCharLength: 2,
      includeMatches: true,
    })
  }, [posts])

  const results = useMemo(() => {
    if (!searchQuery.trim()) return []
    return fuse.search(searchQuery).slice(0, 10)
  }, [searchQuery, fuse])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-accent rounded-md transition-colors" aria-label="搜索文章">
          <Search className="h-5 w-5" />
          <span className="sr-only">搜索文章</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>搜索文章</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-muted rounded border">
              <Command className="h-3 w-3" />K
            </kbd>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input
            placeholder="输入关键词搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            aria-label="搜索关键词"
          />
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              加载中...
            </div>
          )}
          {results.length > 0 && (
            <div className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
              {results.map(({ item }) => (
                <Link
                  key={item.slug}
                  href={`/posts/${item.slug}`}
                  className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <h3 className="font-semibold text-sm">
                    <HighlightText text={item.title} query={searchQuery} />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    <HighlightText text={item.excerpt} query={searchQuery} />
                  </p>
                </Link>
              ))}
            </div>
          )}
          {searchQuery.trim() && results.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              未找到匹配的文章
            </div>
          )}
          {!searchQuery.trim() && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>输入关键词开始搜索</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
