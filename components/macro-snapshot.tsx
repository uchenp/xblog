'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { macroIndicators, getCategoryColor } from '@/lib/macro-data'

// 挑选 4 个核心指标在 Hero 区域展示
const coreIndicators = macroIndicators.filter((item) =>
  ['gdp', 'pmi', 'cpi', 'm2'].includes(item.id)
)

export function MacroSnapshot() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {coreIndicators.map((indicator) => (
        <div
          key={indicator.id}
          className="rounded-lg border border-border/50 bg-background/60 backdrop-blur-sm p-3 sm:p-4"
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
