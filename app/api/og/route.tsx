import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

// 使用本地字体，避免外部网络请求
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const fontData = fetch(new URL(`${siteUrl}/fonts/NotoSansSC-Regular.ttf`)).then((res) =>
  res.arrayBuffer()
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 检查是否是首页类型
    const type = searchParams.get('type')
    
    // 首页 OG 图片
    if (type === 'home') {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0f172a',
              backgroundImage: `
                radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
                radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.3) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
                radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.3) 0px, transparent 50%)
              `,
            }}
          >
            {/* 标题 */}
            <div
              style={{
                fontSize: '96px',
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: '32px',
                fontFamily: 'sans-serif',
              }}
            >
              FelixView
            </div>
            
            {/* 副标题 */}
            <div
              style={{
                fontSize: '40px',
                color: '#94a3b8',
                textAlign: 'center',
                marginBottom: '80px',
                fontFamily: 'sans-serif',
              }}
            >
              宏观经济分析与分享
            </div>
            
            {/* 特性 */}
            <div
              style={{
                display: 'flex',
                gap: '48px',
                fontSize: '28px',
                color: '#64748b',
                fontFamily: 'sans-serif',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>📊</span>
                <span>数据分析</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>📈</span>
                <span>政策趋势</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🌍</span>
                <span>全球视野</span>
              </div>
            </div>
            
            {/* 底部 */}
            <div
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '60px',
                fontSize: '20px',
                color: '#475569',
                fontFamily: 'sans-serif',
              }}
            >
              FelixView
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: 'Noto Sans CJK',
              data: await fontData,
              weight: 400,
              style: 'normal',
            },
          ],
        }
      )
    }
    
    // 文章 OG 图片
    const title = searchParams.get('title') || 'FelixView - 宏观经济分析与分享'
    const excerpt = searchParams.get('excerpt') || '聚焦宏观经济数据分析与政策趋势解读'
    const date = searchParams.get('date') || new Date().toLocaleDateString('zh-CN')
    const readingTime = searchParams.get('readingTime') || '1'
    
    // 限制标题长度
    const truncatedTitle = title.length > 60 ? title.slice(0, 60) + '...' : title
    const truncatedExcerpt = excerpt.length > 120 ? excerpt.slice(0, 120) + '...' : excerpt

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: `
              radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
              radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.3) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
              radial-gradient(at 0% 100%, rgba(16, 185, 129, 0.3) 0px, transparent 50%)
            `,
            padding: '80px',
          }}
        >
          {/* 标题 */}
          <div
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: '24px',
              lineHeight: 1.2,
              maxWidth: '1000px',
              fontFamily: 'sans-serif',
            }}
          >
            {truncatedTitle}
          </div>
          
          {/* 摘要 */}
          <div
            style={{
              fontSize: '28px',
              color: '#94a3b8',
              textAlign: 'center',
              marginBottom: '48px',
              lineHeight: 1.5,
              maxWidth: '900px',
              fontFamily: 'sans-serif',
            }}
          >
            {truncatedExcerpt}
          </div>
          
          {/* 底部信息 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              fontSize: '24px',
              color: '#64748b',
              fontFamily: 'sans-serif',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📅</span>
              <span>{date}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⏱</span>
              <span>{readingTime} 分钟阅读</span>
            </div>
          </div>
          
          {/* 底部 Logo */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '60px',
              fontSize: '20px',
              color: '#475569',
              fontFamily: 'sans-serif',
            }}
          >
            FelixView
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Noto Sans CJK',
            data: await fontData,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
}
