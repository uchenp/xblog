# FelixView 命令速查手册

本文档汇总了项目中所有可用的 npm scripts 及其用途。

---

## 开发相关

### `npm run dev`

启动本地开发服务器（标准模式）。

```bash
npm run dev
```

- 访问地址：http://localhost:3000
- 支持热更新，修改代码后自动刷新

### `npm run dev:turbopack`

使用 Turbopack 启动开发服务器（更快的编译速度）。

```bash
npm run dev:turbopack
```

- 基于 Rust 的新一代打包器，冷启动和热更新更快
- 适合大型项目或频繁修改时使用

### `npm run build`

构建生产版本。

```bash
npm run build
```

- 输出目录：`.next/`
- 用于本地验证构建是否成功
- Vercel 部署时自动执行

### `npm run start`

启动生产服务器（需先执行 `build`）。

```bash
npm run start
```

- 用于本地测试生产构建效果
- 默认端口 3000

### `npm run typecheck`

TypeScript 类型检查（不生成文件）。

```bash
npm run typecheck
```

- 验证代码类型是否正确
- CI 流程中自动执行
- 提交前建议运行

---

## 数据更新

### `npm run fetch:macro`

手动刷新宏观经济数据。

```bash
npm run fetch:macro
```

**执行内容：**
1. 调用 `scripts/fetch-macro-data.py` 从 akshare 获取最新数据
2. 输出到 `public/data/macro.json`

**覆盖指标（10 项）：**
- GDP 增速、CPI、PPI、制造业 PMI
- M2 增速、出口增速、进口增速
- 社融增量、固定资产投资、LPR (1年)

**使用场景：**
- 需要立即更新网站数据时
- 自动化工作流失败时手动补救

**注意：** GitHub Actions 会在每月 1 号和 15 号自动执行此命令。

---

## 周报生成

### `npm run report:weekly`

生成本周宏观数据周报草稿。

```bash
npm run report:weekly
```

**执行内容：**
1. 获取最新 10 项宏观指标
2. 生成 Markdown 文件：`content/posts/YYYY-wXX宏观数据.md`
3. 默认 `published: false`（草稿状态）

**输出示例：**
```
📊 正在获取宏观数据...
✅ 成功获取 10 项指标
📝 生成周报：content/posts/2026-w30宏观数据.md
   发布状态：草稿
✅ 文件已写入：content/posts/2026-w30宏观数据.md
```

**后续操作：**
1. 编辑生成的文件，补充「本周解读」和「下周关注」
2. 将 frontmatter 中 `published: false` 改为 `true`
3. 提交并推送

### `npm run report:publish`

生成周报并直接标记为已发布。

```bash
npm run report:publish
```

- 与 `report:weekly` 相同，但 `published: true`
- 适合数据无需额外解读时快速发布

**注意：** GitHub Actions 会在每周日 22:00 自动执行 `report:weekly` 并创建 PR。

---

## 写作辅助

### `npm run post:new`

从模板创建新文章草稿。

```bash
npm run post:new
```

**执行内容：**
1. 复制 `content/posts/_template.md` 模板
2. 生成文件：`content/posts/YYYY-MM-DD-draft.md`

**模板包含：**
- 标准 frontmatter 结构（title、excerpt、tags、categories 等）
- 常用 Markdown 结构示例
- `{{DATE}}` 占位符（需手动替换）

**使用流程：**
```bash
npm run post:new
# 编辑 content/posts/2026-07-28-draft.md
# 填写内容后重命名为正式 slug
```

### `npm run post:ai <file>`

为文章生成 AI 辅助建议（摘要、标签、分类）。

```bash
npm run post:ai content/posts/my-article.md
```

**输出示例：**
```json
{
  "file": "content/posts/my-article.md",
  "suggested_excerpt": "本文分析了 2026 年二季度 GDP 数据...",
  "suggested_tags": ["GDP", "宏观经济", "中国经济"],
  "suggested_category": "宏观经济",
  "word_count": 2450
}
```

**功能说明：**
- 基于关键词匹配，不依赖外部 AI API
- 分析文章正文，推荐 3-5 个标签
- 建议最匹配的分类
- 生成 1-2 句话的摘要

**使用场景：**
- 写完初稿后快速生成 frontmatter
- 不确定标签/分类时获取建议

---

## 自动化工作流（GitHub Actions）

以下工作流无需手动执行，由 GitHub Actions 自动触发：

| 工作流 | 触发条件 | 功能 |
|--------|---------|------|
| `typecheck.yml` | 每次 push/PR | TypeScript 类型检查 |
| `update-macro-data.yml` | 每月 1/15 号 10:00 | 自动刷新宏观数据 |
| `generate-weekly-report.yml` | 每周日 22:00 | 自动生成周报 PR |
| `generate-lockfile.yml` | package.json 变更时 | 生成兼容的 lockfile |

**手动触发工作流：**

在 GitHub 仓库页面 → Actions → 选择工作流 → Run workflow

---

## 常用组合命令

### 发布一篇新文章

```bash
# 1. 创建草稿
npm run post:new

# 2. 编辑内容
code content/posts/2026-07-28-draft.md

# 3. 获取 AI 建议
npm run post:ai content/posts/2026-07-28-draft.md

# 4. 本地预览
npm run dev

# 5. 类型检查
npm run typecheck

# 6. 提交发布
git add content/posts/
git commit -m "docs: 发布新文章"
git push
```

### 更新宏观数据并发布周报

```bash
# 1. 刷新数据
npm run fetch:macro

# 2. 生成周报
npm run report:weekly

# 3. 编辑周报内容
code content/posts/2026-w30宏观数据.md

# 4. 提交发布
git add public/data/macro.json content/posts/
git commit -m "docs: 更新宏观数据和 W30 周报"
git push
```

### 本地完整测试

```bash
# 类型检查 + 构建 + 启动
npm run typecheck && npm run build && npm run start
```

---

## 环境变量

在 `.env.local` 或 Vercel 项目设置中配置：

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NEXT_PUBLIC_SITE_URL` | 网站 URL | `http://localhost:3000` |
| `NEXT_PUBLIC_SITE_AUTHOR` | 作者名 | `FelixView` |
| `ADMIN_TOKEN` | 管理后台登录令牌 | （必填） |

---

## 依赖要求

- **Node.js**: >= 20.0.0
- **Python**: >= 3.9（用于数据获取脚本）
- **akshare**: Python 包（`pip install akshare`）

---

## 故障排查

### `npm run fetch:macro` 失败

**症状：** `akshare 未安装`

**解决：**
```bash
pip install akshare
# 或
pip3 install akshare
```

### `npm run report:weekly` 生成的数据为空

**原因：** akshare 接口暂时不可用或网络问题

**解决：**
1. 检查网络连接
2. 稍后重试
3. 查看 stderr 输出中的 Warning 信息

### 构建失败：`Exit handler never called`

**原因：** `package-lock.json` 与 Vercel 的 npm 版本不兼容

**解决：**
```bash
# 删除 lockfile 重新生成
rm package-lock.json
npm install
git add package-lock.json
git commit -m "chore: regenerate lockfile"
git push
```

---

## 项目结构速查

```
xblog/
├── app/                    # Next.js 页面和 API
│   ├── api/
│   │   ├── macro-data/     # 宏观数据 API
│   │   └── views/          # 阅读量统计 API
│   ├── posts/[slug]/       # 文章详情页
│   └── rss.xml/            # RSS Feed
├── components/             # React 组件
│   ├── view-counter.tsx    # 阅读量组件
│   └── newsletter-subscribe.tsx  # 订阅组件
├── content/posts/          # Markdown 文章
│   └── _template.md        # 文章模板
├── lib/                    # 核心逻辑
│   └── posts.ts            # 文章 CRUD
├── scripts/                # Python 脚本
│   ├── fetch-macro-data.py # 数据获取
│   ├── generate-weekly-report.py  # 周报生成
│   └── ai-assist.py        # AI 辅助
└── .github/workflows/      # 自动化工作流
```

---

**最后更新：** 2026-07-28
