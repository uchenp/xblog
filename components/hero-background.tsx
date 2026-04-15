'use client'

import { ParticleNetwork } from './particle-network'
import { DataRain } from './data-rain'

// 首页 Hero 区域的动态背景 - 粒子网络 + 数据流
export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <ParticleNetwork />
      <DataRain />
    </div>
  )
}
