'use client'

import { useState, useEffect } from 'react'
import { Search, History, TrendingUp, X } from 'lucide-react'

interface EnhancedSearchProps {
  onSearch: (query: string) => void
  onClose: () => void
  initialQuery?: string
}

export function EnhancedSearch({ onSearch, onClose, initialQuery = '' }: EnhancedSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('search-history')
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [])

  // 保存搜索历史
  const saveToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem('search-history', JSON.stringify(newHistory))
  }

  // 清除历史
  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('search-history')
  }

  // 处理搜索
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      saveToHistory(searchQuery)
      onSearch(searchQuery)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <div className="relative">
      {/* 搜索框 */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowHistory(true)}
          placeholder="搜索文章..."
          className="
            w-full pl-10 pr-10 py-3 rounded-lg
            border border-border bg-background
            focus:outline-none focus:ring-2 focus:ring-primary
            transition-all
          "
          autoFocus
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* 搜索历史和热门搜索 */}
      {showHistory && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-lg border border-border bg-card shadow-lg z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">搜索历史</h3>
            {searchHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                清除历史
              </button>
            )}
          </div>

          {searchHistory.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchHistory.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSearch(item)}
                  className="
                    inline-flex items-center gap-1 px-3 py-1.5
                    rounded-full bg-muted text-xs
                    hover:bg-accent transition-colors
                  "
                >
                  <History className="h-3 w-3" />
                  {item}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">暂无搜索历史</p>
          )}

          {/* 热门搜索 */}
          <div className="border-t border-border pt-3">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-medium">热门搜索</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'TypeScript', '博客优化', '性能优化'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="
                    inline-flex items-center gap-1 px-3 py-1.5
                    rounded-full bg-muted/50 text-xs
                    hover:bg-accent transition-colors
                  "
                >
                  <TrendingUp className="h-3 w-3 text-red-500" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 点击外部关闭 */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setShowHistory(false)}
          />
        </div>
      )}
    </div>
  )
}
