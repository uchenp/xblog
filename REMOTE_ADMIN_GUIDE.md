# 远程文章管理指南

> 添加时间：2026 年 4 月 2 日

## 📖 功能说明

提供远程添加、编辑、删除文章的功能，支持：
- Web 管理后台
- RESTful API
- Token 认证

## 🔐 安全配置

### 1. 设置管理令牌

创建 `.env.local` 文件：

```bash
# .env.local
ADMIN_TOKEN=your-secret-token-change-in-production
```

⚠️ **重要**：
- 生产环境务必修改默认令牌
- 不要将令牌提交到代码仓库
- 令牌用于 API 请求认证

### 2. 环境变量

```bash
# 管理令牌
ADMIN_TOKEN=your-secret-token

# 站点 URL（可选）
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🌐 Web 管理后台

### 访问地址
```
http://localhost:3000/admin
```

### 使用步骤

1. **登录管理后台**
   - 访问 `/admin` 页面
   - 输入管理令牌
   - 点击登录

2. **创建文章**
   - 填写标题（必填）
   - 填写摘要（可选）
   - 编写内容（必填，支持 Markdown）
   - 添加标签（用逗号分隔）
   - 添加分类（用逗号分隔）
   - 选择是否立即发布

3. **查看文章**
   - 创建成功后会显示文章 slug
   - 访问 `/posts/[slug]` 查看文章

## 🔌 API 接口

### 基础信息

- **Base URL**: `http://localhost:3000/api/admin/posts`
- **认证方式**: Bearer Token
- **Content-Type**: `application/json`

### 1. 创建文章

**请求：**
```http
POST /api/admin/posts
Content-Type: application/json
Authorization: Bearer your-secret-token

{
  "title": "文章标题",
  "excerpt": "文章摘要",
  "content": "文章内容（Markdown 格式）",
  "tags": ["标签 1", "标签 2"],
  "categories": ["分类 1"],
  "published": true
}
```

**响应：**
```json
{
  "success": true,
  "slug": "wen-zhang-biao-ti",
  "message": "Article created successfully"
}
```

### 2. 更新文章

**请求：**
```http
PUT /api/admin/posts
Content-Type: application/json
Authorization: Bearer your-secret-token

{
  "slug": "wen-zhang-biao-ti",
  "title": "更新后的标题",
  "content": "更新后的内容",
  "tags": ["新标签"],
  "published": true
}
```

**响应：**
```json
{
  "success": true,
  "message": "Article updated successfully"
}
```

### 3. 删除文章

**请求：**
```http
DELETE /api/admin/posts?slug=wen-zhang-biao-ti
Authorization: Bearer your-secret-token
```

**响应：**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

## 💻 使用示例

### 1. 使用 curl 命令

```bash
# 创建文章
curl -X POST http://localhost:3000/api/admin/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{
    "title": "我的新文章",
    "excerpt": "这是文章摘要",
    "content": "# 标题\n\n这是文章内容...",
    "tags": ["Next.js", "博客"],
    "categories": ["技术分享"],
    "published": true
  }'

# 更新文章
curl -X PUT http://localhost:3000/api/admin/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{
    "slug": "wo-de-xin-wen-zhang",
    "title": "更新后的标题",
    "published": false
  }'

# 删除文章
curl -X DELETE "http://localhost:3000/api/admin/posts?slug=wo-de-xin-wen-zhang" \
  -H "Authorization: Bearer your-secret-token"
```

### 2. 使用 JavaScript/Node.js

```javascript
const TOKEN = 'your-secret-token'
const BASE_URL = 'http://localhost:3000/api/admin/posts'

// 创建文章
async function createArticle(article) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(article),
  })
  return await response.json()
}

// 更新文章
async function updateArticle(slug, updates) {
  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ slug, ...updates }),
  })
  return await response.json()
}

// 删除文章
async function deleteArticle(slug) {
  const response = await fetch(`${BASE_URL}?slug=${slug}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
    },
  })
  return await response.json()
}

// 使用示例
createArticle({
  title: '我的文章',
  content: '# Hello\n\n内容...',
  tags: ['技术', '分享'],
  categories: ['教程'],
  published: true,
}).then(console.log)
```

### 3. 使用 Python

```python
import requests

TOKEN = 'your-secret-token'
BASE_URL = 'http://localhost:3000/api/admin/posts'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {TOKEN}'
}

# 创建文章
def create_article(title, content, excerpt=None, tags=None, categories=None, published=True):
    data = {
        'title': title,
        'content': content,
        'excerpt': excerpt or title,
        'tags': tags or [],
        'categories': categories or [],
        'published': published
    }
    response = requests.post(BASE_URL, json=data, headers=headers)
    return response.json()

# 更新文章
def update_article(slug, **updates):
    data = {'slug': slug, **updates}
    response = requests.put(BASE_URL, json=data, headers=headers)
    return response.json()

# 删除文章
def delete_article(slug):
    response = requests.delete(f'{BASE_URL}?slug={slug}', headers=headers)
    return response.json()

# 使用示例
result = create_article(
    title='我的文章',
    content='# Hello\n\n内容...',
    tags=['技术', '分享'],
    categories=['教程']
)
print(result)
```

### 4. 使用 Postman

1. **创建请求**
   - Method: `POST`
   - URL: `http://localhost:3000/api/admin/posts`

2. **设置 Headers**
   ```
   Content-Type: application/json
   Authorization: Bearer your-secret-token
   ```

3. **设置 Body (raw JSON)**
   ```json
   {
     "title": "文章标题",
     "content": "文章内容",
     "tags": ["标签 1"],
     "categories": ["分类 1"],
     "published": true
   }
   ```

## 📝 Markdown 格式支持

文章内容支持标准 Markdown 语法：

```markdown
# 一级标题
## 二级标题
### 三级标题

**粗体** *斜体*

- 列表项 1
- 列表项 2

1. 有序列表 1
2. 有序列表 2

[链接文本](https://example.com)

![图片描述](/path/to/image.png)

```javascript
// 代码块
const code = 'example'
```

> 引用内容

---

水平线
```

## 🔒 安全建议

### 生产环境部署

1. **修改默认令牌**
   ```bash
   # 生成强随机令牌
   openssl rand -hex 32
   ```

2. **使用环境变量**
   ```bash
   # .env.local (不要提交到 git)
   ADMIN_TOKEN=生成的强随机令牌
   ```

3. **配置 .gitignore**
   ```
   .env.local
   .env*.local
   ```

4. **HTTPS 部署**
   - 生产环境务必使用 HTTPS
   - 防止令牌在传输中被窃取

5. **访问控制**
   - 考虑添加 IP 白名单
   - 或集成更完善的认证系统

## 📊 错误处理

### 常见错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 认证失败（令牌错误或缺失） |
| 404 | 文章不存在 |
| 500 | 服务器错误 |

### 错误响应示例

```json
{
  "error": "Unauthorized"
}
```

```json
{
  "error": "Title and content are required"
}
```

```json
{
  "error": "Article not found"
}
```

## 🗂️ 文件结构

```
xblog/
├── app/
│   ├── admin/
│   │   └── page.tsx              # 管理后台页面
│   └── api/
│       └── admin/
│           └── posts/
│               └── route.ts      # 文章管理 API
├── components/ui/
│   ├── textarea.tsx              # 文本域组件
│   └── switch.tsx                # 开关组件
├── .env.example                  # 环境变量示例
└── .env.local                    # 本地环境变量（需创建）
```

## ✅ 测试清单

- [x] 管理后台页面可访问
- [x] Token 认证正常工作
- [x] 创建文章成功
- [x] 更新文章成功
- [x] 删除文章成功
- [x] API 错误处理正常
- [x] Markdown 格式正确解析

## 🚀 下一步优化

### 功能增强
1. **文章列表管理** - 查看所有文章并批量操作
2. **图片上传** - 支持图片上传功能
3. **草稿箱** - 自动保存草稿
4. **版本历史** - 记录文章修改历史
5. **定时发布** - 设置文章发布时间

### 安全增强
1. **用户系统** - 多用户权限管理
2. **双因素认证** - 2FA 支持
3. **操作日志** - 记录所有管理操作
4. **速率限制** - 防止暴力破解

---

**状态**: 已完成 ✅  
**版本**: 1.0.0  
**安全级别**: 基础 Token 认证
