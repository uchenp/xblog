'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import { macroIndicators, getCategoryColor } from '@/lib/macro-data'

interface ApiIndicator {
  latestValue: number
  previousValue: number
  period: string
  publishDate: string
  yoy: number
  trend: 'up' | 'down' | 'stable'
}

interface ApiResponse {
  gdp?: ApiIndicator
  pmi?: ApiIndicator
  cpi?: ApiIndicator
  m2?: ApiIndicator
  ppi?: ApiIndicator
  exports?: ApiIndicator
  imports?: ApiIndicator
  social_financing?: ApiIndicator
  fixed_asset?: ApiIndicator
  lpr?: ApiIndicator
}

const AUTO_PLAY_INTERVAL = 5000

export function MacroSnapshot() {
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [exitDir, setExitDir] = useState<'left' | 'right' | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 从静态数据文件获取指标（public/data/macro.json，由 npm run fetch:macro 生成）
  useEffect(() => {
    fetch('/data/macro.json')
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        setApiData(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // 合并 API 数据和静态数据，每页 4 个指标
  const buildPages = useCallback(() => {
    const d = apiData
    const ITEMS_PER_PAGE = 4

    const indicatorMap: Array<{ key: keyof ApiResponse; id: string; name: string; unit: string; category: string }> = [
      { key: 'gdp', id: 'gdp', name: 'GDP 增速', unit: '%', category: 'growth' },
      { key: 'pmi', id: 'pmi', name: '制造业 PMI', unit: '', category: 'growth' },
      { key: 'cpi', id: 'cpi', name: 'CPI', unit: '%', category: 'inflation' },
      { key: 'ppi', id: 'ppi', name: 'PPI', unit: '%', category: 'inflation' },
      { key: 'm2', id: 'm2', name: 'M2 增速', unit: '%', category: 'finance' },
      { key: 'exports', id: 'exports', name: '出口增速', unit: '%', category: 'trade' },
      { key: 'imports', id: 'imports', name: '进口增速', unit: '%', category: 'trade' },
      { key: 'social_financing', id: 'social_financing', name: '社融增量', unit: '万亿', category: 'finance' },
      { key: 'fixed_asset', id: 'fixed_asset', name: '固定资产投资', unit: '%', category: 'growth' },
      { key: 'lpr', id: 'lpr', name: 'LPR (1年)', unit: '%', category: 'finance' },
    ]

    const allItems: any[] = []

    // 先收集所有 API 可用指标
    for (const item of indicatorMap) {
      if (d?.[item.key]) {
        allItems.push({
          id: item.id,
          name: item.name,
          latestValue: d[item.key]!.latestValue,
          previousValue: d[item.key]!.previousValue,
          unit: item.unit,
          period: d[item.key]!.period,
          yoy: d[item.key]!.yoy,
          trend: d[item.key]!.trend,
          category: item.category as any,
        })
      }
    }

    // API 不足时用静态数据补齐
    if (allItems.length < 4) {
      const fallbackIds = ['gdp', 'pmi', 'cpi', 'm2']
      for (const sid of fallbackIds) {
        if (!allItems.find((i) => i.id === sid)) {
          const staticItem = macroIndicators.find((m) => m.id === sid)
          if (staticItem) allItems.push(staticItem)
        }
      }
    }

    // 按每页 4 个切分
    const pages: any[][] = []
    for (let i = 0; i < allItems.length; i += ITEMS_PER_PAGE) {
      pages.push(allItems.slice(i, i + ITEMS_PER_PAGE))
    }

    return pages
  }, [apiData])

  const pages = buildPages()

  const resetAutoPlay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        handleNext()
      }, AUTO_PLAY_INTERVAL)
    }
  }, [isPaused])

  const handleNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setExitDir('left')
    setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % pages.length)
      setExitDir(null)
      setIsTransitioning(false)
    }, 350)
  }, [isTransitioning, pages.length])

  const handlePrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setExitDir('right')
    setTimeout(() => {
      setCurrentPage((prev) => (prev - 1 + pages.length) % pages.length)
      setExitDir(null)
      setIsTransitioning(false)
    }, 350)
  }, [isTransitioning, pages.length])

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
  }, [isTransitioning, currentPage, pages.length, resetAutoPlay])

  useEffect(() => {
    if (!isPaused) {
      resetAutoPlay()
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused, resetAutoPlay])

  const indicators = pages[currentPage] || []

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

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-border/50 bg-background/60 backdrop-blur-sm p-3 sm:p-4 animate-pulse"
          >
            <div className="h-3 bg-muted rounded w-16 mb-2" />
            <div className="h-7 bg-muted rounded w-20 mb-2" />
            <div className="h-3 bg-muted rounded w-12" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="mt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative" style={{ minHeight: '120px' }}>
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
              ].map((indicator: any) => (
                <IndicatorCard key={indicator.id} indicator={indicator} />
              ))}
            </div>
          </div>
        )}

        <div
          className="transition-all duration-350 ease-out"
          style={getSlideStyle()}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {indicators.map((indicator: any) => (
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

function IndicatorCard({ indicator }: { indicator: any }) {
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
        {indicator.yoy !== null && indicator.yoy !== undefined && (
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
