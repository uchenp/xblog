'use client'

import { useEffect, useRef, useCallback } from 'react'

interface DataRainProps {
  className?: string
}

// 微妙噪点纹理 - 增加质感
export function DataRain({ className = '' }: DataRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // 只在初始化时绘制一次噪点
    const imageData = ctx.createImageData(width, height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 15
      data[i] = noise
      data[i + 1] = noise
      data[i + 2] = noise
      data[i + 3] = 8
    }

    ctx.putImageData(imageData, 0, 0)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      draw()
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1, opacity: 0.4 }}
    />
  )
}
