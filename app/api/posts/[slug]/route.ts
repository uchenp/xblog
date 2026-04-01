import { NextResponse } from "next/server"
import { getPostBySlug, updatePost, deletePost } from "@/lib/posts"
import { z } from "zod"

interface RouteParams {
  params: Promise<{ slug: string }>
}

// 获取单篇文章
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params
    const post = await getPostBySlug(slug)
    
    if (!post) {
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
  published: z.boolean().optional(),
})

// 更新文章
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params
    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)
    
    const post = await updatePost(slug, validatedData)
    
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

// 删除文章
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params
    const success = await deletePost(slug)
    
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
