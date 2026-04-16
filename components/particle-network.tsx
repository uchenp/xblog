'use client'

import { useEffect, useRef, useCallback } from 'react'

interface ParticleNetworkProps {
  className?: string
}

// 渐变光晕 + 流动光波纹效果
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

    // 渐变光晕 1 - 左上角
    const gradient1 = ctx.createRadialGradient(
      width * 0.2 + Math.sin(time * 0.3) * 80,
      height * 0.3 + Math.cos(time * 0.2) * 40,
      0,
      width * 0.2,
      height * 0.3,
      Math.max(width, height) * 0.5
    )
    if (isDark) {
      gradient1.addColorStop(0, 'rgba(99, 102, 241, 0.08)')
      gradient1.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)')
      gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)')
    } else {
      gradient1.addColorStop(0, 'rgba(99, 102, 241, 0.06)')
      gradient1.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)')
      gradient1.addColorStop(1, 'rgba(255, 255, 255, 0)')
    }
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
    if (isDark) {
      gradient2.addColorStop(0, 'rgba(236, 72, 153, 0.06)')
      gradient2.addColorStop(0.5, 'rgba(244, 114, 182, 0.03)')
      gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)')
    } else {
      gradient2.addColorStop(0, 'rgba(236, 72, 153, 0.04)')
      gradient2.addColorStop(0.5, 'rgba(244, 114, 182, 0.02)')
      gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)')
    }
    ctx.fillStyle = gradient2
    ctx.fillRect(0, 0, width, height)

    // 流动光波纹 - 从中心向外扩散的圆环
    const centerX = width * 0.5
    const centerY = height * 0.5
    const waveCount = 3

    for (let i = 0; i < waveCount; i++) {
      const phase = (time * 0.5 + i * 0.33) % 1
      const radius = phase * Math.max(width, height) * 0.6
      const opacity = (1 - phase) * 0.04

      if (isDark) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`
        ctx.lineWidth = 2
        ctx.stroke()
      } else {
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    // 鼠标跟随光点
    if (mouse.x > 0 && mouse.y > 0) {
      const mouseGradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 150
      )
      if (isDark) {
        mouseGradient.addColorStop(0, 'rgba(167, 139, 250, 0.12)')
        mouseGradient.addColorStop(1, 'rgba(167, 139, 250, 0)')
      } else {
        mouseGradient.addColorStop(0, 'rgba(99, 102, 241, 0.08)')
        mouseGradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
      }
      ctx.fillStyle = mouseGradient
      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2)
      ctx.fill()
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
