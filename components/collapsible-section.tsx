'use client'

import { useState, useId } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string
  summary: React.ReactNode
  children: React.ReactNode
  defaultExpanded?: boolean
}

export function CollapsibleSection({
  title,
  summary,
  children,
  defaultExpanded = false,
}: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const contentId = useId()

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
      {/* 头部 - 始终可见 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-card/50 transition-colors"
        aria-expanded={expanded}
        aria-controls={contentId}
      >
        <div className="flex items-center gap-3 min-w-0">
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <div className="text-sm text-muted-foreground truncate">{summary}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-3">
          <span className="text-xs text-muted-foreground">
            {expanded ? '收起' : '展开'}
          </span>
          <div className="transition-transform duration-300 ease-out">
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {/* 内容 - 可折叠动画 */}
      <div
        id={contentId}
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: expanded ? '1fr' : '0fr',
        }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border/50 px-5 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
