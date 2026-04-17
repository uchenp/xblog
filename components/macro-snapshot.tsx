'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      handleNext()
    }, AUTO_PLAY_INTERVAL)
  }, [])

  const handleNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setExitDir('left')
    setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length)
      setExitDir(null)
      setIsTransitioning(false)
    }, 350)
  }, [isTransitioning])

  const handlePrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setExitDir('right')
    setTimeout(() => {
      setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length)
      setExitDir(null)
      setIsTransitioning(false)
    }, 350)
  }, [isTransitioning])

  const handleGoTo = useCallback((page: number) => {
    if (isTransitioning || page === currentPage) return
    setIsTransitioning(true)
    setExitDir(page > currentPage ? 'left' : 'right')
    setTimeout(() => {
      setCurrentPage(page)
      setExitDir(null)
      setIsTransitioning(false)
    }, 350)
    resetAutoPlay()
  }, [isTransitioning, currentPage, resetAutoPlay])

  useEffect(() => {
    resetAutoPlay()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [resetAutoPlay])

  const indicators = pages[currentPage]

  const getSlideStyle = () => {
    if (!exitDir) return { opacity: 1, transform: 'translateX(0)' }
    if (exitDir === 'left') return { opacity: 0, transform: 'translateX(-20px)' }
    return { opacity: 0, transform: 'translateX(20px)' }
  }

  const getEnterStyle = () => {
    if (!exitDir) return {}
    if (exitDir === 'left') return { opacity: 0, transform: 'translateX(20px)' }
    return { opacity: 0, transform: 'translateX(-20px)' }
  }

  return (
    <div className="mt-6">
      <div className="relative" style={{ minHeight: '120px' }}>
        {/* 进入动画层 */}
        {exitDir && (
          <div
            className="absolute inset-0 transition-all duration-350 ease-out"
            style={getEnterStyle()}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {pages[
                exitDir === 'left'
                  ? (currentPage + 1) % pages.length
                  : (currentPage - 1 + pages.length) % pages.length
              ].map((indicator) => (
                <IndicatorCard key={indicator.id} indicator={indicator} />
              ))}
            </div>
          </div>
        )}

        {/* 当前页 */}
        <div
          className="transition-all duration-350 ease-out"
          style={getSlideStyle()}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {indicators.map((indicator) => (
              <IndicatorCard key={indicator.id} indicator={indicator} />
            ))}
          </div>
        </div>
      </div>

      {/* 轮播控制 */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={handlePrev}
          className="p-1 rounded-full hover:bg-background/80 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="上一页"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => handleGoTo(i)}
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
          onClick={handleNext}
          className="p-1 rounded-full hover:bg-background/80 transition-colors text-muted-foreground hover:text-foreground"
          aria-label="下一页"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function IndicatorCard({ indicator }: { indicator: typeof macroIndicators[0] }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/60 backdrop-blur-sm p-3 sm:p-4">
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
