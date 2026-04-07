# Giscus 评论系统配置指南

> Giscus 是一个基于 GitHub Discussions 的评论系统，免费、无广告、开源。

## 📖 配置步骤

### 1. 启用 GitHub Discussions

1. 打开你的 GitHub 仓库页面
2. 点击 **Settings** → **General**
3. 找到 **Features** 部分
4. 勾选 **Discussions**
5. 点击 **Save**

### 2. 安装 Giscus App

1. 访问：https://github.com/apps/giscus
2. 点击 **Install**
3. 选择你的仓库
4. 点击 **Install & Authorize**

### 3. 配置 Giscus

1. 访问：https://giscus.app/zh-CN
2. 填写配置：
   - **仓库**: `your-username/xblog`
   - **仓库 ID**: 点击 "Get repoId" 自动获取
   - **Discussions 分类**: `General`（或自定义）
   - **分类 ID**: 点击 "Get category ID" 自动获取
   - **映射方式**: ` pathname`（推荐）
   - **主题**: `light` / `dark`（会自动适配）
   - **语言**: `zh-CN`

3. 复制生成的配置信息

### 4. 更新代码

编辑 `components/comments.tsx`：

```tsx
<Giscus
  id="comments"
  repo="your-username/xblog"                    // 你的仓库
  repoId="R_kgDOxxxxxx"                         // 你的 repoId
  category="General"                            // 分类名称
  categoryId="DIC_kwDOxxxxxx"                   // 分类 ID
  mapping="pathname"                            // 映射方式
  strict="0"                                    // 严格模式
  reactionsEnabled="1"                          // 启用反应
  emitMetadata="0"                              // 不发送元数据
  inputPosition="bottom"                        // 输入框位置
  theme={resolvedTheme === 'dark' ? 'dark' : 'light'}  // 主题
  lang="zh-CN"                                  // 语言
  loading="lazy"                                // 懒加载
/>
```

### 5. 测试评论

1. 启动开发服务器
2. 访问任意文章页面
3. 使用 GitHub 账号登录并发表评论

## 🔧 配置说明

### 映射方式（mapping）

| 选项 | 说明 | 推荐 |
|------|------|------|
| `pathname` | 使用页面路径 | ✅ 推荐 |
| `url` | 使用完整 URL | ⭐ 可选 |
| `title` | 使用文章标题 | ⭐ 可选 |
| `og:title` | 使用 Open Graph 标题 | ⭐ 可选 |
| `specific` | 使用特定术语 | ❌ 不推荐 |

### 主题（theme）

- `light` - 浅色主题
- `dark` - 深色主题
- `dark_dimmed` - 深色（柔和）
- `transparent_dark` - 深色（透明）
- `preferred_color_scheme` - 跟随系统

**我们的配置**：自动根据博客主题切换

### 严格模式（strict）

- `0` - 关闭（推荐）
- `1` - 开启（标题必须完全匹配）

## 💡 高级配置

### 自定义分类

1. 在仓库中创建新的 Discussion 分类
2. 获取分类 ID
3. 更新 `categoryId`

### 自定义主题

访问：https://giscus.app/zh-CN
- 点击 "Customize" 标签
- 自定义颜色
- 生成主题 URL

### 通知设置

Giscus 支持：
- 新回复通知
- 提及通知
- 通过 GitHub 通知中心管理

## ⚠️ 注意事项

### 生产环境

1. **必须配置正确的 repo 和 repoId**
2. **确保 Discussions 已启用**
3. **测试评论功能是否正常**

### 开发环境

1. 评论会创建在 GitHub 上
2. 可以使用测试仓库
3. 或暂时禁用评论组件

### 隐私

- Giscus 不收集用户数据
- 评论存储在 GitHub
- 需要 GitHub 账号登录

## 🎯 效果展示

### 功能

- ✅ GitHub 账号登录
- ✅ Markdown 格式支持
- ✅ 代码高亮
- ✅ 表情反应
- ✅ 回复通知
- ✅ 深色模式适配

### 示例

```
文章页面底部
├── 相关文章
└── 评论系统
    ├── 登录按钮（GitHub）
    ├── 评论列表
    ├── 发表评论
    └── 反应表情
```

## 🔗 相关链接

- **Giscus 官网**: https://giscus.app/zh-CN
- **GitHub 仓库**: https://github.com/giscus/giscus
- **文档**: https://github.com/giscus/giscus/blob/main/ADVANCED.md

---

**状态**: 组件已完成，需要配置 GitHub 仓库信息  
**难度**: ⭐⭐ 简单  
**成本**: 免费
