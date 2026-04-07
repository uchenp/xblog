# Giscus 评论配置示例

> 这是一个配置示例，请根据你的实际情况修改

## 📝 配置步骤

### 1. 获取你的仓库信息

访问：https://giscus.app/zh-CN

### 2. 填写配置

```
仓库：your-username/xblog
仓库 ID: [点击获取]
分类：General
分类 ID: [点击获取]
```

### 3. 更新环境变量

编辑 `.env.local` 文件：

```bash
# Giscus 评论系统配置
NEXT_PUBLIC_GISCUS_REPO=jihui-cjh/xblog
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOxxxxxxxxxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOxxxxxxxxxxxxxx
```

### 4. 重启开发服务器

```bash
# 停止服务器（Ctrl+C）
# 重新启动
npm run dev
```

### 5. 测试评论

访问任意文章页面，底部应该显示评论框。

---

## 🔍 如何获取 ID

### 获取 repoId

1. 访问：https://giscus.app/zh-CN
2. 在"仓库"栏输入你的仓库
3. 点击"Get repoId"按钮
4. 会打开新页面显示 repoId
5. 复制格式如：`R_kgDOxxxxxxxxxxxxxx`

### 获取 categoryId

1. 在 Giscus 配置页面选择分类
2. 点击"Get category ID"按钮
3. 选择你的分类（如 General）
4. 复制格式如：`DIC_kwDOxxxxxxxxxxxxxx`

---

## ⚠️ 常见问题

### 1. 评论框不显示

**检查：**
- 环境变量是否正确配置
- 是否重启了开发服务器
- repoId 和 categoryId 是否正确

**解决：**
```bash
# 停止服务器
# 清理缓存
rm -rf .next
# 重新启动
npm run dev
```

### 2. 显示"Unauthorized"

**原因：** Giscus App 未正确安装

**解决：**
1. 访问：https://github.com/apps/giscus
2. 重新安装 Giscus App
3. 确保授权了正确的仓库

### 3. 深色模式不生效

**检查：** `components/comments.tsx` 中的主题配置

**解决：**
```tsx
theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
```

### 4. 评论不显示在正确的文章下

**原因：** 映射方式配置错误

**解决：**
- 使用 `pathname` 映射（推荐）
- 确保每篇文章有唯一的路径

---

## 🎯 完整配置示例

### .env.local

```bash
# Giscus 评论系统配置
NEXT_PUBLIC_GISCUS_REPO=johndoe/my-blog
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOABC123xyz
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOABC456uvw
```

### components/comments.tsx

```tsx
'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'

export function Comments() {
  const { resolvedTheme } = useTheme()

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  // 开发环境未配置时显示提示
  if (!repoId || !categoryId) {
    return (
      <div className="mt-16 rounded-lg border bg-muted/50 p-6 text-center">
        <h3 className="font-semibold mb-2">💬 评论系统待配置</h3>
        <p className="text-sm text-muted-foreground">
          请配置 Giscus 评论系统
        </p>
        <a
          href="https://giscus.app/zh-CN"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          前往配置 →
        </a>
      </div>
    )
  }

  return (
    <div className="mt-16">
      <Giscus
        id="comments"
        repo={repo}
        repoId={repoId}
        category="General"
        categoryId={categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
```

---

## 📊 配置检查清单

- [ ] GitHub Discussions 已启用
- [ ] Giscus App 已安装
- [ ] 获取了 repoId
- [ ] 获取了 categoryId
- [ ] 更新了 .env.local
- [ ] 重启了开发服务器
- [ ] 测试评论功能正常
- [ ] 测试深色模式适配
- [ ] 测试移动端显示

---

## 🔗 相关链接

- **Giscus 官网**: https://giscus.app/zh-CN
- **Giscus GitHub**: https://github.com/giscus/giscus
- **高级配置**: https://github.com/giscus/giscus/blob/main/ADVANCED.md

---

**配置完成后，删除此文件即可**
