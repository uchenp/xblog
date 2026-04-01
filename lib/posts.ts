import { promises as fs } from 'fs'
import path from 'path'

export interface Post {
  slug: string
  title: string
  content: string
  excerpt: string
  publishedAt: string
  updatedAt: string
  published: boolean
}

export type PostInput = Omit<Post, 'slug' | 'publishedAt' | 'updatedAt'> & {
  slug?: string
  publishedAt?: string
  updatedAt?: string
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

// 确保目录存在
async function ensureDir() {
  try {
    await fs.access(POSTS_DIR)
  } catch {
    await fs.mkdir(POSTS_DIR, { recursive: true })
  }
}

// 获取所有文章
export async function getAllPosts(): Promise<Post[]> {
  await ensureDir()
  
  try {
    const files = await fs.readdir(POSTS_DIR)
    const posts: Post[] = []
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(POSTS_DIR, file)
        const content = await fs.readFile(filePath, 'utf-8')
        posts.push(JSON.parse(content))
      }
    }
    
    // 按发布时间倒序排列
    return posts.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  } catch {
    return []
  }
}

// 获取已发布的文章
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter(post => post.published)
}

// 根据 slug 获取文章
export async function getPostBySlug(slug: string): Promise<Post | null> {
  await ensureDir()
  
  const filePath = path.join(POSTS_DIR, `${slug}.json`)
  
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

// 创建文章
export async function createPost(input: PostInput): Promise<Post> {
  await ensureDir()
  
  const now = new Date().toISOString()
  const slug = input.slug || generateSlug(input.title)
  
  const post: Post = {
    slug,
    title: input.title,
    content: input.content,
    excerpt: input.excerpt,
    publishedAt: input.publishedAt || now,
    updatedAt: now,
    published: input.published,
  }
  
  const filePath = path.join(POSTS_DIR, `${slug}.json`)
  await fs.writeFile(filePath, JSON.stringify(post, null, 2))
  
  return post
}

// 更新文章
export async function updatePost(slug: string, input: Partial<PostInput>): Promise<Post | null> {
  const existingPost = await getPostBySlug(slug)
  
  if (!existingPost) {
    return null
  }
  
  const updatedPost: Post = {
    ...existingPost,
    ...input,
    slug: existingPost.slug, // slug 不可更改
    updatedAt: new Date().toISOString(),
  }
  
  const filePath = path.join(POSTS_DIR, `${slug}.json`)
  await fs.writeFile(filePath, JSON.stringify(updatedPost, null, 2))
  
  return updatedPost
}

// 删除文章
export async function deletePost(slug: string): Promise<boolean> {
  const filePath = path.join(POSTS_DIR, `${slug}.json`)
  
  try {
    await fs.unlink(filePath)
    return true
  } catch {
    return false
  }
}

// 生成 slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 50) || `post-${Date.now()}`
}

// 计算阅读时间（按中文字符计算）
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 300
  const chars = content.replace(/\s+/g, '').length
  return Math.max(1, Math.ceil(chars / wordsPerMinute))
}
