import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Fuse from 'fuse.js'
import { calculateReadingTime } from './reading-time'
import { unstable_cache, revalidateTag } from 'next/cache'

const POSTS_CACHE_TAG = 'posts'

export interface Post {
  slug: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  categories: string[]
  publishedAt: string
  updatedAt: string
  published: boolean
  readingTime?: number
  views?: number
  toc?: TOCItem[]
}

export interface TOCItem {
  id: string
  text: string
  level: number
}

export type PostInput = Omit<Post, 'slug' | 'publishedAt' | 'updatedAt'> & {
  slug?: string
  publishedAt?: string
  updatedAt?: string
}

interface PostFrontmatter {
  title: string
  excerpt: string
  tags: string[]
  categories: string[]
  publishedAt: string
  updatedAt: string
  published: boolean
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

// 验证 slug 安全性，防止路径穿越
function validateSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug: must be a non-empty string')
  }
  // URL 解码（处理中文等字符）
  let decodedSlug = slug
  try {
    decodedSlug = decodeURIComponent(slug)
  } catch {
    // 如果解码失败，使用原始 slug
  }
  // 只允许字母、数字、连字符、下划线和中文字符
  if (!/^[\w\u4e00-\u9fa5-]+$/.test(decodedSlug)) {
    throw new Error('Invalid slug: contains disallowed characters')
  }
  // 防止路径穿越：检查是否包含 .. 或 /
  if (decodedSlug.includes('..') || decodedSlug.includes('/') || decodedSlug.includes('\\')) {
    throw new Error('Invalid slug: path traversal not allowed')
  }
  return decodedSlug
}

// 安全地构建文章文件路径
function safePostPath(slug: string): string {
  const safeSlug = validateSlug(slug)
  const filePath = path.join(POSTS_DIR, `${safeSlug}.md`)
  // 验证最终路径仍在 POSTS_DIR 内
  const resolved = path.resolve(filePath)
  if (!resolved.startsWith(path.resolve(POSTS_DIR))) {
    throw new Error('Invalid slug: resolved path escapes posts directory')
  }
  return filePath
}

// 确保目录存在
async function ensureDir() {
  try {
    await fs.access(POSTS_DIR)
  } catch {
    await fs.mkdir(POSTS_DIR, { recursive: true })
  }
}

// 生成目录
export function generateTOC(content: string): TOCItem[] {
  const headings: TOCItem[] = []
  const lines = content.split('\n')
  
  lines.forEach((line) => {
    const match = line.match(/^(#{2,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      
      headings.push({ id, text, level })
    }
  })
  
  return headings
}

// 从 gray-matter 结果中提取标准化的 Post 对象
function toPost(slug: string, file: matter.GrayMatterFile<string>): Post {
  const data = file.data as PostFrontmatter
  return {
    slug,
    title: data.title || '',
    content: file.content.trim(),
    excerpt: data.excerpt || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    categories: Array.isArray(data.categories) ? data.categories : [],
    publishedAt: data.publishedAt || '',
    updatedAt: data.updatedAt || '',
    published: Boolean(data.published),
    readingTime: calculateReadingTime(file.content),
    toc: generateTOC(file.content),
  }
}

// 获取所有文章（带缓存）
export const getAllPosts = unstable_cache(
  async (): Promise<Post[]> => {
    await ensureDir()

    try {
      const files = await fs.readdir(POSTS_DIR)
      const posts: Post[] = []

      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(POSTS_DIR, file)
          const content = await fs.readFile(filePath, 'utf-8')
          const slug = file.replace(/\.md$/, '').trim().replace(/\s+/g, '-')

          try {
            const parsed = matter(content)
            posts.push(toPost(slug, parsed))
          } catch (error) {
            console.warn(`Skipping ${file}: Invalid frontmatter format`, error)
          }
        }
      }

      return posts.sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    } catch {
      return []
    }
  },
  ['all-posts'],
  { tags: [POSTS_CACHE_TAG] }
)

// 获取已发布的文章
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getAllPosts()
  const published = posts.filter(post => post.published)
  // 模拟阅读量（实际项目中应从数据库或缓存读取）
  return published.map((post, i) => ({
    ...post,
    views: Math.floor(Math.random() * 500) + 50 + i * 37,
  }))
}

// 根据 slug 获取文章（带缓存）
export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<Post | null> => {
    await ensureDir()

    let filePath: string
    try {
      filePath = safePostPath(slug)
    } catch {
      return null
    }

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const parsed = matter(content)
      return toPost(slug, parsed)
    } catch {
      return null
    }
  },
  ['post-by-slug'],
  { tags: [POSTS_CACHE_TAG] }
)

// 序列化 frontmatter（使用 gray-matter 的 stringify）
function serializeFrontmatter(meta: PostFrontmatter): string {
  return matter.stringify('', meta)
}

// 重新验证文章缓存（在写入操作后调用）
export function revalidatePostsCache() {
  revalidateTag(POSTS_CACHE_TAG)
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
    tags: input.tags || [],
    categories: input.categories || [],
    publishedAt: input.publishedAt || now,
    updatedAt: now,
    published: input.published,
  }
  
  const frontmatter: PostFrontmatter = {
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    categories: post.categories,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    published: post.published,
  }
  
  const fileContent = serializeFrontmatter(frontmatter) + post.content
  const filePath = safePostPath(slug)
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
    slug: existingPost.slug,
    updatedAt: new Date().toISOString(),
  }
  
  const frontmatter: PostFrontmatter = {
    title: updatedPost.title,
    excerpt: updatedPost.excerpt,
    tags: updatedPost.tags,
    categories: updatedPost.categories,
    publishedAt: updatedPost.publishedAt,
    updatedAt: updatedPost.updatedAt,
    published: updatedPost.published,
  }
  
  const fileContent = serializeFrontmatter(frontmatter) + updatedPost.content
  const filePath = safePostPath(slug)
  await fs.writeFile(filePath, fileContent)
  
  return updatedPost
}

// 删除文章
export async function deletePost(slug: string): Promise<boolean> {
  const filePath = safePostPath(slug)
  
  try {
    await fs.unlink(filePath)
    return true
  } catch {
    return false
  }
}

// 生成 slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 50) || `post-${Date.now()}`
}

// 获取所有标签
export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts()
  const tags = new Set<string>()
  posts.forEach(post => {
    if (post.tags) {
      post.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
}

// 获取所有分类
export async function getAllCategories(): Promise<string[]> {
  const posts = await getPublishedPosts()
  const categories = new Set<string>()
  posts.forEach(post => {
    if (post.categories?.[0]) {
      categories.add(post.categories[0])
    }
  })
  return Array.from(categories).sort()
}

// 根据标签获取文章
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPublishedPosts()
  return posts.filter(post => post.tags?.includes(tag))
}

// 根据分类获取文章
export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getPublishedPosts()
  return posts.filter(post => post.categories?.includes(category))
}

// 搜索文章（使用 fuse.js 模糊搜索）
export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await getPublishedPosts()
  const searchQuery = query.trim()

  if (!searchQuery) {
    return posts
  }

  // fuse.js 配置：支持模糊匹配、多字段搜索
  const fuse = new Fuse(posts, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'excerpt', weight: 0.2 },
      { name: 'content', weight: 0.1 },
      { name: 'tags', weight: 0.15 },
      { name: 'categories', weight: 0.05 },
    ],
    threshold: 0.4, // 匹配阈值，越小越严格
    includeScore: true,
    minMatchCharLength: 2, // 至少 2 个字符才触发模糊匹配
    ignoreLocation: true, // 忽略匹配位置，更宽松的匹配
  })

  const results = fuse.search(searchQuery)

  // 返回按相关度排序的结果
  return results.map((result) => result.item)
}

// 获取相关文章（基于标签）
export async function getRelatedPosts(slug: string, limit: number = 3): Promise<Post[]> {
  const posts = await getPublishedPosts()
  const currentPost = posts.find(p => p.slug === slug)
  
  if (!currentPost || !currentPost.tags?.length) {
    return []
  }
  
  const relatedPosts = posts
    .filter(post => post.slug !== slug && post.tags?.some(tag => currentPost.tags?.includes(tag)))
    .slice(0, limit)
  
  return relatedPosts
}
