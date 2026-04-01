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

interface Frontmatter {
  title: string
  excerpt: string
  publishedAt: string
  updatedAt: string
  published: boolean
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

// 解析 Markdown frontmatter
function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  
  if (!match) {
    throw new Error('无效的 Markdown 格式，缺少 frontmatter')
  }
  
  const [, frontmatterStr, body] = match
  const frontmatter = parseFrontmatterContent(frontmatterStr)
  
  return { frontmatter, body: body.trim() }
}

// 解析 YAML 风格的 frontmatter 内容
function parseFrontmatterContent(content: string): Frontmatter {
  const lines = content.split('\n')
  const result: any = {}
  
  for (const line of lines) {
    const [key, ...valueParts] = line.split(':')
    const value = valueParts.join(':').trim()
    
    if (key && value) {
      const trimmedKey = key.trim()
      if (trimmedKey === 'published') {
        result[trimmedKey] = value === 'true'
      } else {
        result[trimmedKey] = value.replace(/^['"]|['"]$/g, '')
      }
    }
  }
  
  return result as Frontmatter
}

// 生成 frontmatter
function generateFrontmatter(meta: Frontmatter): string {
  return `---
title: ${meta.title}
excerpt: ${meta.excerpt}
publishedAt: ${meta.publishedAt}
updatedAt: ${meta.updatedAt}
published: ${meta.published}
---`
}

// 获取所有文章
export async function getAllPosts(): Promise<Post[]> {
  await ensureDir()
  
  try {
    const files = await fs.readdir(POSTS_DIR)
    const posts: Post[] = []
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(POSTS_DIR, file)
        const content = await fs.readFile(filePath, 'utf-8')
        const slug = file.replace(/\.md$/, '')
        
        try {
          const { frontmatter, body } = parseFrontmatter(content)
          posts.push({
            slug,
            title: frontmatter.title,
            content: body,
            excerpt: frontmatter.excerpt,
            publishedAt: frontmatter.publishedAt,
            updatedAt: frontmatter.updatedAt,
            published: frontmatter.published,
          })
        } catch (error) {
          console.error(`Failed to parse ${file}:`, error)
        }
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
  
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const { frontmatter, body } = parseFrontmatter(content)
    
    return {
      slug,
      title: frontmatter.title,
      content: body,
      excerpt: frontmatter.excerpt,
      publishedAt: frontmatter.publishedAt,
      updatedAt: frontmatter.updatedAt,
      published: frontmatter.published,
    }
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
  
  const frontmatter = generateFrontmatter({
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    published: post.published,
  })
  
  const fileContent = `${frontmatter}\n\n${post.content}`
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  await fs.writeFile(filePath, fileContent)
  
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
  
  const frontmatter = generateFrontmatter({
    title: updatedPost.title,
    excerpt: updatedPost.excerpt,
    publishedAt: updatedPost.publishedAt,
    updatedAt: updatedPost.updatedAt,
    published: updatedPost.published,
  })
  
  const fileContent = `${frontmatter}\n\n${updatedPost.content}`
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  await fs.writeFile(filePath, fileContent)
  
  return updatedPost
}

// 删除文章
export async function deletePost(slug: string): Promise<boolean> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  
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
