"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavigationItem {
  name: string
  href: string
}

interface HeaderNavProps {
  navigation: NavigationItem[]
}

export function HeaderNav({ navigation }: HeaderNavProps) {
  const pathname = usePathname()

  return (
    <nav 
      className="flex items-center gap-4"
      suppressHydrationWarning
    >
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm transition-colors hover:text-foreground",
            pathname === item.href
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}
