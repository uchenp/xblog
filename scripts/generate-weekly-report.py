#!/usr/bin/env python3
"""
自动生成宏观经济周报 Markdown 文件。
用法：python3 scripts/generate-weekly-report.py [--publish]
  --publish  设置 published: true（默认 false，生成草稿）
"""

import json
import math
import sys
import warnings
from datetime import datetime, timedelta

warnings.filterwarnings('ignore')

try:
    import akshare as ak
except ImportError:
    print("Error: akshare not installed. Run: pip install akshare", file=sys.stderr)
    sys.exit(1)


def sf(value, decimals=1):
    """安全地将值转为 float 并 round"""
    try:
        v = float(value)
        return round(v, decimals) if math.isfinite(v) else None
    except (ValueError, TypeError):
        return None


def trend_arrow(val, prev, invert=False):
    """根据变化方向返回趋势箭头"""
    if val is None or prev is None:
        return '➡️'
    diff = val - prev
    if invert:
        diff = -diff
    if diff > 0.1:
        return '🟢↑'
    elif diff < -0.1:
        return '🔴↓'
    else:
        return '➡️'


def get_week_info():
    """获取当前周信息"""
    now = datetime.now()
    # 上周一到上周日（周报通常回顾上周数据）
    last_monday = now - timedelta(days=now.weekday() + 7)
    last_sunday = last_monday + timedelta(days=6)
    week_num = last_monday.isocalendar()[1]
    year = last_monday.year
    return {
        'year': year,
        'week_num': week_num,
        'monday': last_monday,
        'sunday': last_sunday,
        'monday_str': last_monday.strftime('%m月%d日'),
        'sunday_str': last_sunday.strftime('%m月%d日'),
        'publish_date': now.strftime('%Y-%m-%d'),
        'slug': f"{year}-w{week_num:02d}宏观数据",
    }


def fetch_all_data():
    """获取所有宏观指标数据"""
    indicators = {}

    # GDP
    try:
        df = ak.macro_china_gdp()
        latest, prev = df.iloc[0], df.iloc[1]
        val = sf(latest["国内生产总值-同比增长"])
        prev_val = sf(prev["国内生产总值-同比增长"])
        indicators['gdp'] = {'name': 'GDP 增速', 'value': val, 'prev': prev_val, 'unit': '%', 'period': str(latest["季度"])}
    except Exception as e:
        print(f"Warning: GDP fetch failed: {e}", file=sys.stderr)

    # CPI
    try:
        df = ak.macro_china_cpi()
        latest, prev = df.iloc[0], df.iloc[1]
        val = sf(latest["全国-同比增长"])
        prev_val = sf(prev["全国-同比增长"])
        indicators['cpi'] = {'name': 'CPI 同比', 'value': val, 'prev': prev_val, 'unit': '%', 'period': str(latest["月份"])}
    except Exception as e:
        print(f"Warning: CPI fetch failed: {e}", file=sys.stderr)

    # PPI
    try:
        df = ak.macro_china_ppi()
        latest, prev = df.iloc[0], df.iloc[1]
        val = sf(latest["当月同比增长"])
        prev_val = sf(prev["当月同比增长"])
        indicators['ppi'] = {'name': 'PPI 同比', 'value': val, 'prev': prev_val, 'unit': '%', 'period': str(latest["月份"])}
    except Exception as e:
        print(f"Warning: PPI fetch failed: {e}", file=sys.stderr)

    # PMI
    try:
        df = ak.macro_china_pmi()
        latest, prev = df.iloc[0], df.iloc[1]
        val = sf(latest["制造业-指数"])
        prev_val = sf(prev["制造业-指数"])
        indicators['pmi'] = {'name': '制造业 PMI', 'value': val, 'prev': prev_val, 'unit': '', 'period': str(latest["月份"])}
    except Exception as e:
        print(f"Warning: PMI fetch failed: {e}", file=sys.stderr)

    # M2
    try:
        df = ak.macro_china_money_supply()
        latest, prev = df.iloc[0], df.iloc[1]
        val = sf(latest["货币和准货币(M2)-同比增长"])
        prev_val = sf(prev["货币和准货币(M2)-同比增长"])
        indicators['m2'] = {'name': 'M2 增速', 'value': val, 'prev': prev_val, 'unit': '%', 'period': str(latest["月份"])}
    except Exception as e:
        print(f"Warning: M2 fetch failed: {e}", file=sys.stderr)

    # 进出口
    try:
        df = ak.macro_china_hgjck()
        latest, prev = df.iloc[0], df.iloc[1]
        exp_val = sf(latest["当月出口额-同比增长"])
        exp_prev = sf(prev["当月出口额-同比增长"])
        imp_val = sf(latest["当月进口额-同比增长"])
        imp_prev = sf(prev["当月进口额-同比增长"])
        indicators['exports'] = {'name': '出口增速', 'value': exp_val, 'prev': exp_prev, 'unit': '%', 'period': str(latest["月份"])}
        indicators['imports'] = {'name': '进口增速', 'value': imp_val, 'prev': imp_prev, 'unit': '%', 'period': str(latest["月份"])}
    except Exception as e:
        print(f"Warning: Trade fetch failed: {e}", file=sys.stderr)

    # 社融
    try:
        df = ak.macro_china_new_financial_credit()
        latest, prev = df.iloc[0], df.iloc[1]
        val = sf(latest["累计"])
        prev_val = sf(prev["累计"])
        indicators['social_financing'] = {
            'name': '社融增量(累计)',
            'value': round(val / 10000, 1) if val else None,
            'prev': round(prev_val / 10000, 1) if prev_val else None,
            'unit': '万亿',
            'period': str(latest["月份"])
        }
    except Exception as e:
        print(f"Warning: Social financing fetch failed: {e}", file=sys.stderr)

    # 固投
    try:
        df = ak.macro_china_gdzctz()
        latest, prev = df.iloc[0], df.iloc[1]
        val = sf(latest["同比增长"])
        prev_val = sf(prev["同比增长"])
        indicators['fixed_asset'] = {'name': '固定资产投资', 'value': val, 'prev': prev_val, 'unit': '%', 'period': str(latest["月份"])}
    except Exception as e:
        print(f"Warning: Fixed asset fetch failed: {e}", file=sys.stderr)

    # LPR
    try:
        df = ak.macro_china_lpr()
        df = df.sort_values("TRADE_DATE", ascending=False).reset_index(drop=True)
        latest, prev = df.iloc[0], df.iloc[1]
        val = sf(latest.get("LPR1Y")) if sf(latest.get("LPR1Y")) is not None else sf(latest["RATE_1"])
        prev_val = sf(prev.get("LPR1Y")) if sf(prev.get("LPR1Y")) is not None else sf(prev["RATE_1"])
        indicators['lpr'] = {'name': 'LPR (1年)', 'value': val, 'prev': prev_val, 'unit': '%', 'period': str(latest["TRADE_DATE"])[:7]}
    except Exception as e:
        print(f"Warning: LPR fetch failed: {e}", file=sys.stderr)

    return indicators


def generate_report(week_info, indicators, publish=False):
    """生成周报 Markdown 内容"""
    published_str = 'true' if publish else 'false'
    now_iso = datetime.now().strftime('%Y-%m-%dT%H:%M:%S.000Z')

    lines = []

    # Frontmatter
    lines.append('---')
    lines.append(f"title: {week_info['year']}-W{week_info['week_num']:02d}宏观数据")
    lines.append(f"excerpt: {week_info['monday_str']} - {week_info['sunday_str']}（第{week_info['week_num']}周）宏观数据速览")
    lines.append('tags:')
    lines.append('  - 宏观经济')
    lines.append('  - 周度数据')
    lines.append('categories:')
    lines.append('  - 宏观经济')
    lines.append(f"publishedAt: '{now_iso}'")
    lines.append(f"updatedAt: '{now_iso}'")
    lines.append(f"published: {published_str}")
    lines.append('---')
    lines.append('')

    # Title
    lines.append(f'# 📊 {week_info["year"]}-W{week_info["week_num"]:02d} 宏观经济数据周报')
    lines.append('')
    lines.append(f'**报告周期：{week_info["year"]}年{week_info["monday_str"]} - {week_info["sunday_str"]}（第{week_info["week_num"]}周）**')
    lines.append('')
    lines.append(f'**生成日期：{week_info["publish_date"]}**')
    lines.append('')
    lines.append('---')
    lines.append('')

    # 核心指标速览表
    lines.append('## 📌 核心指标速览')
    lines.append('')
    lines.append('| 指标 | 最新值 | 前值 | 变化 | 趋势 | 数据期间 |')
    lines.append('|:-----|:------:|:----:|:----:|:----:|:--------:|')

    for key in ['gdp', 'pmi', 'cpi', 'ppi', 'm2', 'exports', 'imports', 'social_financing', 'fixed_asset', 'lpr']:
        if key not in indicators:
            continue
        ind = indicators[key]
        val_str = f"{ind['value']}{ind['unit']}" if ind['value'] is not None else '-'
        prev_str = f"{ind['prev']}{ind['unit']}" if ind['prev'] is not None else '-'
        if ind['value'] is not None and ind['prev'] is not None:
            diff = round(ind['value'] - ind['prev'], 1)
            change_str = f"{diff:+.1f}"
        else:
            change_str = '-'
        arrow = trend_arrow(ind['value'], ind['prev'])
        lines.append(f"| **{ind['name']}** | {val_str} | {prev_str} | {change_str} | {arrow} | {ind['period']} |")

    lines.append('')

    # 分类详情
    lines.append('---')
    lines.append('')
    lines.append('## 🇨🇳 中国经济数据详情')
    lines.append('')

    # 增长类
    lines.append('### 增长指标')
    lines.append('')
    growth_keys = ['gdp', 'pmi', 'fixed_asset']
    for key in growth_keys:
        if key not in indicators:
            continue
        ind = indicators[key]
        arrow = trend_arrow(ind['value'], ind['prev'])
        lines.append(f"- **{ind['name']}**：{ind['value']}{ind['unit']} {arrow}（前值 {ind['prev']}{ind['unit']}，期间：{ind['period']}）")
    lines.append('')

    # 通胀类
    lines.append('### 通胀指标')
    lines.append('')
    inflation_keys = ['cpi', 'ppi']
    for key in inflation_keys:
        if key not in indicators:
            continue
        ind = indicators[key]
        arrow = trend_arrow(ind['value'], ind['prev'])
        lines.append(f"- **{ind['name']}**：{ind['value']}{ind['unit']} {arrow}（前值 {ind['prev']}{ind['unit']}，期间：{ind['period']}）")
    lines.append('')

    # 贸易类
    lines.append('### 贸易指标')
    lines.append('')
    trade_keys = ['exports', 'imports']
    for key in trade_keys:
        if key not in indicators:
            continue
        ind = indicators[key]
        arrow = trend_arrow(ind['value'], ind['prev'])
        lines.append(f"- **{ind['name']}**：{ind['value']}{ind['unit']} {arrow}（前值 {ind['prev']}{ind['unit']}，期间：{ind['period']}）")
    lines.append('')

    # 金融类
    lines.append('### 金融指标')
    lines.append('')
    finance_keys = ['m2', 'social_financing', 'lpr']
    for key in finance_keys:
        if key not in indicators:
            continue
        ind = indicators[key]
        arrow = trend_arrow(ind['value'], ind['prev'])
        lines.append(f"- **{ind['name']}**：{ind['value']}{ind['unit']} {arrow}（前值 {ind['prev']}{ind['unit']}，期间：{ind['period']}）")
    lines.append('')

    # 分析模板
    lines.append('---')
    lines.append('')
    lines.append('## 📝 本周解读')
    lines.append('')
    lines.append('<!-- 在此添加你对本周数据的分析和解读 -->')
    lines.append('')
    lines.append('### 关键发现')
    lines.append('')
    lines.append('1. ')
    lines.append('2. ')
    lines.append('3. ')
    lines.append('')
    lines.append('### 政策观察')
    lines.append('')
    lines.append('<!-- 本周重要政策动态 -->')
    lines.append('')
    lines.append('### 市场影响')
    lines.append('')
    lines.append('<!-- 数据对市场的潜在影响 -->')
    lines.append('')

    # 下周关注
    lines.append('---')
    lines.append('')
    lines.append('## 🔮 下周关注')
    lines.append('')
    lines.append('<!-- 在此添加下周重要数据发布日历 -->')
    lines.append('')
    lines.append('| 日期 | 事件 | 重要性 |')
    lines.append('|:----:|:-----|:------:|')
    lines.append('| | | |')
    lines.append('')

    # 数据来源
    lines.append('---')
    lines.append('')
    lines.append('## 📚 数据来源')
    lines.append('')
    lines.append('- 国家统计局 (stats.gov.cn)')
    lines.append('- 中国人民银行 (pbc.gov.cn)')
    lines.append('- 海关总署 (customs.gov.cn)')
    lines.append('- 数据获取：akshare')
    lines.append('')
    lines.append(f'*本报告数据由系统自动获取，分析部分需人工补充。数据截至{week_info["publish_date"]}。*')
    lines.append('')

    return '\n'.join(lines)


def main():
    publish = '--publish' in sys.argv

    print("📊 正在获取宏观数据...", file=sys.stderr)
    indicators = fetch_all_data()

    if not indicators:
        print("Error: 所有数据获取失败", file=sys.stderr)
        sys.exit(1)

    print(f"✅ 成功获取 {len(indicators)} 项指标", file=sys.stderr)

    week_info = get_week_info()
    report = generate_report(week_info, indicators, publish)

    # 输出文件名
    filename = f"content/posts/{week_info['slug']}.md"
    print(f"📝 生成周报：{filename}", file=sys.stderr)
    print(f"   发布状态：{'已发布' if publish else '草稿'}", file=sys.stderr)

    # 输出到 stdout（供 workflow 使用）
    print(report)

    # 同时写入文件
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(report)

    print(f"✅ 文件已写入：{filename}", file=sys.stderr)


if __name__ == "__main__":
    main()
