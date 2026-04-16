'use client'

import { useState, useMemo } from 'react'
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { CollapsibleSection } from '@/components/collapsible-section'
import {
  economicCalendar,
  getCountryStyle,
  getImportanceLabel,
  getImportanceStyle,
  type EconomicEvent,
} from '@/lib/economic-calendar'

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = weekdays[date.getDay()]
  return `${month}月${day}日 ${weekday}`
}

function EventRow({ event }: { event: EconomicEvent }) {
  const [expanded, setExpanded] = useState(false)
  const countryStyle = getCountryStyle(event.country)

  return (
    <div
      className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/30 transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="grid grid-cols-12 gap-2 py-3 px-4 items-center">
        <div className="col-span-3 sm:col-span-2 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-xs font-medium text-foreground">{formatDisplayDate(event.date)}</p>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {event.time}
            </p>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex justify-center">
          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${countryStyle.bg}`}>
            {countryStyle.flag}
          </span>
        </div>

        <div className="col-span-5 sm:col-span-6">
          <p className="text-sm font-medium text-foreground truncate">{event.indicator}</p>
          {expanded && (
            <p className="text-[10px] text-muted-foreground mt-0.5">{event.indicatorEn}</p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-3 flex justify-end items-center gap-2">
          {event.forecast && (
            <span className="hidden sm:inline text-xs text-muted-foreground">
              预期 {event.forecast}
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${getImportanceStyle(event.importance)}`}>
            {getImportanceLabel(event.importance)}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-3 pt-1 bg-muted/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[10px] text-muted-foreground">前值</p>
              <p className="text-sm font-medium text-foreground">{event.previous || '-'}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">预期</p>
              <p className="text-sm font-medium text-foreground">{event.forecast || '-'}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">公布</p>
              <p className="text-sm font-medium text-foreground">{event.actual || '待公布'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function EconomicCalendarWidget() {
  const [selectedCountry, setSelectedCountry] = useState<string>('all')

  const countries = useMemo(() => {
    const seen = new Set<string>()
    return economicCalendar.filter((e) => {
      if (seen.has(e.country)) return false
      seen.add(e.country)
      return true
    })
  }, [])

  const filteredEvents = useMemo(() => {
    return economicCalendar
      .filter((e) => selectedCountry === 'all' || e.country === selectedCountry)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  }, [selectedCountry])

  const groupedEvents = useMemo(() => {
    const groups: Record<string, EconomicEvent[]> = {}
    filteredEvents.forEach((event) => {
      if (!groups[event.date]) groups[event.date] = []
      groups[event.date].push(event)
    })
    return groups
  }, [filteredEvents])

  const summary = `${filteredEvents.length} 项数据发布`

  return (
    <CollapsibleSection title="宏观日历" summary={summary}>
      {/* 国家筛选 */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setSelectedCountry('all')}
          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedCountry === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          }`}
        >
          全部
        </button>
        {countries.map((c) => {
          const style = getCountryStyle(c.country)
          return (
            <button
              key={c.country}
              onClick={() => setSelectedCountry(c.country)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCountry === c.country
                  ? 'bg-primary text-primary-foreground'
                  : `${style.bg} ${style.text} hover:opacity-80`
              }`}
            >
              {style.flag} {c.countryName}
            </button>
          )
        })}
      </div>

      {/* 事件列表 */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 py-3 px-4 bg-muted/50 text-xs font-medium text-muted-foreground">
          <div className="col-span-3 sm:col-span-2">日期/时间</div>
          <div className="col-span-2 sm:col-span-1 text-center">国家</div>
          <div className="col-span-5 sm:col-span-6">指标</div>
          <div className="col-span-2 sm:col-span-3 text-right">重要程度</div>
        </div>

        {Object.entries(groupedEvents).map(([date, events]) => (
          <div key={date}>
            {events.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            该筛选条件下暂无数据
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <span className="shrink-0 mt-0.5">💡</span>
        <p>
          点击事件可展开查看前值、预期值和公布值。数据来源于各国统计局和央行公开信息，仅供参考。
        </p>
      </div>
    </CollapsibleSection>
  )
}
