import { getPublishedPosts } from './posts'

export interface Series {
  id: string
  name: string
  description: string
  posts: string[] // 文章 slug 列表，按顺序
}

// 定义系列文章
export const seriesList: Series[] = [
  {
    id: 'macro-weekly',
    name: '宏观经济周度报告',
    description: '每周宏观经济数据跟踪与政策趋势分析，涵盖中美欧主要经济体。',
    posts: [
      '2026-w14宏观数据',
      // 后续添加更多
    ],
  },
  // 可以继续添加更多系列
]

/**
 * 获取系列文章详情
 */
export async function getSeriesById(seriesId: string): Promise<Series | null> {
  const series = seriesList.find(s => s.id === seriesId)
  if (!series) return null
  
  // 获取系列中的所有文章
  const allPosts = await getPublishedPosts()
  const seriesPosts = series.posts
    .map(slug => allPosts.find(post => post.slug === slug))
    .filter((post): post is NonNullable<typeof post> => post !== undefined)
  
  return {
    ...series,
    posts: seriesPosts.map(post => post.slug),
  }
}

/**
 * 获取文章所属的系列
 */
export async function getSeriesByPostSlug(slug: string): Promise<Series | null> {
  for (const series of seriesList) {
    if (series.posts.includes(slug)) {
      return getSeriesById(series.id)
    }
  }
  return null
}

/**
 * 获取文章在系列中的位置
 */
export async function getPostSeriesInfo(slug: string) {
  const series = await getSeriesByPostSlug(slug)
  if (!series) return null
  
  const index = series.posts.indexOf(slug)
  if (index === -1) return null
  
  return {
    series,
    currentIndex: index,
    totalPosts: series.posts.length,
    prevPost: index > 0 ? series.posts[index - 1] : null,
    nextPost: index < series.posts.length - 1 ? series.posts[index + 1] : null,
  }
}

/**
 * 获取所有系列
 */
export async function getAllSeries() {
  return seriesList
}
