'use client'

import { useState, useEffect } from 'react'
import { ArrowUpRight, ArrowDownRight, Minus, BarChart3 } from 'lucide-react'
import { CollapsibleSection } from '@/components/collapsible-section'
import { macroIndicators, getCategoryLabel, getCategoryColor, type MacroIndicator } from '@/lib/macro-data'

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

const indicatorConfig: Array<{
  key: keyof ApiResponse
  id: string
  name: string
  nameEn: string
  unit: string
  category: MacroIndicator['category']
}> = [
  { key: 'gdp', id: 'gdp', name: 'GDP 增速', nameEn: 'GDP Growth', unit: '%', category: 'growth' },
  { key: 'pmi', id: 'pmi', name: '制造业 PMI', nameEn: 'Manufacturing PMI', unit: '', category: 'growth' },
  { key: 'cpi', id: 'cpi', name: 'CPI', nameEn: 'Consumer Price Index', unit: '%', category: 'inflation' },
  { key: 'ppi', id: 'ppi', name: 'PPI', nameEn: 'Producer Price Index', unit: '%', category: 'inflation' },
  { key: 'm2', id: 'm2', name: 'M2 增速', nameEn: 'M2 Growth', unit: '%', category: 'finance' },
  { key: 'exports', id: 'exports', name: '出口增速', nameEn: 'Export Growth', unit: '%', category: 'trade' },
  { key: 'imports', id: 'imports', name: '进口增速', nameEn: 'Import Growth', unit: '%', category: 'trade' },
  { key: 'social_financing', id: 'social_financing', name: '社融增量', nameEn: 'Total Social Financing', unit: '万亿', category: 'finance' },
  { key: 'fixed_asset', id: 'fixed_asset', name: '固定资产投资', nameEn: 'Fixed Asset Investment', unit: '%', category: 'growth' },
  { key: 'lpr', id: 'lpr', name: 'LPR (1年)', nameEn: 'Loan Prime Rate (1Y)', unit: '%', category: 'finance' },
]

const categories = [
  { key: 'all', label: '全部' },
  { key: 'growth', label: '增长' },
  { key: 'inflation', label: '通胀' },
  { key: 'employment', label: '就业' },
  { key: 'trade', label: '贸易' },
  { key: 'finance', label: '金融' },
  { key: 'property', label: '地产' },
] as const

function IndicatorCard({ indicator }: { indicator: MacroIndicator }) {
  const isPositive = (indicator.yoy ?? 0) > 0
  const isNeutral = (indicator.yoy ?? 0) === 0
  const isUnemployment = indicator.id === 'urban_unemployment'
  const isGood = isUnemployment ? !isPositive : isPositive

  return (
    <div className="group rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground truncate">
              {indicator.name}
            </span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${getCategoryColor(indicator.category)}`}>
              {getCategoryLabel(indicator.category)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{indicator.nameEn}</p>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">
              {indicator.latestValue}
            </span>
            {indicator.unit && (
              <span className="text-sm text-muted-foreground">{indicator.unit}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{indicator.period}</p>
        </div>

        <div className="text-right">
          {indicator.yoy !== null && (
            <div className={`flex items-center gap-0.5 text-xs font-medium ${
              isGood ? 'text-green-600 dark:text-green-400' : 
              isNeutral ? 'text-muted-foreground' : 
              'text-red-600 dark:text-red-400'
            }`}>
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : isNeutral ? (
                <Minus className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              <span>{Math.abs(indicator.yoy).toFixed(1)}%</span>
            </div>
          )}
          {indicator.mom !== null && (
            <p className="text-[10px] text-muted-foreground mt-0.5">
              环比 {indicator.mom > 0 ? '+' : ''}{indicator.mom.toFixed(1)}%
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function MacroDataCards() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)

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

  // 合并 API 数据和静态数据
  const mergedIndicators: MacroIndicator[] = indicatorConfig.map((config) => {
    const apiItem = apiData?.[config.key]
    const staticItem = macroIndicators.find((i) => i.id === config.id)

    if (apiItem) {
      return {
        id: config.id,
        name: config.name,
        nameEn: config.nameEn,
        latestValue: apiItem.latestValue,
        previousValue: apiItem.previousValue,
        unit: config.unit,
        period: apiItem.period,
        publishDate: apiItem.publishDate,
        yoy: apiItem.yoy,
        mom: null,
        trend: apiItem.trend,
        category: config.category,
      }
    }

    return staticItem!
  }).filter(Boolean)

  const filteredIndicators = activeCategory === 'all'
    ? mergedIndicators
    : mergedIndicators.filter((i) => i.category === activeCategory)

  const summary = `${mergedIndicators.length} 项指标 · ${mergedIndicators[0]?.period}`

  if (loading) {
    return (
      <CollapsibleSection title="经济指标" summary="加载中...">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-24 mb-3" />
              <div className="h-8 bg-muted rounded w-32 mb-2" />
              <div className="h-3 bg-muted rounded w-20" />
            </div>
          ))}
        </div>
      </CollapsibleSection>
    )
  }

  return (
    <CollapsibleSection title="经济指标" summary={summary}>
      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeCategory === cat.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 指标卡片网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIndicators.map((indicator) => (
          <IndicatorCard key={indicator.id} indicator={indicator} />
        ))}
      </div>

      {filteredIndicators.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          该分类暂无数据
        </div>
      )}
    </CollapsibleSection>
  )
}
