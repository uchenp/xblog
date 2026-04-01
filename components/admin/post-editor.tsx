"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
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
  published: z.boolean(),
})

type PostFormData = z.infer<typeof postSchema>

interface PostEditorProps {
  post?: Post
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!post

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      published: post?.published || false,
    },
  })

  const contentValue = form.watch("content")

  async function onSubmit(data: PostFormData) {
    setIsSubmitting(true)

    try {
      const url = isEditing ? `/api/posts/${post.slug}` : "/api/posts"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "操作失败")
      }

      toast.success(isEditing ? "文章已更新" : "文章已创建")
      router.push("/admin/posts")
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
              <Textarea
                {...form.register("content")}
                placeholder="使用 Markdown 编写文章内容..."
                className="min-h-[500px] font-mono text-sm"
              />
              {form.formState.errors.content && (
                <p className="mt-2 text-sm text-destructive">
                  {form.formState.errors.content.message}
                </p>
              )}
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

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : isEditing ? "更新文章" : "创建文章"}
            </Button>
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
