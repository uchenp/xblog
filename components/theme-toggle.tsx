'use client'

import * as React from 'react'
import { Check, Monitor, Moon, Palette, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { COLOR_THEMES } from '@/lib/color-themes'
import { useColorTheme } from '@/components/color-theme-provider'

const MODES = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '系统', icon: Monitor },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { colorTheme, setColorTheme } = useColorTheme()
  const [mounted, setMounted] = React.useState(false)

  // 避免服务端渲染不匹配
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <Palette className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Palette className="h-4 w-4 transition-all" />
          <span className="sr-only">主题设置</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[224px] p-3">
        {/* 明暗模式 */}
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          外观模式
        </p>
        <div className="grid grid-cols-3 gap-1">
          {MODES.map((mode) => {
            const Icon = mode.icon
            const active = theme === mode.value
            return (
              <button
                key={mode.value}
                onClick={() => setTheme(mode.value)}
                className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs transition-colors ${
                  active
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {mode.label}
              </button>
            )
          })}
        </div>

        {/* 色彩主题 */}
        <p className="mt-3 mb-2 text-xs font-medium text-muted-foreground">
          色彩主题
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          {COLOR_THEMES.map((t) => {
            const active = colorTheme === t.name
            return (
              <button
                key={t.name}
                onClick={() => setColorTheme(t.name)}
                title={t.label}
                className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-xs transition-colors ${
                  active
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border/60 text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <span
                  className="relative h-4 w-4 shrink-0 rounded-full border border-border/50"
                  style={{
                    background: `linear-gradient(135deg, ${t.light} 50%, ${t.dark} 50%)`,
                  }}
                >
                  {active && (
                    <Check className="absolute inset-0 m-auto h-3 w-3 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" />
                  )}
                </span>
                {t.label}
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
