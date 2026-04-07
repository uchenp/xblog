import Link from "next/link"
import { Plus, LogOut } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllPosts } from "@/lib/posts"
import { PostActions } from "@/components/admin/post-actions"
import { LogoutButton } from "@/components/admin/logout-button"

export default async function AdminPostsPage() {
  const posts = await getAllPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">文章管理</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              新建文章
            </Link>
          </Button>
          <LogoutButton />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>标题</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>发布时间</TableHead>
              <TableHead>更新时间</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.slug}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {post.published ? (
                      <Badge variant="default">已发布</Badge>
                    ) : (
                      <Badge variant="secondary">草稿</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(post.publishedAt), "yyyy/MM/dd", {
                      locale: zhCN,
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(post.updatedAt), "yyyy/MM/dd HH:mm", {
                      locale: zhCN,
                    })}
                  </TableCell>
                  <TableCell>
                    <PostActions post={post} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  暂无文章
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
