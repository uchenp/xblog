'use client'

import { useState } from 'react'
import { Twitter, Link2, Check, MessageCircle, QrCode, X } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  slug: string
  excerpt?: string
}

export function ShareButtons({ title, slug, excerpt }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://felixview.cc'
  const postUrl = `${siteUrl}/posts/${slug}`
  const encodedUrl = encodeURIComponent(postUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(`${title} - FelixView`)

  const shareLinks = [
    {
      name: 'Twitter / X',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      color: 'hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30',
    },
    {
      name: '微信',
      icon: MessageCircle,
      href: '#',
      color: 'hover:bg-[#07C160]/10 hover:text-[#07C160] hover:border-[#07C160]/30',
      action: () => setShowQR(true),
    },
    {
      name: '复制链接',
      icon: copied ? Check : Link2,
      href: '#',
      color: copied
        ? 'bg-green-500/10 text-green-500 border-green-500/30'
        : 'hover:bg-primary/10 hover:text-primary hover:border-primary/30',
      action: () => {
        navigator.clipboard.writeText(postUrl).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      },
    },
  ]

  return (
    <>
      <div className="flex items-center gap-2 mt-8 pt-6 border-t border-border/50">
        <span className="text-xs text-muted-foreground mr-1">分享</span>
        {shareLinks.map((link) => {
          const Icon = link.icon
          const baseClass = `inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border/60 text-muted-foreground transition-all duration-200 ${link.color}`

          if (link.action) {
            return (
              <button
                key={link.name}
                onClick={link.action}
                className={baseClass}
                title={link.name}
                aria-label={link.name}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            )
          }

          return (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={baseClass}
              title={link.name}
              aria-label={link.name}
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          )
        })}
      </div>

      {/* 微信二维码弹窗 */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowQR(false)}>
          <div className="bg-background border border-border rounded-xl p-6 shadow-2xl max-w-xs w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">微信扫码分享</h3>
              <button onClick={() => setShowQR(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodedUrl}`}
                alt="QR Code"
                width={180}
                height={180}
                className="rounded"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">打开微信扫一扫，分享给朋友</p>
          </div>
        </div>
      )}
    </>
  )
}
