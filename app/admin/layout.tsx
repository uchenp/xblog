import type { Metadata } from "next"
import Link from "next/link"
import { LayoutDashboard, FileText, ArrowLeft } from "lucide-react"
import { LogoutButton } from "@/components/admin/logout-button"

export const metadata: Metadata = {
  title: {
    default: "后台管理",
    template: "%s | 后台管理",
  },
}

const sidebarNavItems = [
  {
    title: "仪表盘",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "文章管理",
    href: "/admin/posts",
    icon: FileText,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-64 border-r border-border bg-muted/30">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/admin" className="text-lg font-semibold">
            后台管理
          </Link>
        </div>
        
        <nav className="flex flex-col gap-1 p-4">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回博客
          </Link>
          <div className="pt-1">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="h-14 border-b border-border" />
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
