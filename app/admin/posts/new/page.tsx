import { PostEditor } from "@/components/admin/post-editor"

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">新建文章</h1>
      <PostEditor />
    </div>
  )
}
