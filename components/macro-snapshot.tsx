'use client'

import { useEffect, useState, useCallback } from 'react'
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import { macroIndicators, getCategoryColor } from '@/lib/macro-data'

// 所有指标分组，每页 4 个
const pages = [
  macroIndicators.filter((item) => ['gdp', 'pmi', 'cpi', 'm2'].includes(item.id)),
  macroIndicators.filter((item) => ['exports', 'imports', 'ppi', 'social_financing'].includes(item.id)),
  macroIndicators.filter((item) => ['urban_unemployment', 'property_sales'].includes(item.id)),
]

const AUTO_PLAY_INTERVAL = 5000

export function MacroSnapshot() {
  const [currentPage, setCurrentPage] = useState(0)

  const goToNext = useCallback(() => {
    setCurrentPage((prev) => (prev + 1) % pages.length)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length)
  }, [])

  // 自动轮播
  useEffect(() => {
    const timer = setInterval(goToNext, AUTO_PLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [goToNext])

  const indicators = pages[currentPage]

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {indicators.map((indicator) => (
          <div
            key={indicator.id}
            className="rounded-lg border border-border/50 bg-background/60 backdrop-blur-sm p-3 sm:p-4 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{indicator.name}</span>
              {indicator.trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : indicator.trend === 'down' ? (
                <TrendingDown className="h-3 w-3 text-red-500" />
              ) : (
                <Minus className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold tracking-tight">
                {indicator.latestValue}
                {indicator.unit}
              </span>
              {indicator.yoy !== null && (
                <span
                  className={`text-xs font-medium ${
                    indicator.yoy >= 0 ? 'text-emerald-500' : 'text-red-500'
                  }`}
                >
                  {indicator.yoy >= 0 ? '+' : ''}
                  {indicator.yoy}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${getCategoryColor(indicator.category)}`}
              >
                {getCategoryLabel(indicator.category)}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {indicator.period}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 轮播控制 */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={goToPrev}
          className="p-1 rounded-full hover:bg-background/80 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="上一页"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentPage
                  ? 'w-6 bg-primary'
                  : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`第 ${i + 1} 页`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="p-1 rounded-full hover:bg-background/80 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="下一页"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    growth: '增长',
    inflation: '通胀',
    employment: '就业',
    trade: '贸易',
    finance: '金融',
    property: '地产',
  }
  return labels[category] || category
}
