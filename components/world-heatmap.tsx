'use client'

import { useState, useMemo } from 'react'
import { Globe2, ChevronDown } from 'lucide-react'
import {
  countriesData,
  indicators,
  getColorForValue,
  type IndicatorKey,
  type CountryData,
} from '@/lib/world-heatmap-data'
import { countryPaths } from '@/lib/world-map-paths'

interface TooltipData {
  country: CountryData
  x: number
  y: number
}

export function WorldHeatmap() {
  const [activeIndicator, setActiveIndicator] = useState<IndicatorKey>('gdpGrowth')
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const activeConfig = indicators.find((i) => i.key === activeIndicator)!

  // 构建国家数据映射
  const dataMap = useMemo(() => {
    const map = new Map<string, CountryData>()
    countriesData.forEach((c) => map.set(c.id, c))
    return map
  }, [])

  const handleMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    countryId: string
  ) => {
    const country = dataMap.get(countryId)
    if (!country) return

    const rect = e.currentTarget.getBoundingClientRect()
    const containerRect = e.currentTarget.closest('svg')?.getBoundingClientRect()
    if (!containerRect) return

    setTooltip({
      country,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top,
    })
    setHoveredId(countryId)
  }

  const handleMouseLeave = () => {
    setTooltip(null)
    setHoveredId(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
        <Globe2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">全球经济热力图</h2>
        <span className="text-xs text-muted-foreground">
          点击切换指标，悬停查看详情
        </span>
      </div>

      {/* 指标切换 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {indicators.map((ind) => (
          <button
            key={ind.key}
            onClick={() => setActiveIndicator(ind.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeIndicator === ind.key
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            {ind.label}
          </button>
        ))}
      </div>

      {/* 色阶图例 */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <span className="text-xs text-muted-foreground shrink-0">低</span>
        <div className="flex-1 h-3 rounded-full overflow-hidden flex">
          {activeConfig.colorRange.map((color, i) => (
            <div
              key={i}
              className="flex-1"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground shrink-0">高</span>
      </div>

      {/* SVG 地图 */}
      <div className="relative rounded-xl border border-border bg-card overflow-hidden">
        <svg
          viewBox="0 0 860 380"
          className="w-full h-auto"
          style={{ minHeight: '300px' }}
        >
          {/* 海洋背景 */}
          <rect width="860" height="380" fill="transparent" />

          {/* 国家 */}
          {countryPaths.map((path) => {
            const country = dataMap.get(path.id)
            if (!country) return null

            const value = country[activeConfig.key] as number
            const fillColor = getColorForValue(
              value,
              activeConfig.colorRange,
              activeConfig.ranges
            )
            const isHovered = hoveredId === path.id

            return (
              <g key={path.id}>
                <path
                  d={path.d}
                  fill={fillColor}
                  stroke={isHovered ? '#fff' : 'rgba(255,255,255,0.2)'}
                  strokeWidth={isHovered ? 2 : 0.5}
                  className="cursor-pointer transition-all duration-150"
                  onMouseMove={(e) => handleMouseMove(e, path.id)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    filter: isHovered ? 'brightness(1.2)' : 'none',
                  }}
                />
                {/* 国家代码标签 */}
                {countryPaths.length < 50 && (
                  <text
                    x={path.center.x}
                    y={path.center.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none select-none"
                    style={{
                      fontSize: path.id.length > 2 ? '7px' : '8px',
                      fontWeight: 600,
                      fill: 'rgba(255,255,255,0.8)',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                    }}
                  >
                    {path.id.toUpperCase()}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: Math.min(tooltip.x + 10, 300),
              top: tooltip.y - 10,
              transform: 'translateY(-100%)',
            }}
          >
            <div className="bg-background border border-border rounded-lg shadow-xl p-3 min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getFlagEmoji(tooltip.country.code)}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {tooltip.country.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {tooltip.country.nameEn}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                {indicators.map((ind) => {
                  const val = tooltip.country[ind.key] as number
                  const isActive = ind.key === activeIndicator
                  return (
                    <div
                      key={ind.key}
                      className={`flex justify-between text-xs px-1 py-0.5 rounded ${
                        isActive ? 'bg-primary/10 font-semibold' : ''
                      }`}
                    >
                      <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>
                        {ind.label}
                      </span>
                      <span className={isActive ? 'text-primary' : 'text-foreground'}>
                        {val}{ind.unit}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 数据说明 */}
      <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <span className="shrink-0 mt-0.5">📊</span>
        <p>
          热力图颜色根据当前选中指标的数值映射：绿色表示较低/较好，红色表示较高/较差。
          数据为 2026 年 Q1 估算值，仅供参考。悬停可查看所有指标详情。
        </p>
      </div>
    </div>
  )
}

// 国家代码转国旗 emoji
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}
