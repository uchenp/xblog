---
title: Next.js 完整指南
excerpt: 深入了解 Next.js 框架，从基础到高级特性的完整学习路径。
publishedAt: 2024-01-20T14:30:00Z
updatedAt: 2024-01-20T14:30:00Z
published: true
---

# Next.js 完整指南

Next.js 是一个基于 React 的全栈框架，它提供了许多开箱即用的功能。

## 核心特性

### App Router
Next.js 13+ 引入的新路由系统，基于文件系统的约定。

```javascript
// app/page.tsx
export default function Home() {
  return <h1>欢迎</h1>
}
```

### 服务器组件
可以直接在 React 组件中访问数据库，无需 API 路由。

```javascript
// app/posts/page.tsx
async function PostList() {
  const posts = await db.post.findMany()
  return <div>{/* ... */}</div>
}
```

### API 路由
创建 RESTful API 端点非常简单。

```javascript
// app/api/posts/route.ts
export async function GET() {
  return Response.json({ posts: [] })
}
```

## 性能优化

- **静态生成**: 在构建时预生成页面
- **增量静态再生成**: 动态更新静态页面
- **服务端渲染**: 按需在服务器端渲染

## 实用技巧

1. 使用 `generateStaticParams` 预生成动态路由
2. 充分利用缓存来提升性能
3. 使用图片优化组件 `<Image>`

Next.js 的文档非常详细，建议定期查看官方文档以了解最新特性。
