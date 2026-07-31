import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { ColorThemeProvider } from '@/components/color-theme-provider'
import { STORAGE_KEY } from '@/lib/color-themes'
import { PWAInstallPrompt } from '@/components/pwa-install-prompt'
import { ScrollToTop } from '@/components/scroll-to-top'
import './globals.css'

// 使用系统字体（避免 Google Fonts 网络问题）
// 如需使用自定义字体，可下载字体文件到本地

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const siteAuthor = process.env.NEXT_PUBLIC_SITE_AUTHOR || 'FelixView'

export const metadata: Metadata = {
  title: {
    default: 'FelixView - 宏观经济分析与分享',
    template: '%s | FelixView',
  },
  description: '聚焦宏观经济数据分析与政策趋势解读',
  keywords: ['宏观经济', '数据分析', '政策趋势', '美联储', '中国经济'],
  authors: [{ name: siteAuthor, url: siteUrl }],
  creator: siteAuthor,
  publisher: 'FelixView',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/rss.xml', title: 'RSS 订阅' }],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteUrl,
    siteName: 'FelixView',
    title: 'FelixView - 宏观经济分析与分享',
    description: '聚焦宏观经济数据分析与政策趋势解读',
    images: [
      {
        url: '/api/og?type=home',
        width: 1200,
        height: 630,
        alt: 'FelixView',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FelixView - 宏观经济分析与分享',
    description: '聚焦宏观经济数据分析与政策趋势解读',
    images: ['/api/og?type=home'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FelixView',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3B82F6' },
    { media: '(prefers-color-scheme: dark)', color: '#9333EA' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('${STORAGE_KEY}');if(t){document.documentElement.setAttribute('data-theme',t)}}catch(e){}`,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background">
        <ThemeProvider>
          <ColorThemeProvider>
            {children}
            <Toaster position="top-center" />
            <Analytics />
            <SpeedInsights />
            <PWAInstallPrompt />
            <ScrollToTop />
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
