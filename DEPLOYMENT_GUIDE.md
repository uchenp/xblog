# 🚀 博客上线部署指南

> 5 分钟快速部署到 Vercel

---

## 📋 部署前准备

### 1. 确认信息

- ✅ 域名已申请：`你的域名.com`
- ✅ GitHub 仓库：`https://github.com/uchenp/xblog`
- ✅ Vercel 账号：（用 GitHub 登录）

### 2. 准备环境变量

**生成 ADMIN_TOKEN：**
```bash
# 在终端执行
openssl rand -hex 32
```

**保存以下信息：**
```
ADMIN_TOKEN=生成的随机字符串
NEXT_PUBLIC_SITE_URL=https://你的域名.com
NEXT_PUBLIC_GISCUS_REPO=uchenp/xblog
NEXT_PUBLIC_GISCUS_REPO_ID=（可选，去 giscus.app 获取）
NEXT_PUBLIC_GISCUS_CATEGORY_ID=（可选，去 giscus.app 获取）
```

---

## 🎯 方案 A：Vercel 官网部署（推荐新手）

### 步骤 1：访问 Vercel

```
https://vercel.com/
```

### 步骤 2：登录

- 点击 "Log In"
- 选择 "Continue with GitHub"
- 授权 Vercel 访问你的 GitHub

### 步骤 3：导入项目

1. 点击 "Add New Project"
2. 选择 "Import Git Repository"
3. 在列表中找到 `uchenp/xblog`
4. 点击 "Import"

### 步骤 4：配置项目

**Framework Preset:**
```
Next.js（自动检测）
```

**Root Directory:**
```
./（保持默认）
```

**Build and Output Settings:**
```
保持默认
```

### 步骤 5：添加环境变量

点击 "Environment Variables"，添加：

| Name | Value |
|------|-------|
| `ADMIN_TOKEN` | 你生成的随机字符串 |
| `NEXT_PUBLIC_SITE_URL` | `https://你的域名.com` |
| `NEXT_PUBLIC_GISCUS_REPO` | `uchenp/xblog`（可选） |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | （可选） |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | （可选） |

### 步骤 6：点击 Deploy

- 点击 "Deploy" 按钮
- 等待 2-3 分钟
- 看到 "🎉 Congratulations!" 表示成功

### 步骤 7：访问博客

```
https://xblog-xxx.vercel.app
```

---

## 🎯 方案 B：Vercel CLI 部署（推荐开发者）

### 步骤 1：登录 Vercel

```bash
cd /Users/jihui.cjh/Projects/GitHub/xblog
vercel login
```

选择 "Continue with GitHub"

### 步骤 2：首次部署

```bash
vercel
```

**按提示操作：**
```
? Set up and deploy "~/Projects/GitHub/xblog"? Y
? Which scope do you want to deploy to? 选择你的账号
? Link to existing project? N
? What's your project's name? xblog
? In which directory is your code located? ./
? Want to override the settings? N
```

### 步骤 3：添加环境变量

**在 Vercel 控制台添加：**
```
https://vercel.com/你的账号/xblog/settings/environment-variables
```

或本地创建 `.env.production`：
```bash
ADMIN_TOKEN=你的令牌
NEXT_PUBLIC_SITE_URL=https://你的域名.com
```

### 步骤 4：生产部署

```bash
vercel --prod
```

---

## 🌐 配置自定义域名

### 在 Vercel 控制台

1. **进入域名设置**
   ```
   Vercel 控制台 → xblog → Settings → Domains
   ```

2. **添加域名**
   - 输入你的域名（如 `felixchen.dev`）
   - 点击 "Add"

3. **配置 DNS（在域名注册商）**

   **方案 1：CNAME（推荐）**
   ```
   类型：CNAME
   主机/名称：www
   值/目标：cname.vercel-dns.com
   TTL：自动
   ```

   **方案 2：A 记录**
   ```
   类型：A
   主机/名称：@
   值/目标：76.76.21.21
   TTL：自动
   ```

   **方案 3：同时配置**
   ```
   @ → A → 76.76.21.21
   www → CNAME → cname.vercel-dns.com
   ```

4. **等待 DNS 生效**
   - 通常 5-30 分钟
   - 可用命令检查：`ping 你的域名.com`

5. **自动 HTTPS**
   - Vercel 会自动配置 SSL
   - 看到 "Active" 表示配置成功

---

## ✅ 验证部署

### 1. 访问博客

```
https://你的域名.com
```

**检查：**
- ✅ 首页正常显示
- ✅ 文章列表正常
- ✅ 文章详情正常
- ✅ 暗黑模式正常
- ✅ 移动端正常

### 2. 测试后台

```
https://你的域名.com/admin
```

**检查：**
- ✅ 能正常登录
- ✅ 使用 ADMIN_TOKEN 登录
- ✅ 能创建/编辑文章

### 3. 测试 API

```bash
curl https://你的域名.com/api/posts
```

**预期：**
```json
[{"slug":"xxx","title":"xxx",...}]
```

### 4. 测试 SEO

**访问：**
```
https://你的域名.com/sitemap.xml
```

**检查：**
- ✅ sitemap 正常生成
- ✅ 包含所有文章

**访问：**
```
https://你的域名.com/robots.txt
```

**检查：**
- ✅ 允许爬虫访问
- ✅ 阻止 admin 目录

---

## 🔧 常见问题

### 1. 部署失败

**错误：Build failed**

**解决：**
```bash
# 本地测试构建
npm run build

# 查看错误信息
# 修复后重新部署
vercel --prod
```

---

### 2. 域名不生效

**检查 DNS：**
```bash
# ping 域名
ping 你的域名.com

# 检查 DNS 解析
nslookup 你的域名.com
```

**解决：**
- 等待 DNS 生效（最多 24 小时）
- 检查 DNS 配置是否正确
- 清除本地 DNS 缓存

---

### 3. 环境变量不生效

**检查：**
```bash
# 在 Vercel 控制台
Settings → Environment Variables
```

**解决：**
- 确保变量名正确
- 重新部署项目
- 检查变量作用域（Production）

---

### 4. 图片不显示

**检查：**
```tsx
// 使用绝对路径
<img src="/images/xxx.png" />

// 或使用 Next.js Image
import Image from 'next/image'
<Image src="/images/xxx.png" width={800} height={400} />
```

---

## 📊 部署后优化

### 1. 提交到搜索引擎

**Google Search Console：**
```
https://search.google.com/search-console
```

**添加 Sitemap：**
```
https://你的域名.com/sitemap.xml
```

**Bing Webmaster：**
```
https://www.bing.com/webmasters
```

**百度站长平台：**
```
https://ziyuan.baidu.com/
```

---

### 2. 性能优化

**启用 Vercel Analytics：**
```bash
npm install @vercel/analytics
```

**在 layout.tsx 添加：**
```tsx
import { Analytics } from '@vercel/analytics/next'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  )
}
```

---

### 3. 监控和统计

**Vercel 控制台：**
```
Analytics → 查看访问量、性能指标
```

**集成 Umami（可选）：**
```bash
# 自托管统计
https://umami.is/
```

---

## 🎉 部署完成清单

- [ ] 博客成功部署到 Vercel
- [ ] 自定义域名配置完成
- [ ] HTTPS 自动启用
- [ ] 环境变量配置正确
- [ ] 后台管理能正常登录
- [ ] 所有页面正常访问
- [ ] 移动端适配正常
- [ ] SEO 元数据正确
- [ ] Sitemap 提交到搜索引擎
- [ ] 性能监控已启用

---

## 💡 后续建议

### 定期更新

```bash
# 写新文章
git add content/posts/新文章.md
git commit -m "feat: 新文章"
git push

# Vercel 会自动部署！
```

### 备份

```bash
# 定期备份内容
git push origin main

# 备份环境变量
# 在安全地方保存 .env.local
```

### 监控

- 定期检查 Vercel Analytics
- 监控域名到期时间
- 检查 SSL 证书状态

---

## 🆘 需要帮助？

**Vercel 文档：**
```
https://vercel.com/docs
```

**Next.js 部署：**
```
https://nextjs.org/docs/deployment
```

**遇到问题？**
- 查看 Vercel 部署日志
- 检查环境变量配置
- 验证 DNS 设置

---

**祝你部署顺利！** 🚀
