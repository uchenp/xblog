'use client'

import { useEffect, useRef, useCallback } from 'react'

interface RainColumn {
  x: number
  y: number
  speed: number
  chars: string[]
  opacity: number
}

interface DataRainProps {
  className?: string
}

// 数据流下落效果 - 类似黑客帝国数字雨，但显示经济术语
export function DataRain({ className = '' }: DataRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const columnsRef = useRef<RainColumn[]>([])
  const animationFrameRef = useRef<number>(0)

  const FONT_SIZE = 14
  const COLUMN_SPACING = 20

  // 经济相关术语（中英文混合）
  const economicTerms = [
    'GDP', 'CPI', 'PPI', 'PMI', 'M2', '利率', '汇率', '通胀',
    '通缩', '社融', '财政', '货币', '宽松', '紧缩', '加息', '降息',
    '牛市', '熊市', '反弹', '回调', '突破', '支撑', '阻力', '波动',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '+', '-', '%', '↑', '↓', '¥', '$', '€',
    '增长', '消费', '投资', '出口', '进口', '就业', '地产', '金融',
  ]

  const initColumns = useCallback((width: number, height: number) => {
    const columnCount = Math.floor(width / COLUMN_SPACING)
    const columns: RainColumn[] = []

    for (let i = 0; i < columnCount; i++) {
      const chars: string[] = []
      const columnHeight = Math.floor(height / FONT_SIZE)
      for (let j = 0; j < columnHeight; j++) {
        chars.push(
          economicTerms[Math.floor(Math.random() * economicTerms.length)]
        )
      }

      columns.push({
        x: i * COLUMN_SPACING + COLUMN_SPACING / 2,
        y: Math.random() * height,
        speed: Math.random() * 1 + 0.5,
        chars,
        opacity: Math.random() * 0.15 + 0.03,
      })
    }

    columnsRef.current = columns
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const columns = columnsRef.current

    const isDark = document.documentElement.classList.contains('dark')

    // 半透明覆盖实现拖尾效果
    ctx.fillStyle = isDark
      ? 'rgba(0, 0, 0, 0.05)'
      : 'rgba(255, 255, 255, 0.05)'
    ctx.fillRect(0, 0, width, height)

    const baseColor = isDark ? '140, 160, 255' : '80, 100, 220'
    const headColor = isDark ? '180, 200, 255' : '60, 80, 200'

    columns.forEach((column) => {
      // 随机更新字符
      if (Math.random() < 0.02) {
        const idx = Math.floor(column.y / FONT_SIZE)
        if (idx >= 0 && idx < column.chars.length) {
          column.chars[idx] =
            economicTerms[Math.floor(Math.random() * economicTerms.length)]
        }
      }

      // 绘制列中的字符
      const startIdx = Math.floor(column.y / FONT_SIZE)
      const drawCount = 15 // 每列显示约 15 个字符

      for (let i = 0; i < drawCount; i++) {
        const charIdx = startIdx - i
        if (charIdx < 0 || charIdx >= column.chars.length) continue

        const charY = column.y - i * FONT_SIZE
        if (charY < 0 || charY > height) continue

        // 头部字符更亮
        const isHead = i === 0
        const fadeFactor = 1 - i / drawCount
        const opacity = column.opacity * fadeFactor * (isHead ? 2 : 1)

        ctx.font = `${isHead ? 'bold ' : ''}${FONT_SIZE - 2}px monospace`
        ctx.fillStyle = isHead
          ? `rgba(${headColor}, ${Math.min(opacity * 2, 0.6)})`
          : `rgba(${baseColor}, ${opacity})`

        // 随机决定是否显示（让效果更稀疏自然）
        if (Math.random() < 0.3) {
          ctx.fillText(column.chars[charIdx], column.x, charY)
        }
      }

      // 更新位置
      column.y += column.speed

      // 重置到顶部
      if (column.y - drawCount * FONT_SIZE > height) {
        column.y = -FONT_SIZE * 5
        column.speed = Math.random() * 1 + 0.5
        column.opacity = Math.random() * 0.15 + 0.03
      }
    })

    animationFrameRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      initColumns(canvas.width, canvas.height)

      // 清屏
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const isDark = document.documentElement.classList.contains('dark')
        ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [initColumns, animate])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}
