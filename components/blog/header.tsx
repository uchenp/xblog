import Link from "next/link"
import { SearchDialog } from "./search-dialog"
import { HeaderNav } from "./header-nav"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "首页", href: "/" },
  { name: "文章", href: "/posts" },
  { name: "系列", href: "/series" },
  { name: "标签", href: "/tags" },
  { name: "分类", href: "/categories" },
  { name: "归档", href: "/archive" },
  { name: "统计", href: "/stats" },
  { name: "关于", href: "/about" },
]

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            FelixView
          </Link>
          <HeaderNav navigation={navigation} />
        </div>
        
        <div className="flex items-center gap-2">
          <SearchDialog />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
