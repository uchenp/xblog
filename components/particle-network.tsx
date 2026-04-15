'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  pulseSpeed: number
  pulseOffset: number
}

interface ParticleNetworkProps {
  className?: string
}

// 粒子网络背景 - 粒子之间连线形成网络效果
export function ParticleNetwork({ className = '' }: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationFrameRef = useRef<number>(0)
  const timeRef = useRef(0)

  const PARTICLE_COUNT = 80
  const CONNECTION_DISTANCE = 150
  const MOUSE_RADIUS = 200

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseOffset: Math.random() * Math.PI * 2,
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

    timeRef.current += 1

    ctx.clearRect(0, 0, width, height)

    // 检测主题
    const isDark = document.documentElement.classList.contains('dark')
    const baseColor = isDark ? '180, 180, 200' : '100, 100, 120'
    const primaryColor = isDark ? '140, 160, 255' : '80, 100, 220'

    // 更新和绘制粒子
    particles.forEach((particle) => {
      // 更新位置
      particle.x += particle.vx
      particle.y += particle.vy

      // 边界反弹
      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      if (particle.y < 0 || particle.y > height) particle.vy *= -1

      // 鼠标交互 - 粒子被鼠标吸引
      const dx = mouse.x - particle.x
      const dy = mouse.y - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02
        particle.vx += (dx / dist) * force
        particle.vy += (dy / dist) * force
      }

      // 速度衰减
      particle.vx *= 0.99
      particle.vy *= 0.99

      // 脉冲效果
      const pulse = Math.sin(timeRef.current * particle.pulseSpeed + particle.pulseOffset) * 0.3 + 0.7
      const currentOpacity = particle.opacity * pulse

      // 绘制粒子
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${primaryColor}, ${currentOpacity})`
      ctx.fill()
    })

    // 绘制连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.3
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    // 鼠标附近的高亮连线
    particles.forEach((particle) => {
      const dx = mouse.x - particle.x
      const dy = mouse.y - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < MOUSE_RADIUS) {
        const opacity = (1 - dist / MOUSE_RADIUS) * 0.5
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.strokeStyle = `rgba(${primaryColor}, ${opacity})`
        ctx.lineWidth = 0.8
        ctx.stroke()
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
      mouseRef.current = { x: -1000, y: -1000 }
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
