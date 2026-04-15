'use client'

import { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Minus, BarChart3, Filter } from 'lucide-react'
import { macroIndicators, getCategoryLabel, getCategoryColor, type MacroIndicator } from '@/lib/macro-data'

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

  // 失业率下降是好事，特殊处理
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

  const filteredIndicators = activeCategory === 'all'
    ? macroIndicators
    : macroIndicators.filter((i) => i.category === activeCategory)

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">宏观经济数据</h2>
        <span className="text-xs text-muted-foreground">
          数据更新于 {macroIndicators[0]?.period}
        </span>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-6">
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
    </div>
  )
}
