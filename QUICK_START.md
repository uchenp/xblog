# 快速启动指南

> 所有功能已配置完成，现在可以启动测试了！

---

## 🚀 启动开发服务器

### 方式 1: 使用 npm（推荐）

```bash
cd /Users/jihui.cjh/Projects/GitHub/xblog
npm run dev
```

### 方式 2: 使用 yarn

```bash
cd /Users/jihui.cjh/Projects/GitHub/xblog
yarn dev
```

### 方式 3: 使用 pnpm

```bash
cd /Users/jihui.cjh/Projects/GitHub/xblog
pnpm dev
```

---

## 🌐 访问页面

启动后访问以下页面测试功能：

| 页面 | URL | 说明 |
|------|-----|------|
| **首页** | http://localhost:3000 | 测试深色模式切换 |
| **文章列表** | http://localhost:3000/posts | 测试阅读时间显示 |
| **系列文章** | http://localhost:3000/series | 测试系列功能 |
| **标签** | http://localhost:3000/tags | 测试标签系统 |
| **分类** | http://localhost:3000/categories | 测试分类系统 |
| **归档** | http://localhost:3000/archive | 测试归档功能 |
| **统计** | http://localhost:3000/stats | 测试统计功能 |
| **搜索** | http://localhost:3000/search | 测试搜索功能 |
| **管理后台** | http://localhost:3000/admin | 测试文章管理 |
| **Sitemap** | http://localhost:3000/sitemap.xml | 测试 SEO |
| **Manifest** | http://localhost:3000/manifest.json | 测试 PWA |

---

## ✅ 功能测试清单

### 深色模式
- [ ] 点击右上角太阳/月亮图标
- [ ] 切换浅色/深色/系统模式
- [ ] 主题切换平滑过渡

### 阅读时间
- [ ] 访问文章列表页
- [ ] 每篇文章显示阅读时间
- [ ] 访问文章详情页
- [ ] 标题下方显示阅读时间

### 右侧目录
- [ ] 访问长文章页面
- [ ] 右侧显示目录（桌面端）
- [ ] 滚动时当前章节高亮
- [ ] 点击目录项平滑滚动

### 系列文章
- [ ] 访问 /series 页面
- [ ] 查看系列列表
- [ ] 点击系列查看详情
- [ ] 文章页显示系列导航

### PWA
- [ ] 访问 manifest.json
- [ ] 查看 Service Worker（生产环境）
- [ ] 测试安装提示（生产环境）

### Giscus 评论
- [ ] 访问文章页面
- [ ] 查看底部评论区域
- [ ] 如果未配置，显示提示信息
- [ ] 如果已配置，可以发表评论

### Sitemap
- [ ] 访问 /sitemap.xml
- [ ] 查看所有页面和文章
- [ ] 检查优先级和更新频率

---

## 🔧 配置 Giscus 评论

如果还未配置 Giscus，按照以下步骤：

### 1. 获取配置信息

访问：https://giscus.app/zh-CN

获取：
- repoId（格式：`R_kgDOxxxxxx`）
- categoryId（格式：`DIC_kwDOxxxxxx`）

### 2. 更新环境变量

编辑 `.env.local`：

```bash
# Giscus 评论系统配置
NEXT_PUBLIC_GISCUS_REPO=your-username/xblog
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOxxxxxx
```

### 3. 重启服务器

```bash
# Ctrl+C 停止
# 重新启动
npm run dev
```

---

## 📝 使用管理后台

### 访问管理后台

```
http://localhost:3000/admin
```

### 登录令牌

```
xblog-admin-2026-secret-token
```

### 创建文章

1. 登录管理后台
2. 填写文章信息
3. 使用 Markdown 编辑器编写内容
4. 点击"创建文章"

---

## 🎨 测试深色模式

### 切换方式

1. 点击右上角的太阳/月亮图标
2. 选择主题：
   - ☀️ 浅色
   - 🌙 深色
   - 💻 系统

### 测试页面

- 首页
- 文章页
- 系列页
- 管理后台

---

## 📱 测试 PWA（生产环境）

### 构建生产版本

```bash
npm run build
npm start
```

### 测试安装

1. 访问 http://localhost:3000
2. 浏览器提示安装
3. 添加到主屏幕
4. 离线访问测试

---

## 🐛 故障排查

### 问题 1: 端口被占用

**错误：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决：**
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 [PID]

# 或使用其他端口
PORT=3001 npm run dev
```

---

### 问题 2: Turbopack 配置错误

**错误：**
```
ERROR: This build is using Turbopack, with a webpack config
```

**解决：**

已修复，使用以下命令启动：
```bash
npm run dev  # 自动使用 webpack
```

---

### 问题 3: 模块未找到

**错误：**
```
Module not found: Can't resolve xxx
```

**解决：**
```bash
# 清理缓存
rm -rf node_modules .next

# 重新安装依赖
npm install

# 重新启动
npm run dev
```

---

### 问题 4: 环境变量未生效

**检查：**
```bash
# 查看 .env.local 是否存在
cat .env.local

# 检查变量名是否正确
# 必须以 NEXT_PUBLIC_ 开头
```

**解决：**
```bash
# 重启服务器
npm run dev
```

---

## 📊 性能检查

### Lighthouse 测试

1. 打开 Chrome DevTools（F12）
2. 选择 Lighthouse 标签
3. 点击"生成报告"

**预期得分：**
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 100
- PWA: 80+

---

## 🎯 下一步

### 内容创作

1. 使用管理后台创建文章
2. 配置系列文章
3. 添加标签和分类

### 功能优化

1. 配置 Giscus 评论
2. 准备 PWA 正式图标
3. 优化图片资源

### 部署上线

1. 选择部署平台（Vercel、Netlify）
2. 配置生产环境变量
3. 提交代码部署

---

## 📖 参考文档

| 文档 | 说明 |
|------|------|
| `OPTIMIZATION_PART2.md` | 所有功能详细文档 |
| `FEATURES_SUMMARY.md` | 功能总结 |
| `GISCUS_QUICK_START.md` | Giscus 快速配置 |
| `TURBOPACK_CONFIG.md` | Turbopack 配置说明 |

---

## 🎉 完成！

所有功能已配置完成，现在可以享受你的博客了！

**启动命令：**
```bash
cd /Users/jihui.cjh/Projects/GitHub/xblog
npm run dev
```

**访问：** http://localhost:3000

祝你使用愉快！🚀
