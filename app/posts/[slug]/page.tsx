import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock } from "lucide-react"
import { format } from "date-fns"
import { zhCN } from "date-fns/locale"
import { BlogHeader } from "@/components/blog/header"
import { BlogFooter } from "@/components/blog/footer"
import { PostContent } from "@/components/blog/post-content"
import { ViewCount } from "@/components/view-count"
import { RelatedPosts } from "@/components/related-posts"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ReadingProgress } from "@/components/reading-progress"
import { Comments } from "@/components/comments"
import { TableOfContents } from "@/components/table-of-contents"
import { SeriesNavigation } from "@/components/series-navigation"
import { getPostBySlug, getPublishedPosts } from "@/lib/posts"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  // 确保 slug 被正确解码
  const decodedSlug = decodeURIComponent(slug)
  const post = await getPostBySlug(decodedSlug)
  
  if (!post) {
    return {
      title: "文章未找到",
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postUrl = `${siteUrl}/posts/${slug}`

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags?.join(', ') || [],
    authors: [{ name: '博主' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      url: postUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: postUrl,
    },
  }
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  // 确保 slug 被正确解码
  const decodedSlug = decodeURIComponent(slug)
  const post = await getPostBySlug(decodedSlug)

  if (!post || !post.published) {
    notFound()
  }

  const readingTime = post.readingTime || 1
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const postUrl = `${siteUrl}/posts/${slug}`

  // 结构化数据（Schema.org）
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: postUrl,
    author: {
      '@type': 'Person',
      name: '博主',
    },
    wordCount: post.content.length,
    timeRequired: `PT${readingTime}M`,
    inLanguage: 'zh-CN',
    articleBody: post.content,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <ReadingProgress />
      <BlogHeader />
      
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
            {/* 主内容区 */}
            <article>
              {/* 面包屑导航 */}
              <Breadcrumbs />

              {/* 文章头部 */}
              <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <time>
                    {format(new Date(post.publishedAt), "yyyy 年 M 月 d 日", { locale: zhCN })}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readingTime} 分钟阅读
                  </span>
                  <ViewCount slug={post.slug} />
                  {post.categories?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span>📁</span>
                      {post.categories.map((category) => (
                        <Link
                          key={category}
                          href={`/categories/${encodeURIComponent(category)}`}
                          className="hover:text-foreground transition-colors"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {post.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </header>

              {/* 文章内容 */}
              <PostContent content={post.content} />
              
              {/* 系列文章导航 */}
              <SeriesNavigation slug={post.slug} />
              
              {/* 相关文章 */}
              <RelatedPosts slug={post.slug} />
              
              {/* 评论系统 */}
              <Comments />
            </article>

            {/* 右侧目录 */}
            <TableOfContents toc={post.toc || []} />
          </div>
        </div>
      </main>

      <BlogFooter />
    </div>
  )
}
