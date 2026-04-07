# Giscus 评论配置 - 快速上手

> 3 分钟完成配置，启用博客评论功能

---

## 🎯 配置流程

```
┌─────────────────────────────────────────────────────────┐
│  步骤 1: 启用 Discussions  (1 分钟)                      │
│  ↓                                                      │
│  步骤 2: 安装 Giscus App  (1 分钟)                       │
│  ↓                                                      │
│  步骤 3: 获取配置 ID  (1 分钟)                           │
│  ↓                                                      │
│  步骤 4: 更新配置文件  (30 秒)                           │
│  ↓                                                      │
│  步骤 5: 测试评论  (30 秒)                               │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 详细步骤

### 步骤 1: 启用 GitHub Discussions

**访问你的仓库：**
```
https://github.com/你的用户名/你的仓库
```

**操作：**
1. 点击 **Settings** 标签
2. 左侧菜单选择 **General**
3. 找到 **Features** 部分
4. ✅ 勾选 **Discussions**
5. 点击 **Save**

**验证：**
仓库顶部出现 **Discussions** 标签 ✅

---

### 步骤 2: 安装 Giscus App

**访问：**
```
https://github.com/apps/giscus
```

**操作：**
1. 点击 **Install**
2. 选择你的仓库
3. 点击 **Install & Authorize**

**验证：**
安装成功提示 ✅

---

### 步骤 3: 获取配置 ID

**访问配置页面：**
```
https://giscus.app/zh-CN
```

**填写配置：**

```
┌─────────────────────────────────────────┐
│  仓库：your-username/xblog              │
│  仓库 ID: [点击获取] → R_kgDOxxxxxx     │
│  分类：General                          │
│  分类 ID: [点击获取] → DIC_kwDOxxxxxx   │
│  映射方式：pathname ✓                   │
│  严格模式：关闭 ✓                        │
│  反应：启用 ✓                            │
│  主题：preferred_color_scheme ✓         │
│  语言：简体中文 ✓                        │
└─────────────────────────────────────────┘
```

**获取 repoId：**
1. 点击 "Get repoId" 按钮
2. 新页面显示 ID
3. 复制（格式：`R_kgDOxxxxxx`）

**获取 categoryId：**
1. 点击 "Get category ID" 按钮
2. 选择 `General` 分类
3. 复制（格式：`DIC_kwDOxxxxxx`）

---

### 步骤 4: 更新配置文件

**方法 1: 手动编辑（推荐）**

编辑 `.env.local` 文件：

```bash
# 添加以下三行
NEXT_PUBLIC_GISCUS_REPO=your-username/xblog
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOxxxxxx
```

**方法 2: 使用配置脚本**

```bash
cd /Users/jihui.cjh/Projects/GitHub/xblog
./configure-giscus.sh
```

按提示输入信息即可。

---

### 步骤 5: 测试评论

**重启服务器：**
```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
npm run dev
```

**访问文章页面：**
```
http://localhost:3000/posts/[任意文章]
```

**验证：**
- 页面底部显示评论框 ✅
- 可以使用 GitHub 账号登录 ✅
- 可以发表评论 ✅

---

## 🔍 配置示例

### .env.local 完整示例

```bash
# 管理令牌
ADMIN_TOKEN=xblog-admin-2026-secret-token

# 站点 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Giscus 评论系统配置
NEXT_PUBLIC_GISCUS_REPO=jihui-cjh/xblog
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOABC123xyz
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOABC456uvw
```

### components/comments.tsx

代码已自动从环境变量读取配置，无需修改。

---

## ⚠️ 常见问题

### ❌ 评论框不显示

**检查清单：**
- [ ] `.env.local` 文件是否存在
- [ ] 环境变量是否正确
- [ ] 是否重启了服务器
- [ ] repoId 和 categoryId 是否正确

**解决方法：**
```bash
# 清理缓存
rm -rf .next

# 重启服务器
npm run dev
```

---

### ❌ 显示"Unauthorized"

**原因：** Giscus App 权限问题

**解决：**
1. 访问：https://github.com/apps/giscus
2. 点击 **Configure**
3. 确保选择了正确的仓库
4. 重新授权

---

### ❌ 深色模式不生效

**检查：** `components/comments.tsx` 中的主题配置

**代码：**
```tsx
theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
```

这会自动根据博客主题切换。

---

### ❌ 评论显示在错误的文章下

**原因：** 映射方式配置错误

**解决：**
确保使用 `pathname` 映射：
```tsx
mapping="pathname"
```

---

## 🎨 自定义配置

### 更改主题

在 `components/comments.tsx` 中修改：

```tsx
// 可选主题：
// light, dark, dark_dimmed, transparent_dark, preferred_color_scheme
theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
```

### 更改语言

```tsx
lang="zh-CN"  // 简体中文
lang="en"     // English
lang="ja"     // 日本語
```

### 更改输入框位置

```tsx
inputPosition="bottom"  // 底部（推荐）
inputPosition="top"     // 顶部
```

---

## 📊 配置检查清单

完成以下检查确保配置正确：

- [ ] GitHub Discussions 已启用
- [ ] Giscus App 已安装并授权
- [ ] 获取了 repoId（`R_kgDOxxxxxx`）
- [ ] 获取了 categoryId（`DIC_kwDOxxxxxx`）
- [ ] 更新了 `.env.local`
- [ ] 重启了开发服务器
- [ ] 文章页面显示评论框
- [ ] 可以使用 GitHub 登录
- [ ] 可以发表评论
- [ ] 深色模式正常

---

## 🚀 生产环境部署

### 1. 更新环境变量

在生产环境（如 Vercel）中添加环境变量：

```
NEXT_PUBLIC_GISCUS_REPO=your-username/xblog
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDOxxxxxx
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDOxxxxxx
```

### 2. 配置域名

在 Giscus 配置页面添加你的生产域名：

```
https://yourdomain.com
```

### 3. 测试

访问生产环境，测试评论功能。

---

## 📖 参考资源

| 资源 | 链接 |
|------|------|
| Giscus 官网 | https://giscus.app/zh-CN |
| Giscus GitHub | https://github.com/giscus/giscus |
| 高级配置 | https://github.com/giscus/giscus/blob/main/ADVANCED.md |
| 主题预览 | https://github.com/giscus/giscus/blob/main/THEMES.md |

---

## 💡 提示

1. **开发环境**：如果未配置，会显示友好的提示信息
2. **生产环境**：务必配置正确的仓库信息
3. **隐私**：评论存储在 GitHub，用户需要 GitHub 账号
4. **管理**：可以在 GitHub Discussions 中管理评论

---

**配置完成后，建议删除：**
- `GISCUS_CONFIG_EXAMPLE.md`
- `GISCUS_QUICK_START.md`

**保留：**
- `OPTIMIZATION_PART2.md`（包含所有功能文档）

---

**预计配置时间**: 3-5 分钟  
**难度**: ⭐⭐ 简单  
**成本**: 免费
