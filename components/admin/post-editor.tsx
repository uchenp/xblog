"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Eye, HelpCircle, Bold, Italic, Heading, List, ListOrdered, Code, Link, Image, Quote, Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { PostContent } from "@/components/blog/post-content"
import type { Post } from "@/lib/posts"

const postSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
  excerpt: z.string().min(1, "摘要不能为空"),
  tags: z.string().optional().default(""),
  categories: z.string().optional().default(""),
  published: z.boolean(),
})

type PostFormData = z.infer<typeof postSchema>

interface PostEditorProps {
  post?: Post
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false)
  const isEditing = !!post

  function getAuthHeaders() {
    return {
      "Content-Type": "application/json",
    }
  }

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      tags: post?.tags?.join(", ") || "",
      categories: post?.categories?.join(", ") || "",
      published: post?.published || false,
    },
  })

  const contentValue = form.watch("content")

  function insertMarkdown(before: string, after: string = "", placeholder: string = "") {
    const textarea = document.querySelector("textarea[name='content']") as HTMLTextAreaElement | null
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = contentValue.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newValue = contentValue.substring(0, start) + before + textToInsert + after + contentValue.substring(end)
    form.setValue("content", newValue)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length + after.length
      textarea.setSelectionRange(start + before.length, newCursorPos - after.length)
    }, 0)
  }

  async function onSubmit(data: PostFormData) {
    setIsSubmitting(true)

    try {
      const url = isEditing ? `/api/posts/${post!.slug}` : "/api/posts"
      const method = isEditing ? "PUT" : "POST"

      const payload = {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        tags: data.tags
          .split(/[,，]/)
          .map((t) => t.trim())
          .filter(Boolean),
        categories: data.categories
          .split(/[,，]/)
          .map((c) => c.trim())
          .filter(Boolean),
        published: data.published,
      }

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
        credentials: 'include',
      })

      if (response.status === 401) {
        toast.error("登录已过期，请重新登录")
        router.push("/admin")
        return
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "操作失败")
      }

      toast.success(isEditing ? "文章已更新" : "文章已创建")
      router.push("/admin/dashboard")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "操作失败")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <FieldGroup>
            <Field>
              <FieldLabel>标题</FieldLabel>
              <Input
                {...form.register("title")}
                placeholder="输入文章标题"
                className="text-lg"
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel>摘要</FieldLabel>
              <Textarea
                {...form.register("excerpt")}
                placeholder="输入文章摘要（将显示在文章列表中）"
                rows={2}
              />
              {form.formState.errors.excerpt && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.excerpt.message}
                </p>
              )}
            </Field>
          </FieldGroup>

          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">编辑</TabsTrigger>
              <TabsTrigger value="preview">预览</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="mt-4">
              <div className="space-y-3">
                {/* Markdown Quick Insert Toolbar */}
                <div className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-lg border">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => insertMarkdown("## ", "", "标题")}
                    title="标题"
                  >
                    <Heading className="h-3.5 w-3.5 mr-1" />
                    标题
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => insertMarkdown("**", "**", "粗体")}
                    title="粗体"
                  >
                    <Bold className="h-3.5 w-3.5 mr-1" />
                    粗体
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => insertMarkdown("*", "*", "斜体")}
                    title="斜体"
                  >
                    <Italic className="h-3.5 w-3.5 mr-1" />
                    斜体
                  </Button>
                  <div className="w-px h-5 bg-border mx-1 self-center" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => insertMarkdown("- ", "", "列表项")}
                    title="无序列表"
                  >
                    <List className="h-3.5 w-3.5 mr-1" />
                    列表
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => insertMarkdown("1. ", "", "列表项")}
                    title="有序列表"
                  >
                    <ListOrdered className="h-3.5 w-3.5 mr-1" />
                    编号
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => insertMarkdown("> ", "", "引用内容")}
                    title="引用"
                  >
                    <Quote className="h-3.5 w-3.5 mr-1" />
                    引用
                  </Button>
                  <div className="w-px h-5 bg-border mx-1 self-center" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => insertMarkdown("```\n", "\n```", "代码")}
                    title="代码块"
                  >
                    <Code className="h-3.5 w-3.5 mr-1" />
                    代码
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => insertMarkdown("[", "](https://)", "链接文字")}
                    title="链接"
                  >
                    <Link className="h-3.5 w-3.5 mr-1" />
                    链接
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => insertMarkdown("![", "](https://)", "图片描述")}
                    title="图片"
                  >
                    <Image className="h-3.5 w-3.5 mr-1" />
                    图片
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => insertMarkdown("| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| ", " |  |  |\n|  |  |  |", "")}
                    title="表格"
                  >
                    <Table className="h-3.5 w-3.5 mr-1" />
                    表格
                  </Button>
                  <div className="w-px h-5 bg-border mx-1 self-center" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
                    title="Markdown 语法帮助"
                  >
                    <HelpCircle className="h-3.5 w-3.5 mr-1" />
                    帮助
                  </Button>
                </div>

                <Textarea
                  {...form.register("content")}
                  placeholder="使用 Markdown 编写文章内容..."
                  className="min-h-[500px] font-mono text-sm"
                />

                {/* Markdown Help Panel */}
                {showMarkdownHelp && (
                  <Card className="border-dashed">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Markdown 语法参考</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">标题</h4>
                          <code className="block text-xs bg-muted p-2 rounded">## 一级标题{"\n"}### 二级标题{"\n"}#### 三级标题</code>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">强调</h4>
                          <code className="block text-xs bg-muted p-2 rounded">**粗体** 或 *斜体*{"\n"}~~删除线~~</code>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">列表</h4>
                          <code className="block text-xs bg-muted p-2 rounded">- 无序列表项{"\n"}1. 有序列表项</code>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">引用</h4>
                          <code className="block text-xs bg-muted p-2 rounded">{"> "}引用文本</code>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">代码</h4>
                          <code className="block text-xs bg-muted p-2 rounded">{"`"}行内代码{"`"}{"\n"}```{"\n"}代码块{"\n"}```</code>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">链接与图片</h4>
                          <code className="block text-xs bg-muted p-2 rounded">[文字](链接){"\n"}![描述](图片链接)</code>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">表格</h4>
                          <code className="block text-xs bg-muted p-2 rounded">{"|"} 表头 {"|"} 表头 {"|"}{"\n"}{"|"} --- {"|"} --- {"|"}{"\n"}{"|"} 内容 {"|"} 内容 {"|"}</code>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">分割线</h4>
                          <code className="block text-xs bg-muted p-2 rounded">---</code>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        提示：支持 GFM（GitHub Flavored Markdown）语法，包括表格、任务列表、删除线等
                      </p>
                    </CardContent>
                  </Card>
                )}

                {form.formState.errors.content && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.content.message}
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {contentValue ? (
                    <PostContent content={contentValue} />
                  ) : (
                    <p className="text-muted-foreground">暂无内容</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">发布设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">发布状态</span>
                <Switch
                  checked={form.watch("published")}
                  onCheckedChange={(checked) => form.setValue("published", checked)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {form.watch("published") ? "文章将公开显示" : "文章将保存为草稿"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">分类与标签</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  标签
                </label>
                <Input
                  {...form.register("tags")}
                  placeholder="标签 1, 标签 2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  用逗号分隔
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  分类
                </label>
                <Input
                  {...form.register("categories")}
                  placeholder="分类 1, 分类 2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  用逗号分隔
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : isEditing ? "更新文章" : "创建文章"}
            </Button>
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const url = `/posts/${post!.slug}/preview`
                  window.open(url, '_blank')
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                预览文章
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/posts")}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
