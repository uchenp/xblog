#!/bin/bash

# Giscus 配置脚本
# 使用方法：./configure-giscus.sh

echo "🔧 Giscus 评论系统配置工具"
echo "=========================="
echo ""

# 检查 .env.local 是否存在
if [ ! -f .env.local ]; then
  echo "❌ .env.local 文件不存在"
  echo "正在创建 .env.local..."
  cp .env.example .env.local
  echo "✅ .env.local 已创建"
  echo ""
fi

echo "📝 请输入你的配置信息："
echo ""

# 获取仓库信息
read -p "GitHub 用户名：" username
read -p "仓库名称：" reponame
echo ""

echo "🌐 正在获取 repoId 和 categoryId..."
echo ""
echo "请在新窗口打开以下页面获取 ID："
echo "https://giscus.app/zh-CN"
echo ""
echo "1. 在'仓库'栏输入：${username}/${reponame}"
echo "2. 点击 'Get repoId' 获取仓库 ID"
echo "3. 点击 'Get category ID' 获取分类 ID"
echo ""

read -p "按回车键继续..."

# 读取 repoId
read -p "输入 repoId (格式：R_kgDOxxxxxx): " repoid

# 读取 categoryId
read -p "输入 categoryId (格式：DIC_kwDOxxxxxx): " categoryid

echo ""
echo "⚙️  正在更新 .env.local..."

# 更新 .env.local
if grep -q "NEXT_PUBLIC_GISCUS_REPO" .env.local; then
  # 已存在，更新
  sed -i.bak "s|NEXT_PUBLIC_GISCUS_REPO=.*|NEXT_PUBLIC_GISCUS_REPO=${username}/${reponame}|" .env.local
  sed -i.bak "s|NEXT_PUBLIC_GISCUS_REPO_ID=.*|NEXT_PUBLIC_GISCUS_REPO_ID=${repoid}|" .env.local
  sed -i.bak "s|NEXT_PUBLIC_GISCUS_CATEGORY_ID=.*|NEXT_PUBLIC_GISCUS_CATEGORY_ID=${categoryid}|" .env.local
  rm .env.local.bak
  echo "✅ .env.local 已更新"
else
  # 不存在，追加
  cat >> .env.local << EOF

# Giscus 评论系统配置
NEXT_PUBLIC_GISCUS_REPO=${username}/${reponame}
NEXT_PUBLIC_GISCUS_REPO_ID=${repoid}
NEXT_PUBLIC_GISCUS_CATEGORY_ID=${categoryid}
EOF
  echo "✅ .env.local 已更新"
fi

echo ""
echo "🎉 配置完成！"
echo ""
echo "下一步："
echo "1. 重启开发服务器：npm run dev"
echo "2. 访问任意文章页面测试评论"
echo "3. 使用 GitHub 账号登录并发表评论"
echo ""
echo "📖 详细文档：GISCUS_CONFIG_EXAMPLE.md"
echo ""
