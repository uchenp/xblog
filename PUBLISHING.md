# FelixView 文章发布流程

本文档说明如何将文章发布到 https://felixview.cc。

---

## 路径一：本地写作 → Git 推送（推荐）

适合长文、深度分析、周报等正式内容。

### 步骤

```bash
# 1. 从模板创建草稿
npm run post:new
# 生成文件：content/posts/2026-07-29-draft.md

# 2. 编辑文章
code content/posts/2026-07-29-draft.md

# 3.（可选）获取 AI 辅助建议（摘要/标签/分类）
npm run post:ai content/posts/2026-07-29-draft.md

# 4. 本地预览
npm run dev
# 访问 http://localhost:3000 查看效果

# 5. 确认无误后：
#    - 将 frontmatter 中 published 改为 true
#    - 重命名文件为正式 slug（如 my-article-title.md）
mv content/posts/2026-07-29-draft.md content/posts/my-article-title.md

# 6. 提交并推送
git add content/posts/
git commit -m "docs: 发布新文章 xxx"
git push
```

推送后 Vercel 自动构建部署，约 2-3 分钟文章上线。

### Frontmatter 模板

```yaml
---
title: 文章标题
excerpt: 一句话描述（用于 SEO 和列表展示，建议 50 字以内）
tags:
  - 标签1
  - 标签2
categories:
  - 分类名
publishedAt: '2026-07-29T10:00:00.000Z'
updatedAt: '2026-07-29T10:00:00.000Z'
published: true
---
```

### 文件命名规范

| 类型 | 命名格式 | 示例 |
|------|---------|------|
| 普通文章 | 英文短横线分隔 | `nextjs-16-features.md` |
| 周报 | 年份-w周号+中文 | `2026-w30宏观数据.md` |
| 草稿 | 日期-draft | `2026-07-29-draft.md` |

---

## 路径二：Admin 后台在线编辑

适合快速修正、短文、紧急更新。

### 步骤

1. 访问 https://felixview.cc/admin
2. 输入 `ADMIN_TOKEN` 登录
3. 点击「新建文章」或编辑已有文章
4. 在线编辑 Markdown + 填写元数据
5. 点击「发布」

### 注意事项

> ⚠️ Admin 后台写入的文件存储在 Vercel serverless 临时文件系统中，**不会持久化到 Git 仓库**。下次代码部署后修改会丢失。
>
> 正式发布仍建议使用路径一。Admin 后台适合临时修改或预览效果。

---

## 路径三：周报自动化（零操作）

每周日 22:00（北京时间），GitHub Actions 自动执行：

1. 调用 akshare 获取最新 10 项宏观指标
2. 生成周报 Markdown 草稿（含数据表格 + 趋势箭头）
3. 创建 Pull Request

### 你只需要做

1. 打开 GitHub PR
2. 补充「本周解读」和「下周关注」部分
3. 合并 PR → 自动部署上线

### 手动触发周报

如果不想等周日自动触发：

```bash
# 本地生成草稿
npm run report:weekly

# 或直接生成并发布
npm run report:publish
```

也可以在 GitHub → Actions → Generate Weekly Report → Run workflow 手动触发。

---

## 宏观数据更新（独立于文章）

首页经济指标卡片的数据独立于文章发布，自动更新：

| 触发方式 | 频率 | 说明 |
|---------|------|------|
| GitHub Actions 自动 | 每月 1/15 号 10:00 | 无需操作 |
| 手动刷新 | 按需 | `npm run fetch:macro` → `git push` |

数据更新后首页自动展示最新值，无需发布文章。

---

## 场景速查

| 场景 | 推荐路径 | 预计耗时 |
|------|---------|---------|
| 写深度分析文章 | 路径一 | 写作时间 + 3 分钟部署 |
| 快速修正错别字 | 路径二 | 即时 |
| 每周数据周报 | 路径三 | 5 分钟补充解读 |
| 仅更新首页数据 | 自动 | 0（无需操作） |
| 紧急发布热点解读 | 路径一（跳过预览） | 5 分钟 |

---

## 常用命令速查

| 命令 | 用途 |
|------|------|
| `npm run post:new` | 从模板创建新文章草稿 |
| `npm run post:ai <file>` | 生成摘要/标签/分类建议 |
| `npm run dev` | 本地预览 |
| `npm run typecheck` | 类型检查（提交前建议运行） |
| `npm run fetch:macro` | 手动刷新宏观数据 |
| `npm run report:weekly` | 生成周报草稿 |
| `npm run report:publish` | 生成并发布周报 |

---

## 发布检查清单

提交前确认：

- [ ] frontmatter 中 `published: true`
- [ ] `excerpt` 已填写（50 字以内）
- [ ] `tags` 和 `categories` 已设置
- [ ] `publishedAt` 日期正确
- [ ] 文件名符合命名规范
- [ ] 本地预览无报错（`npm run dev`）
- [ ] 类型检查通过（`npm run typecheck`）

---

## 故障排查

### 推送后文章未出现

1. 检查 `published` 是否为 `true`
2. 检查 Vercel 构建是否成功：https://vercel.com/uchenps-projects/xblog/deployments
3. 检查文件名是否在 `content/posts/` 目录下且以 `.md` 结尾

### 构建失败

查看 Vercel 构建日志，常见原因：
- TypeScript 类型错误 → 本地运行 `npm run typecheck` 修复
- 依赖安装超时 → 重试即可（网络问题）
- Markdown 格式错误 → 检查 frontmatter YAML 语法

### 数据未更新

```bash
# 手动刷新并推送
npm run fetch:macro
git add public/data/macro.json
git commit -m "chore: 更新宏观数据"
git push
```

---

**最后更新：** 2026-07-29
