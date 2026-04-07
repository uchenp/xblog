'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

export function Breadcrumbs() {
  const pathname = usePathname()
  
  const items = generateBreadcrumbs(pathname)
  
  if (items.length === 0) {
    return null
  }

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-6">
      <Link
        href="/"
        className="hover:text-foreground transition-colors"
      >
        首页
      </Link>
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []
  
  const labels: Record<string, string> = {
    posts: '文章',
    tags: '标签',
    categories: '分类',
    archive: '归档',
    stats: '统计',
    search: '搜索',
    about: '关于',
  }
  
  let href = ''
  for (const path of paths) {
    href += `/${path}`
    
    // 跳过动态路由参数
    if (path.startsWith('[') || path === 'page.tsx') {
      continue
    }
    
    const label = labels[path] || decodeURIComponent(path)
    items.push({ label, href })
  }
  
  return items
}
