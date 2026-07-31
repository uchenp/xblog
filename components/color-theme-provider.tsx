'use client'

import * as React from 'react'
import {
  COLOR_THEME_NAMES,
  STORAGE_KEY,
  type ColorThemeName,
} from '@/lib/color-themes'

interface ColorThemeContextValue {
  colorTheme: ColorThemeName
  setColorTheme: (theme: ColorThemeName) => void
}

const ColorThemeContext = React.createContext<
  ColorThemeContextValue | undefined
>(undefined)

export function ColorThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [colorTheme, setColorThemeState] =
    React.useState<ColorThemeName>('default')

  // 挂载后从 localStorage 同步（首帧已由内联脚本设置 data-theme，无闪烁）
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ColorThemeName | null
      if (stored && COLOR_THEME_NAMES.includes(stored)) {
        setColorThemeState(stored)
      }
    } catch {
      // ignore
    }
  }, [])

  const setColorTheme = React.useCallback((theme: ColorThemeName) => {
    setColorThemeState(theme)
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }, [])

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme() {
  const context = React.useContext(ColorThemeContext)
  if (!context) {
    throw new Error('useColorTheme must be used within ColorThemeProvider')
  }
  return context
}
