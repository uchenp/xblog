#!/usr/bin/env python3
"""
获取中国宏观经济数据，输出为 JSON 格式供前端使用。
数据来源：akshare
覆盖指标：GDP、CPI、PPI、PMI、出口增速、进口增速、M2、社融、固投、LPR
"""

import json
import math
import sys
import warnings
warnings.filterwarnings('ignore')

try:
    import akshare as ak
except ImportError:
    print(json.dumps({"error": "akshare 未安装，请运行: pip install akshare"}))
    sys.exit(1)


def sf(value, decimals=1):
    """安全地将值转为 float 并 round，返回 None 如果无效"""
    try:
        v = float(value)
        return round(v, decimals) if math.isfinite(v) else None
    except (ValueError, TypeError):
        return None


def get_indicator(name, getter):
    """通用指标获取包装器"""
    try:
        return getter()
    except Exception as e:
        print(f"Warning: {name} fetch failed: {e}", file=sys.stderr)
        return None


def get_cpi():
    df = ak.macro_china_cpi()
    latest, prev = df.iloc[0], df.iloc[1]
    val = sf(latest["全国-同比增长"])
    prev_val = sf(prev["全国-同比增长"])
    if val is None:
        return None
    return {
        "name": "CPI",
        "nameEn": "Consumer Price Index",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-10",
        "yoy": round(val - prev_val, 1) if prev_val is not None else None,
        "mom": sf(latest["全国-环比增长"]),
        "trend": "up" if (prev_val is not None and val > prev_val) else "down",
        "category": "inflation",
    }


def get_ppi():
    df = ak.macro_china_ppi()
    latest, prev = df.iloc[0], df.iloc[1]
    val = sf(latest["当月同比增长"])
    prev_val = sf(prev["当月同比增长"])
    if val is None:
        return None
    return {
        "name": "PPI",
        "nameEn": "Producer Price Index",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-10",
        "yoy": round(val - prev_val, 1) if prev_val is not None else None,
        "mom": None,
        "trend": "up" if (prev_val is not None and val > prev_val) else "down",
        "category": "inflation",
    }


def get_pmi():
    df = ak.macro_china_pmi()
    latest, prev = df.iloc[0], df.iloc[1]
    val = sf(latest["制造业-指数"])
    prev_val = sf(prev["制造业-指数"])
    if val is None:
        return None
    return {
        "name": "制造业 PMI",
        "nameEn": "Manufacturing PMI",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "",
        "period": str(latest["月份"]),
        "publishDate": "2026-03-31",
        "yoy": sf(latest["制造业-同比增长"]),
        "mom": round(val - prev_val, 1) if prev_val is not None else None,
        "trend": "up" if (prev_val is not None and val > prev_val) else "down",
        "category": "growth",
    }


def get_gdp():
    df = ak.macro_china_gdp()
    latest, prev = df.iloc[0], df.iloc[1]
    val = sf(latest["国内生产总值-同比增长"])
    prev_val = sf(prev["国内生产总值-同比增长"])
    if val is None:
        return None
    return {
        "name": "GDP 增速",
        "nameEn": "GDP Growth",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["季度"]),
        "publishDate": "2026-04-15",
        "yoy": round(val - prev_val, 1) if prev_val is not None else None,
        "mom": None,
        "trend": "up" if (prev_val is not None and val > prev_val) else "down",
        "category": "growth",
    }


def get_exports():
    df = ak.macro_china_hgjck()
    latest, prev = df.iloc[0], df.iloc[1]
    val = sf(latest["当月出口额-同比增长"])
    prev_val = sf(prev["当月出口额-同比增长"])
    if val is None:
        return None
    return {
        "name": "出口增速",
        "nameEn": "Export Growth",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-07",
        "yoy": round(val - prev_val, 1) if prev_val is not None else None,
        "mom": sf(latest["当月出口额-环比增长"]),
        "trend": "up" if (prev_val is not None and val > prev_val) else "down",
        "category": "trade",
    }


def get_imports():
    df = ak.macro_china_hgjck()
    latest, prev = df.iloc[0], df.iloc[1]
    val = sf(latest["当月进口额-同比增长"])
    prev_val = sf(prev["当月进口额-同比增长"])
    if val is None:
        return None
    return {
        "name": "进口增速",
        "nameEn": "Import Growth",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-07",
        "yoy": round(val - prev_val, 1) if prev_val is not None else None,
        "mom": sf(latest["当月进口额-环比增长"]),
        "trend": "up" if (prev_val is not None and val > prev_val) else "down",
        "category": "trade",
    }


def get_m2():
    df = ak.macro_china_money_supply()
    latest, prev = df.iloc[0], df.iloc[1]
    val = sf(latest["货币和准货币(M2)-同比增长"])
    prev_val = sf(prev["货币和准货币(M2)-同比增长"])
    if val is None:
        return None
    return {
        "name": "M2 增速",
        "nameEn": "M2 Growth",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-11",
        "yoy": round(val - prev_val, 1) if prev_val is not None else None,
        "mom": sf(latest["货币和准货币(M2)-环比增长"]),
        "trend": "up" if (prev_val is not None and val > prev_val) else "down",
        "category": "finance",
    }


def get_social_financing():
    df = ak.macro_china_new_financial_credit()
    latest, prev = df.iloc[0], df.iloc[1]
    val_cum = sf(latest["累计"])
    prev_cum = sf(prev["累计"])
    yoy = sf(latest["累计-同比增长"])
    mom = sf(latest["当月-环比增长"])
    if val_cum is None:
        return None
    return {
        "name": "社融增量",
        "nameEn": "Total Social Financing",
        "latestValue": round(val_cum / 10000, 1),
        "previousValue": round(prev_cum / 10000, 1) if prev_cum is not None else None,
        "unit": "万亿",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-11",
        "yoy": yoy,
        "mom": mom,
        "trend": "up" if (yoy is not None and yoy > 0) else "down",
        "category": "finance",
    }


def get_fixed_asset_investment():
    df = ak.macro_china_gdzctz()
    latest, prev = df.iloc[0], df.iloc[1]
    val = sf(latest["同比增长"])
    prev_val = sf(prev["同比增长"])
    if val is None:
        return None
    return {
        "name": "固定资产投资",
        "nameEn": "Fixed Asset Investment",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-16",
        "yoy": round(val - prev_val, 1) if prev_val is not None else None,
        "mom": None,
        "trend": "up" if (prev_val is not None and val > prev_val) else "down",
        "category": "property",
    }


def get_lpr():
    df = ak.macro_china_lpr()
    # 按日期排序，取最新两条
    df = df.sort_values("TRADE_DATE", ascending=False).reset_index(drop=True)
    latest, prev = df.iloc[0], df.iloc[1]
    # LPR1Y 是 1 年期，LPR5Y 是 5 年期；优先用 LPR1Y，回退到 RATE_1
    val = sf(latest.get("LPR1Y")) if sf(latest.get("LPR1Y")) is not None else sf(latest["RATE_1"])
    prev_val = sf(prev.get("LPR1Y")) if sf(prev.get("LPR1Y")) is not None else sf(prev["RATE_1"])
    if val is None:
        return None
    return {
        "name": "LPR (1年)",
        "nameEn": "Loan Prime Rate 1Y",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["TRADE_DATE"])[:7],
        "publishDate": "2026-04-20",
        "yoy": None,
        "mom": round(val - prev_val, 1) if prev_val is not None else None,
        "trend": "up" if (prev_val is not None and val > prev_val) else ("down" if (prev_val is not None and val < prev_val) else "stable"),
        "category": "finance",
    }


def main():
    indicators = {
        "gdp": get_indicator("GDP", get_gdp),
        "cpi": get_indicator("CPI", get_cpi),
        "ppi": get_indicator("PPI", get_ppi),
        "pmi": get_indicator("PMI", get_pmi),
        "exports": get_indicator("出口", get_exports),
        "imports": get_indicator("进口", get_imports),
        "m2": get_indicator("M2", get_m2),
        "social_financing": get_indicator("社融", get_social_financing),
        "fixed_asset": get_indicator("固投", get_fixed_asset_investment),
        "lpr": get_indicator("LPR", get_lpr),
    }

    result = {k: v for k, v in indicators.items() if v is not None}

    if not result:
        print(json.dumps({"error": "所有数据获取失败"}))
        sys.exit(1)

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
