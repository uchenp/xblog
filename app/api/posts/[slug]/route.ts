import { NextResponse } from "next/server"
import { getPostBySlug, updatePost, deletePost, revalidatePostsCache } from "@/lib/posts"
import { z } from "zod"
import { requireAuth } from "@/lib/auth"

interface RouteParams {
  params: Promise<{ slug: string }>
}

// 验证 slug 安全性
function validateSlugParam(slug: string): boolean {
  return /^[\w\u4e00-\u9fa5-]+$/.test(slug) && !slug.includes('..') && !slug.includes('/') && !slug.includes('\\')
}

// 获取单篇文章（公开）
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    
    if (!post || !post.published) {
      return NextResponse.json(
        { error: "文章未找到" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(post)
  } catch (error) {
    console.error("获取文章失败:", error)
    return NextResponse.json(
      { error: "获取文章失败" },
      { status: 500 }
    )
  }
}

// 更新文章的验证规则
const updatePostSchema = z.object({
  title: z.string().min(1, "标题不能为空").optional(),
  content: z.string().min(1, "内容不能为空").optional(),
  excerpt: z.string().min(1, "摘要不能为空").optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  published: z.boolean().optional(),
})

// 更新文章（需要认证）
export async function PUT(request: Request, { params }: RouteParams): Promise<NextResponse> {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { slug } = await params
    // URL 解码（处理中文等字符）
    const decodedSlug = decodeURIComponent(slug)
    if (!validateSlugParam(decodedSlug)) {
      return NextResponse.json({ error: "无效的 slug 格式" }, { status: 400 })
    }
    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)
    
    const post = await updatePost(decodedSlug, validatedData)
    revalidatePostsCache()
    
    if (!post) {
      return NextResponse.json(
        { error: "文章未找到" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "验证失败", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("更新文章失败:", error)
    return NextResponse.json(
      { error: "更新文章失败" },
      { status: 500 }
    )
  }
}

// 删除文章（需要认证）
export async function DELETE(request: Request, { params }: RouteParams): Promise<NextResponse> {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { slug } = await params
    // URL 解码（处理中文等字符）
    const decodedSlug = decodeURIComponent(slug)
    if (!validateSlugParam(decodedSlug)) {
      return NextResponse.json({ error: "无效的 slug 格式" }, { status: 400 })
    }
    const success = await deletePost(decodedSlug)
    revalidatePostsCache()
    
    if (!success) {
      return NextResponse.json(
        { error: "文章未找到" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: "文章已删除" })
  } catch (error) {
    console.error("删除文章失败:", error)
    return NextResponse.json(
      { error: "删除文章失败" },
      { status: 500 }
    )
  }
}
