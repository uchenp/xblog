import { NextResponse } from "next/server"
import { getAllPosts, createPost } from "@/lib/posts"
import { z } from "zod"

// 获取所有文章
export async function GET() {
  try {
    const posts = await getAllPosts()
    return NextResponse.json(posts)
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
  excerpt: z.string().min(1, "摘要不能为空"),
  published: z.boolean().default(false),
})

// 创建新文章
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = createPostSchema.parse(body)
    
    const post = await createPost(validatedData)
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
