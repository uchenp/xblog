'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { TOCItem } from '@/lib/posts'

interface TableOfContentsProps {
  toc: TOCItem[]
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>('')

  // 监听滚动，高亮当前标题
  React.useEffect(() => {
    // 存储所有可见的标题
    const visibleHeadings = new Map<string, number>()
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          if (entry.isIntersecting) {
            // 记录进入视口的标题及其底部位置
            visibleHeadings.set(id, entry.boundingClientRect.bottom)
          } else {
            visibleHeadings.delete(id)
          }
        })
        
        // 如果有可见的标题，选择最接近顶部（但还在视口内）的那个
        if (visibleHeadings.size > 0) {
          // 找到最接近视口顶部的标题（bottom 值最小的）
          let activeHeading = ''
          let minBottom = Infinity
          
          visibleHeadings.forEach((bottom, id) => {
            if (bottom < minBottom) {
              minBottom = bottom
              activeHeading = id
            }
          })
          
          setActiveId(activeHeading)
        }
      },
      {
        rootMargin: '-10% 0px -80% 0px', // 更严格的激活区域
        threshold: 0.1, // 10% 可见时触发
      }
    )

    // 观察所有标题元素
    const headingElements = document.querySelectorAll('h2, h3, h4, h5, h6')
    headingElements.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  if (toc.length === 0) return null

  return (
    <nav className="hidden lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <h3 className="text-sm font-semibold mb-3 text-foreground">目录</h3>
        <ul className="space-y-2 text-sm">
          {toc.map((heading) => (
            <li
              key={heading.id}
              style={{
                paddingLeft: `${(heading.level - 2) * 12}px`,
              }}
            >
              <a
                href={`#${heading.id}`}
                className={cn(
                  'block py-1 transition-colors hover:text-primary',
                  activeId === heading.id
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                )}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(heading.id)
                  if (element) {
                    // 考虑固定头部的高度（约 80px）
                    const offset = 100
                    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                    const scrollPosition = elementPosition - offset
                    
                    window.scrollTo({
                      top: scrollPosition,
                      behavior: 'smooth',
                    })
                  }
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
