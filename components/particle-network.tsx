'use client'

import { useEffect, useRef, useCallback } from 'react'

interface ParticleNetworkProps {
  className?: string
}

// 暗色模式：霓虹灯效果 / 亮色模式：渐变光晕
export function ParticleNetwork({ className = '' }: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animationFrameRef = useRef<number>(0)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const mouse = mouseRef.current
    const time = Date.now() * 0.001

    ctx.clearRect(0, 0, width, height)

    const isDark = document.documentElement.classList.contains('dark')

    if (isDark) {
      // === 暗色模式：霓虹灯效果 ===
      drawNeon(ctx, width, height, mouse, time)
    } else {
      // === 亮色模式：渐变光晕 ===
      drawGradient(ctx, width, height, mouse, time)
    }

    animationFrameRef.current = requestAnimationFrame(draw)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}

// 暗色模式：霓虹灯效果
function drawNeon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mouse: { x: number; y: number },
  time: number
) {
  // 霓虹线条 - 流动的发光线条
  const lineCount = 5
  const neonColors = [
    { r: 0, g: 255, b: 255 },    // 青色
    { r: 255, g: 0, b: 255 },     // 品红
    { r: 0, g: 255, b: 128 },     // 绿色
    { r: 255, g: 100, b: 50 },    // 橙色
    { r: 100, g: 100, b: 255 },   // 蓝色
  ]

  for (let i = 0; i < lineCount; i++) {
    const color = neonColors[i]
    const yOffset = (height / (lineCount + 1)) * (i + 1)
    const amplitude = 30 + Math.sin(time * 0.5 + i) * 15
    const frequency = 0.003 + i * 0.001
    const speed = time * (0.5 + i * 0.2)

    // 绘制发光线条
    ctx.beginPath()
    for (let x = 0; x < width; x += 2) {
      const y = yOffset + Math.sin(x * frequency + speed) * amplitude
      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    // 外层光晕
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`
    ctx.lineWidth = 8
    ctx.shadowBlur = 20
    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`
    ctx.stroke()

    // 中层光晕
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`
    ctx.lineWidth = 3
    ctx.shadowBlur = 10
    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.8)`
    ctx.stroke()

    // 核心亮线
    ctx.strokeStyle = `rgba(${Math.min(color.r + 100, 255)}, ${Math.min(color.g + 100, 255)}, ${Math.min(color.b + 100, 255)}, 0.6)`
    ctx.lineWidth = 1
    ctx.shadowBlur = 5
    ctx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`
    ctx.stroke()
  }

  ctx.shadowBlur = 0 // 重置 shadow

  // 霓虹光点 - 在线条交叉处闪烁
  const dotCount = 20
  for (let i = 0; i < dotCount; i++) {
    const x = (width / dotCount) * i + Math.sin(time * 0.8 + i * 0.5) * 40
    const lineIndex = Math.floor((i % lineCount))
    const yOffset = (height / (lineCount + 1)) * (lineIndex + 1)
    const amplitude = 30 + Math.sin(time * 0.5 + lineIndex) * 15
    const frequency = 0.003 + lineIndex * 0.001
    const speed = time * (0.5 + lineIndex * 0.2)
    const y = yOffset + Math.sin(x * frequency + speed) * amplitude

    const flicker = Math.sin(time * 3 + i * 1.7) * 0.5 + 0.5
    const color = neonColors[lineIndex]
    const size = 2 + flicker * 2

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4)
    gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.6 * flicker})`)
    gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${0.2 * flicker})`)
    gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, size * 4, 0, Math.PI * 2)
    ctx.fill()
  }

  // 鼠标跟随霓虹光点
  if (mouse.x > 0 && mouse.y > 0) {
    const mouseGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100)
    mouseGradient.addColorStop(0, 'rgba(0, 255, 255, 0.15)')
    mouseGradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.08)')
    mouseGradient.addColorStop(1, 'rgba(0, 255, 255, 0)')
    ctx.fillStyle = mouseGradient
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2)
    ctx.fill()
  }
}

// 亮色模式：渐变光晕
function drawGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mouse: { x: number; y: number },
  time: number
) {
  // 渐变光晕 1 - 左上角
  const gradient1 = ctx.createRadialGradient(
    width * 0.2 + Math.sin(time * 0.3) * 80,
    height * 0.3 + Math.cos(time * 0.2) * 40,
    0,
    width * 0.2,
    height * 0.3,
    Math.max(width, height) * 0.5
  )
  gradient1.addColorStop(0, 'rgba(99, 102, 241, 0.06)')
  gradient1.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)')
  gradient1.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient1
  ctx.fillRect(0, 0, width, height)

  // 渐变光晕 2 - 右下角
  const gradient2 = ctx.createRadialGradient(
    width * 0.8 + Math.cos(time * 0.25) * 60,
    height * 0.7 + Math.sin(time * 0.35) * 50,
    0,
    width * 0.8,
    height * 0.7,
    Math.max(width, height) * 0.45
  )
  gradient2.addColorStop(0, 'rgba(236, 72, 153, 0.04)')
  gradient2.addColorStop(0.5, 'rgba(244, 114, 182, 0.02)')
  gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient2
  ctx.fillRect(0, 0, width, height)

  // 流动光波纹
  const centerX = width * 0.5
  const centerY = height * 0.5
  for (let i = 0; i < 3; i++) {
    const phase = (time * 0.5 + i * 0.33) % 1
    const radius = phase * Math.max(width, height) * 0.6
    const opacity = (1 - phase) * 0.04
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // 鼠标跟随光点
  if (mouse.x > 0 && mouse.y > 0) {
    const mouseGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150)
    mouseGradient.addColorStop(0, 'rgba(99, 102, 241, 0.08)')
    mouseGradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
    ctx.fillStyle = mouseGradient
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2)
    ctx.fill()
  }
}
