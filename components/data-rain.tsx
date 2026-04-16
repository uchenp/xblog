'use client'

import { useEffect, useRef, useCallback } from 'react'

interface FloatingParticle {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  drift: number
}

interface DataRainProps {
  className?: string
}

// 微光粒子效果 - 极其低调的浮动光点
export function DataRain({ className = '' }: DataRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<FloatingParticle[]>([])
  const animationFrameRef = useRef<number>(0)

  const PARTICLE_COUNT = 25

  const initParticles = useCallback((width: number, height: number) => {
    const particles: FloatingParticle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.2 + 0.05,
        opacity: Math.random() * 0.08 + 0.02,
        drift: (Math.random() - 0.5) * 0.15,
      })
    }
    particlesRef.current = particles
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const particles = particlesRef.current

    const isDark = document.documentElement.classList.contains('dark')
    const color = isDark ? '160, 170, 220' : '100, 110, 180'

    particles.forEach((p) => {
      // 缓慢上浮 + 左右漂移
      p.y -= p.speed
      p.x += p.drift

      // 缓慢闪烁
      const flicker = Math.sin(Date.now() * 0.001 + p.x) * 0.03
      const currentOpacity = Math.max(0, p.opacity + flicker)

      // 重置到底部
      if (p.y < -10) {
        p.y = height + 10
        p.x = Math.random() * width
      }
      if (p.x < -10) p.x = width + 10
      if (p.x > width + 10) p.x = -10

      // 绘制光晕
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
      gradient.addColorStop(0, `rgba(${color}, ${currentOpacity})`)
      gradient.addColorStop(0.5, `rgba(${color}, ${currentOpacity * 0.3})`)
      gradient.addColorStop(1, `rgba(${color}, 0)`)

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
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
      initParticles(canvas.width, canvas.height)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [initParticles, animate])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}
