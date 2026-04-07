import { NextResponse } from "next/server"
import { getAllPosts, createPost } from "@/lib/posts"
import { z } from "zod"
import { requireAuth } from "@/lib/auth"

// 获取所有文章（公开，支持分页）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)
    const safePage = Math.max(1, page)
    const safeLimit = Math.min(Math.max(1, limit), 100) // 限制 1-100

    const posts = await getAllPosts()
    const publishedPosts = posts.filter(post => post.published)
    const total = publishedPosts.length
    const totalPages = Math.ceil(total / safeLimit)
    const start = (safePage - 1) * safeLimit
    const pagedPosts = publishedPosts.slice(start, start + safeLimit)

    return NextResponse.json({
      posts: pagedPosts,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1,
      },
    })
  } catch (error) {
    console.error("获取文章列表失败:", error)
    return NextResponse.json(
      { error: "获取文章列表失败" },
      { status: 500 }
    )
  }
}

// 创建文章的验证规则
const createPostSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
  content: z.string().min(1, "内容不能为空"),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  categories: z.array(z.string()).optional().default([]),
  published: z.boolean().default(false),
})

// 创建新文章（需要认证）
export async function POST(request: Request): Promise<NextResponse> {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const validatedData = createPostSchema.parse(body)
    
    const post = await createPost({
      ...validatedData,
      excerpt: validatedData.excerpt || validatedData.title,
    })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "验证失败", details: error.errors },
        { status: 400 }
      )
    }
    
    console.error("创建文章失败:", error)
    return NextResponse.json(
      { error: "创建文章失败" },
      { status: 500 }
    )
  }
}
