import { notFound } from "next/navigation"
import { PostEditor } from "@/components/admin/post-editor"
import { getPostBySlug } from "@/lib/posts"

interface EditPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params
  // URL 解码（处理中文等字符）
  const decodedSlug = decodeURIComponent(slug)
  const post = await getPostBySlug(decodedSlug)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">编辑文章</h1>
      <PostEditor post={post} />
    </div>
  )
}
