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

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
  life: number
  maxLife: number
}

// 暗色模式：闪烁星星 + 流星 / 亮色模式：渐变光晕
export function ParticleNetwork({ className = '' }: ParticleNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const shootingStarsRef = useRef<ShootingStar[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animationFrameRef = useRef<number>(0)
  const lastShootingStarTime = useRef(0)

  const STAR_COUNT = 150
  const SHOOTING_STAR_INTERVAL = 4000 // 每 4 秒尝试生成流星

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
      // 深邃渐变夜空：从上方的深靛蓝到下方略浅的蓝紫，营造高远感
      const skyGradient = ctx.createLinearGradient(0, 0, 0, height)
      skyGradient.addColorStop(0, '#050814')      // 天顶：极深蓝
      skyGradient.addColorStop(0.4, '#0a1128')    // 中部：深靛蓝
      skyGradient.addColorStop(0.7, '#121d40')    // 中下：蓝紫
      skyGradient.addColorStop(1, '#1a2850')      // 地平线：略亮的蓝灰
      ctx.fillStyle = skyGradient
      ctx.fillRect(0, 0, width, height)

      // 微弱的大气辉光（地平线附近）
      const horizonGlow = ctx.createRadialGradient(
        width * 0.5, height, 0,
        width * 0.5, height, height * 0.6
      )
      horizonGlow.addColorStop(0, 'rgba(30, 60, 120, 0.15)')
      horizonGlow.addColorStop(0.5, 'rgba(20, 40, 100, 0.05)')
      horizonGlow.addColorStop(1, 'rgba(10, 20, 60, 0)')
      ctx.fillStyle = horizonGlow
      ctx.fillRect(0, height * 0.4, width, height * 0.6)

      // 随机生成流星
      if (time - lastShootingStarTime.current > SHOOTING_STAR_INTERVAL) {
        if (Math.random() < 0.3) { // 30% 概率生成
          shootingStarsRef.current.push({
            x: Math.random() * width * 0.8,
            y: Math.random() * height * 0.4,
            length: Math.random() * 80 + 60,
            speed: Math.random() * 8 + 6,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3, // 约 45 度角
            opacity: 1,
            life: 0,
            maxLife: Math.random() * 40 + 30,
          })
        }
        lastShootingStarTime.current = time
      }

      drawStars(ctx, width, height, mouse, time, shootingStarsRef.current, starsRef.current)

      // 更新流星
      shootingStarsRef.current = shootingStarsRef.current.filter((s) => {
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.life++
        // 渐隐
        s.opacity = Math.max(0, 1 - s.life / s.maxLife)
        return s.life < s.maxLife
      })
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
      className={`absolute inset-0 w-full h-full pointer-events-auto rounded-b-2xl ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}

// 暗色模式：闪烁星星 + 流星
function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mouse: { x: number; y: number },
  time: number,
  shootingStars: ShootingStar[],
  stars: Star[]
) {
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

    // 星星光晕（偏冷蓝白，更贴近真实夜空）
    const gradient = ctx.createRadialGradient(
      star.x, star.y, 0,
      star.x, star.y, star.radius * 3
    )
    gradient.addColorStop(0, `rgba(220, 235, 255, ${opacity})`)
    gradient.addColorStop(0.3, `rgba(180, 200, 245, ${opacity * 0.4})`)
    gradient.addColorStop(1, `rgba(220, 235, 255, 0)`)

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

  // 绘制流星
  shootingStars.forEach((star) => {
    const tailX = star.x - Math.cos(star.angle) * star.length
    const tailY = star.y - Math.sin(star.angle) * star.length

    // 流星尾巴渐变
    const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y)
    gradient.addColorStop(0, `rgba(255, 255, 255, 0)`)
    gradient.addColorStop(0.7, `rgba(200, 220, 255, ${star.opacity * 0.3})`)
    gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity * 0.8})`)

    ctx.strokeStyle = gradient
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(tailX, tailY)
    ctx.lineTo(star.x, star.y)
    ctx.stroke()

    // 流星头部光点
    const headGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 4)
    headGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
    headGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
    ctx.fillStyle = headGradient
    ctx.beginPath()
    ctx.arc(star.x, star.y, 4, 0, Math.PI * 2)
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

// 亮色模式：飘动的云 + 柔和光斑
function drawGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mouse: { x: number; y: number },
  time: number
) {
  // 底色：浅蓝天空
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height)
  skyGradient.addColorStop(0, '#7EB8E8')
  skyGradient.addColorStop(0.5, '#A3D4F5')
  skyGradient.addColorStop(1, '#CDE8F9')
  ctx.fillStyle = skyGradient
  ctx.fillRect(0, 0, width, height)

  // 飘动的云朵
  drawClouds(ctx, width, height, time)

  // 柔和光斑（和天空蓝协调）
  const gradient1 = ctx.createRadialGradient(
    width * 0.25 + Math.sin(time * 0.0003) * 80,
    height * 0.35 + Math.cos(time * 0.0002) * 40,
    0,
    width * 0.25,
    height * 0.35,
    Math.max(width, height) * 0.45
  )
  gradient1.addColorStop(0, 'rgba(255, 255, 255, 0.12)')
  gradient1.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)')
  gradient1.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient1
  ctx.fillRect(0, 0, width, height)

  const gradient2 = ctx.createRadialGradient(
    width * 0.75 + Math.cos(time * 0.00025) * 60,
    height * 0.65 + Math.sin(time * 0.00035) * 50,
    0,
    width * 0.75,
    height * 0.65,
    Math.max(width, height) * 0.4
  )
  gradient2.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
  gradient2.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)')
  gradient2.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient2
  ctx.fillRect(0, 0, width, height)

  // 微小的漂浮粒子（类似尘埃在阳光中的效果）
  drawLightParticles(ctx, width, height, time)

  // 鼠标光晕
  if (mouse.x > 0 && mouse.y > 0) {
    const mouseGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150)
    mouseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)')
    mouseGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = mouseGradient
    ctx.beginPath()
    ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2)
    ctx.fill()
  }
}

// 飘动的云朵
function drawClouds(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  const cloudCount = 5
  for (let i = 0; i < cloudCount; i++) {
    // 每朵云以不同速度从左向右飘动
    const speed = 0.00004 + i * 0.000015
    const cycleDuration = width / speed
    const progress = ((time * speed) % cycleDuration) / cycleDuration
    
    // 垂直方向轻微波动
    const baseY = (0.12 + (i % 3) * 0.2) * height
    const yWobble = Math.sin(time * 0.0003 + i * 1.5) * 20
    const scale = 0.5 + (i % 3) * 0.25
    const opacity = 0.08 + (i % 2) * 0.06

    // 从左到右，超出屏幕后回到左边
    const x = progress * (width + 200) - 100
    const y = baseY + yWobble

    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scale, scale)

    ctx.fillStyle = `rgba(255, 255, 255, ${opacity + 0.15})`
    
    ctx.beginPath()
    ctx.arc(0, 0, 50, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(-35, 8, 35, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(30, 5, 40, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(-10, -20, 30, 0, Math.PI * 2)
    ctx.fill()
    
    ctx.beginPath()
    ctx.arc(15, -15, 25, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }
}

// 阳光中的漂浮粒子
function drawLightParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  const count = 30
  for (let i = 0; i < count; i++) {
    const seed = i * 137.508
    const x = ((seed * 0.7 + time * 0.00003 * (0.5 + (i % 3) * 0.3)) % width)
    const y = ((seed * 0.3 + Math.sin(time * 0.0001 + i) * 30) % height)
    const radius = 1.5 + (i % 3) * 1.2
    const opacity = 0.15 + Math.sin(time * 0.002 + i * 0.5) * 0.08

    ctx.fillStyle = `rgba(180, 190, 210, ${opacity})`
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }
}
