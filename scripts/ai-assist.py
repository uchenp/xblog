#!/usr/bin/env python3
"""
AI 辅助写作工具：为 Markdown 文章生成摘要和标签建议。
用法：python3 scripts/ai-assist.py <markdown_file>

功能：
1. 提取文章正文，生成 1-2 句话的 excerpt
2. 基于内容关键词推荐 3-5 个标签
3. 建议分类

注意：本脚本使用简单的文本分析，不依赖外部 AI API。
如需更强的 AI 能力，可接入 OpenAI/通义千问 API。
"""

import re
import sys
import json
from collections import Counter
from pathlib import Path


# 宏观经济领域关键词映射
TAG_KEYWORDS = {
    'GDP': ['GDP', '国内生产总值', '经济增长'],
    'CPI': ['CPI', '消费者价格', '通胀', '物价'],
    'PPI': ['PPI', '生产者价格', '工业品价格'],
    'PMI': ['PMI', '采购经理', '制造业指数'],
    '美联储': ['美联储', 'Fed', 'FOMC', '鲍威尔', '降息', '加息'],
    '货币政策': ['LPR', 'MLF', '降准', '降息', '货币供应', 'M2', '流动性'],
    '财政政策': ['财政', '赤字', '专项债', '国债', '减税'],
    '贸易': ['出口', '进口', '贸易顺差', '关税', '外贸'],
    '就业': ['就业', '失业率', '非农', '劳动力'],
    '房地产': ['房地产', '房价', '商品房', '地产', '房贷'],
    '股市': ['A股', '上证', '深证', '创业板', '股市', '股票'],
    '债市': ['国债', '债券', '收益率', '利率'],
    '外汇': ['汇率', '人民币', '美元', '外汇储备'],
    '黄金': ['黄金', '金价', '贵金属'],
    'Next.js': ['Next.js', 'nextjs', 'Next'],
    'React': ['React', 'react', 'hooks', '组件'],
    'TypeScript': ['TypeScript', 'typescript', 'TS'],
    '前端': ['前端', 'CSS', 'HTML', 'JavaScript', '浏览器'],
}

CATEGORY_KEYWORDS = {
    '宏观经济': ['GDP', 'CPI', 'PPI', 'PMI', '宏观', '经济数据', '货币政策', '财政政策'],
    '美联储': ['美联储', 'Fed', 'FOMC', '美元', '美国'],
    '技术分享': ['Next.js', 'React', 'TypeScript', '前端', '代码', '开发', '部署'],
    '投资分析': ['股市', '债市', '黄金', '投资', '配置', '策略'],
}


def extract_content(md_text):
    """从 Markdown 中提取纯文本内容（去掉 frontmatter 和代码块）"""
    # 去掉 frontmatter
    content = re.sub(r'^---\n.*?\n---\n', '', md_text, flags=re.DOTALL)
    # 去掉代码块
    content = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
    # 去掉 Markdown 标记
    content = re.sub(r'[#*_`\[\]()>|]', ' ', content)
    # 去掉 URL
    content = re.sub(r'https?://\S+', '', content)
    return content.strip()


def generate_excerpt(content, max_len=80):
    """从正文前几段生成摘要"""
    # 取前几个非空段落
    paragraphs = [p.strip() for p in content.split('\n\n') if len(p.strip()) > 20]
    if not paragraphs:
        return ''

    excerpt = paragraphs[0]
    # 如果太长，截断
    if len(excerpt) > max_len:
        excerpt = excerpt[:max_len].rsplit('，', 1)[0] + '...'
    return excerpt


def suggest_tags(content, existing_tags=None):
    """基于关键词匹配推荐标签"""
    content_lower = content.lower()
    scores = {}

    for tag, keywords in TAG_KEYWORDS.items():
        score = sum(content_lower.count(kw.lower()) for kw in keywords)
        if score > 0:
            scores[tag] = score

    # 按得分排序，取 top 5
    suggested = [tag for tag, _ in sorted(scores.items(), key=lambda x: -x[1])[:5]]

    # 合并已有标签
    if existing_tags:
        combined = list(dict.fromkeys(existing_tags + suggested))
        return combined[:5]

    return suggested


def suggest_category(content, existing_category=None):
    """建议分类"""
    if existing_category:
        return existing_category

    content_lower = content.lower()
    scores = {}

    for cat, keywords in CATEGORY_KEYWORDS.items():
        score = sum(content_lower.count(kw.lower()) for kw in keywords)
        if score > 0:
            scores[cat] = score

    if scores:
        return max(scores, key=scores.get)
    return '技术分享'


def main():
    if len(sys.argv) < 2:
        print("用法: python3 scripts/ai-assist.py <markdown_file>", file=sys.stderr)
        sys.exit(1)

    filepath = Path(sys.argv[1])
    if not filepath.exists():
        print(f"Error: 文件不存在 {filepath}", file=sys.stderr)
        sys.exit(1)

    md_text = filepath.read_text(encoding='utf-8')
    content = extract_content(md_text)

    # 提取已有 frontmatter 中的 tags/categories
    existing_tags = re.findall(r'tags:\n((?:\s+-\s+.+\n)*)', md_text)
    tags_list = []
    if existing_tags:
        tags_list = re.findall(r'-\s+(.+)', existing_tags[0])

    existing_cat = re.findall(r'categories:\n\s+-\s+(.+)', md_text)
    cat = existing_cat[0].strip() if existing_cat else None

    excerpt = generate_excerpt(content)
    tags = suggest_tags(content, tags_list)
    category = suggest_category(content, cat)

    result = {
        'file': str(filepath),
        'suggested_excerpt': excerpt,
        'suggested_tags': tags,
        'suggested_category': category,
        'word_count': len(content),
    }

    print(json.dumps(result, ensure_ascii=False, indent=2))

    # 同时输出人类可读格式
    print(f"\n📝 建议摘要: {excerpt}", file=sys.stderr)
    print(f"🏷️  建议标签: {', '.join(tags)}", file=sys.stderr)
    print(f"📂 建议分类: {category}", file=sys.stderr)
    print(f"📊 字数统计: {len(content)} 字", file=sys.stderr)


if __name__ == "__main__":
    main()
