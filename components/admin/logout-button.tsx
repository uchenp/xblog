"use client"

import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" })
    } catch {
      // Ignore logout errors
    }

    toast.success("已退出登录")
    router.push("/admin")
  }

  return (
    <Button variant="outline" size="icon" onClick={handleLogout} title="退出登录">
      <LogOut className="h-4 w-4" />
    </Button>
  )
}
