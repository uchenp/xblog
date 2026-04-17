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

  // 从 API 获取核心指标
  useEffect(() => {
    fetch('/api/macro-data')
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        setApiData(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // 合并 API 数据和静态数据
  const buildPages = useCallback(() => {
    const d = apiData
    const page1: any[] = []

    // GDP
    if (d?.gdp) {
      page1.push({
        id: 'gdp',
        name: 'GDP 增速',
        latestValue: d.gdp.latestValue,
        previousValue: d.gdp.previousValue,
        unit: '%',
        period: d.gdp.period,
        yoy: d.gdp.yoy,
        trend: d.gdp.trend,
        category: 'growth' as const,
      })
    }

    // PMI
    if (d?.pmi) {
      page1.push({
        id: 'pmi',
        name: '制造业 PMI',
        latestValue: d.pmi.latestValue,
        previousValue: d.pmi.previousValue,
        unit: '',
        period: d.pmi.period,
        yoy: d.pmi.yoy,
        trend: d.pmi.trend,
        category: 'growth' as const,
      })
    }

    // CPI
    if (d?.cpi) {
      page1.push({
        id: 'cpi',
        name: 'CPI',
        latestValue: d.cpi.latestValue,
        previousValue: d.cpi.previousValue,
        unit: '%',
        period: d.cpi.period,
        yoy: d.cpi.yoy,
        trend: d.cpi.trend,
        category: 'inflation' as const,
      })
    }

    // M2
    if (d?.m2) {
      page1.push({
        id: 'm2',
        name: 'M2 增速',
        latestValue: d.m2.latestValue,
        previousValue: d.m2.previousValue,
        unit: '%',
        period: d.m2.period,
        yoy: d.m2.yoy,
        trend: d.m2.trend,
        category: 'finance' as const,
      })
    }

    // 如果 API 数据不足，用静态数据兜底
    const fallback = macroIndicators.filter((item) =>
      ['gdp', 'pmi', 'cpi', 'm2'].includes(item.id)
    )

    const final = page1.length > 0 ? page1 : fallback

    // 其他页仍然用静态数据
    const page2 = macroIndicators.filter((item) =>
      ['exports', 'imports', 'ppi', 'social_financing'].includes(item.id)
    )
    const page3 = macroIndicators.filter((item) =>
      ['urban_unemployment', 'property_sales'].includes(item.id)
    )

    const allPages = [final]
    if (page2.length > 0) allPages.push(page2)
    if (page3.length > 0) allPages.push(page3)

    return allPages
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
