import { FileText, Eye, Tag, FolderOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllPosts, getAllTags, getAllCategories } from "@/lib/posts"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const posts = await getAllPosts()
  const publishedPosts = posts.filter(p => p.published)
  const draftPosts = posts.filter(p => !p.published)
  const tags = await getAllTags()
  const categories = await getAllCategories()

  const recentPosts = posts.slice(0, 5)

  const stats = [
    {
      title: "全部文章",
      value: posts.length,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "已发布",
      value: publishedPosts.length,
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "草稿",
      value: draftPosts.length,
      icon: FileText,
      color: "text-amber-600",
    },
    {
      title: "标签",
      value: tags.length,
      icon: Tag,
      color: "text-purple-600",
    },
    {
      title: "分类",
      value: categories.length,
      icon: FolderOpen,
      color: "text-pink-600",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">仪表盘</h1>

      {/* 统计卡片 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 最近文章 */}
      <Card>
        <CardHeader>
          <CardTitle>最近文章</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.slug}
                  className="flex items-center justify-between rounded-md border px-4 py-2"
                >
                  <span className="text-sm font-medium truncate flex-1">
                    {post.title}
                  </span>
                  <span className="ml-4 text-xs text-muted-foreground shrink-0">
                    {post.published ? "已发布" : "草稿"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              暂无文章
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
