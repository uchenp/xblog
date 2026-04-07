import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { requireAuth } from '@/lib/auth'
import { generateSlug, revalidatePostsCache } from '@/lib/posts'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

// 验证 slug 安全性，防止路径穿越
function validateSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    throw new Error('Invalid slug')
  }
  if (!/^[\w\u4e00-\u9fa5-]+$/.test(slug)) {
    throw new Error('Invalid slug: contains disallowed characters')
  }
  if (slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
    throw new Error('Invalid slug: path traversal not allowed')
  }
  return slug
}

function safePostPath(slug: string): string {
  const safeSlug = validateSlug(slug)
  const filePath = path.join(POSTS_DIR, `${safeSlug}.md`)
  const resolved = path.resolve(filePath)
  if (!resolved.startsWith(path.resolve(POSTS_DIR))) {
    throw new Error('Invalid slug: path escapes posts directory')
  }
  return filePath
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

function serializeFrontmatter(meta: PostFrontmatter): string {
  return matter.stringify('', meta)
}

// POST - 创建新文章
export async function POST(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { title, excerpt, content, tags = [], categories = [], published = false } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    const slug = generateSlug(title)
    const now = new Date().toISOString()
    
    const frontmatter: PostFrontmatter = {
      title,
      excerpt: excerpt || title,
      tags: Array.isArray(tags) ? tags : [],
      categories: Array.isArray(categories) ? categories : [],
      publishedAt: now,
      updatedAt: now,
      published,
    }

    const filePath = safePostPath(slug)
    const fileContent = serializeFrontmatter(frontmatter) + content
    
    await fs.writeFile(filePath, fileContent, 'utf-8')
    revalidatePostsCache()

    return NextResponse.json({
      success: true,
      slug,
      message: 'Article created successfully',
    })
  } catch (error) {
    console.error('Create article error:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}

// PUT - 更新文章
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { slug, title, excerpt, content, tags, categories, published } = body

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const filePath = safePostPath(slug)
    
    try {
      const existingContent = await fs.readFile(filePath, 'utf-8')
      const parsed = matter(existingContent)
      const oldData = parsed.data as PostFrontmatter

      const updatedFrontmatter: PostFrontmatter = {
        title: title || oldData.title,
        excerpt: excerpt || oldData.excerpt,
        tags: tags !== undefined ? (Array.isArray(tags) ? tags : []) : (oldData.tags || []),
        categories: categories !== undefined ? (Array.isArray(categories) ? categories : []) : (oldData.categories || []),
        publishedAt: oldData.publishedAt,
        updatedAt: new Date().toISOString(),
        published: published !== undefined ? published : (oldData.published ?? false),
      }

      const fileContent = serializeFrontmatter(updatedFrontmatter) + (content || parsed.content)
      await fs.writeFile(filePath, fileContent, 'utf-8')
      revalidatePostsCache()

      return NextResponse.json({
        success: true,
        message: 'Article updated successfully',
      })
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
      throw error
    }
  } catch (error) {
    console.error('Update article error:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE - 删除文章
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAuth(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const filePath = safePostPath(slug)
    
    try {
      await fs.unlink(filePath)
      revalidatePostsCache()
      return NextResponse.json({
        success: true,
        message: 'Article deleted successfully',
      })
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
      throw error
    }
  } catch (error) {
    console.error('Delete article error:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}
