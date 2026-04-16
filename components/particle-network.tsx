'use client'

import { useEffect, useRef, useCallback } from 'react'

interface ParticleNetworkProps {
  className?: string
}

interface Star {
  x: number
  y: number
  radius: number
  twinkleSpeed: number
  twinkleOffset: number
  baseOpacity: number
}

// 暗色模式：闪烁星星 / 亮色模式：渐变光晕
export function ParticleNetwork({ className = '' }: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animationFrameRef = useRef<number>(0)

  const STAR_COUNT = 150

  const initStars = useCallback((width: number, height: number) => {
    const stars: Star[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        twinkleSpeed: Math.random() * 0.003 + 0.001,
        twinkleOffset: Math.random() * Math.PI * 2,
        baseOpacity: Math.random() * 0.5 + 0.3,
      })
    }
    starsRef.current = stars
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const mouse = mouseRef.current
    const time = Date.now()

    ctx.clearRect(0, 0, width, height)

    const isDark = document.documentElement.classList.contains('dark')

    if (isDark) {
      drawStars(ctx, width, height, mouse, time)
    } else {
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
      initStars(canvas.width, canvas.height)
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

    initStars(canvas.width, canvas.height)
    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [draw, initStars])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}

// 暗色模式：闪烁星星
function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mouse: { x: number; y: number },
  time: number
) {
  const stars = starsRef.current

  stars.forEach((star) => {
    // 闪烁计算
    const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset)
    const opacity = star.baseOpacity * (0.5 + twinkle * 0.5)

    // 十字星光效果（较大的星星）
    if (star.radius > 1.2) {
      const crossSize = star.radius * 4
      const crossOpacity = opacity * 0.3

      // 水平光线
      const hGradient = ctx.createLinearGradient(
        star.x - crossSize, star.y,
        star.x + crossSize, star.y
      )
      hGradient.addColorStop(0, `rgba(255, 255, 255, 0)`)
      hGradient.addColorStop(0.5, `rgba(255, 255, 255, ${crossOpacity})`)
      hGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

      ctx.strokeStyle = hGradient
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(star.x - crossSize, star.y)
      ctx.lineTo(star.x + crossSize, star.y)
      ctx.stroke()

      // 垂直光线
      const vGradient = ctx.createLinearGradient(
        star.x, star.y - crossSize,
        star.x, star.y + crossSize
      )
      vGradient.addColorStop(0, `rgba(255, 255, 255, 0)`)
      vGradient.addColorStop(0.5, `rgba(255, 255, 255, ${crossOpacity})`)
      vGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

      ctx.strokeStyle = vGradient
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(star.x, star.y - crossSize)
      ctx.lineTo(star.x, star.y + crossSize)
      ctx.stroke()
    }

    // 星星光晕
    const gradient = ctx.createRadialGradient(
      star.x, star.y, 0,
      star.x, star.y, star.radius * 3
    )
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
    gradient.addColorStop(0.3, `rgba(200, 220, 255, ${opacity * 0.5})`)
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2)
    ctx.fill()

    // 核心亮点
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 1.2})`
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
    ctx.fill()
  })

  // 鼠标附近的星星更亮
  if (mouse.x > 0 && mouse.y > 0) {
    const mouseGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120)
    mouseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)')
    mouseGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = mouseGradient
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2)
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
  const gradient1 = ctx.createRadialGradient(
    width * 0.2 + Math.sin(time * 0.0003) * 80,
    height * 0.3 + Math.cos(time * 0.0002) * 40,
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

  const gradient2 = ctx.createRadialGradient(
    width * 0.8 + Math.cos(time * 0.00025) * 60,
    height * 0.7 + Math.sin(time * 0.00035) * 50,
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

  const centerX = width * 0.5
  const centerY = height * 0.5
  for (let i = 0; i < 3; i++) {
    const phase = (time * 0.0005 + i * 0.33) % 1
    const radius = phase * Math.max(width, height) * 0.6
    const opacity = (1 - phase) * 0.04
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
    ctx.lineWidth = 2
    ctx.stroke()
  }

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
