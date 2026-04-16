'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseOpacity: number
}

interface ParticleNetworkProps {
  className?: string
}

// 精致粒子网络 - 类似星空的微妙背景效果
export function ParticleNetwork({ className = '' }: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animationFrameRef = useRef<number>(0)

  const PARTICLE_COUNT = 50
  const CONNECTION_DISTANCE = 120
  const MOUSE_REPEL_RADIUS = 100

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.2 + 0.5,
        baseOpacity: Math.random() * 0.3 + 0.1,
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
    const mouse = mouseRef.current

    ctx.clearRect(0, 0, width, height)

    const isDark = document.documentElement.classList.contains('dark')
    const dotColor = isDark ? '200, 200, 220' : '120, 120, 140'
    const lineColor = isDark ? '160, 160, 190' : '140, 140, 165'

    // 更新和绘制粒子
    particles.forEach((particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // 边界反弹
      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      if (particle.y < 0 || particle.y > height) particle.vy *= -1

      // 鼠标排斥（比吸引更自然）
      const dx = particle.x - mouse.x
      const dy = particle.y - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
        const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS * 0.5
        particle.vx += (dx / dist) * force * 0.01
        particle.vy += (dy / dist) * force * 0.01
      }

      // 速度衰减
      particle.vx *= 0.995
      particle.vy *= 0.995

      // 绘制粒子 - 带微弱光晕
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius * 3
      )
      gradient.addColorStop(0, `rgba(${dotColor}, ${particle.baseOpacity})`)
      gradient.addColorStop(1, `rgba(${dotColor}, 0)`)

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // 核心亮点
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${dotColor}, ${particle.baseOpacity * 1.5})`
      ctx.fill()
    })

    // 绘制连线 - 只连非常近的粒子
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.12
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

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

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [initParticles, animate])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
