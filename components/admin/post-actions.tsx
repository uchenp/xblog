"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Post } from "@/lib/posts"

interface PostActionsProps {
  post: Post
}

export function PostActions({ post }: PostActionsProps) {
  const router = useRouter()

  function getAuthHeaders() {
    return {
      "Content-Type": "application/json",
    }
  }

  async function togglePublished() {
    try {
      const response = await fetch(`/api/posts/${post.slug}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ published: !post.published }),
        credentials: "include",
      })

      if (response.status === 401) {
        toast.error("登录已过期，请重新登录")
        router.push("/admin")
        return
      }

      if (!response.ok) {
        throw new Error("操作失败")
      }

      toast.success(post.published ? "已取消发布" : "已发布")
      router.refresh()
    } catch {
      toast.error("操作失败")
    }
  }

  async function handleDelete() {
    if (!confirm("确定要删除这篇文章吗？此操作不可撤销。")) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${post.slug}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      })

      if (response.status === 401) {
        toast.error("登录已过期，请重新登录")
        router.push("/admin")
        return
      }

      if (!response.ok) {
        throw new Error("删除失败")
      }

      toast.success("文章已删除")
      router.refresh()
    } catch {
      toast.error("删除失败")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">打开菜单</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/posts/${post.slug}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            编辑
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={togglePublished}>
          {post.published ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              取消发布
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              发布
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
