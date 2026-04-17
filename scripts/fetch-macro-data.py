#!/usr/bin/env python3
"""
获取中国宏观经济数据，输出为 JSON 格式供前端使用。
数据来源：akshare
覆盖指标：GDP、CPI、PPI、PMI、出口增速、进口增速、M2、社融、失业率、固投
"""

import json
import sys
import warnings
warnings.filterwarnings('ignore')

try:
    import akshare as ak
except ImportError:
    print(json.dumps({"error": "akshare 未安装，请运行: pip install akshare"}))
    sys.exit(1)


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
    val = round(float(latest["全国-同比增长"]), 1)
    prev_val = round(float(prev["全国-同比增长"]), 1)
    return {
        "name": "CPI",
        "nameEn": "Consumer Price Index",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-10",
        "yoy": round(val - prev_val, 1),
        "mom": round(float(latest["全国-环比增长"]), 1) if not __import__('math').isnan(float(latest["全国-环比增长"])) else None,
        "trend": "up" if val > prev_val else "down",
        "category": "inflation",
    }


def get_ppi():
    df = ak.macro_china_ppi()
    latest, prev = df.iloc[0], df.iloc[1]
    val = round(float(latest["当月同比增长"]), 1)
    prev_val = round(float(prev["当月同比增长"]), 1)
    return {
        "name": "PPI",
        "nameEn": "Producer Price Index",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-10",
        "yoy": round(val - prev_val, 1),
        "mom": None,
        "trend": "up" if val > prev_val else "down",
        "category": "inflation",
    }


def get_pmi():
    df = ak.macro_china_pmi()
    latest, prev = df.iloc[0], df.iloc[1]
    val = round(float(latest["制造业-指数"]), 1)
    prev_val = round(float(prev["制造业-指数"]), 1)
    return {
        "name": "制造业 PMI",
        "nameEn": "Manufacturing PMI",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "",
        "period": str(latest["月份"]),
        "publishDate": "2026-03-31",
        "yoy": round(float(latest["制造业-同比增长"]), 1),
        "mom": round(val - prev_val, 1),
        "trend": "up" if val > prev_val else "down",
        "category": "growth",
    }


def get_gdp():
    df = ak.macro_china_gdp()
    latest, prev = df.iloc[0], df.iloc[1]
    val = round(float(latest["国内生产总值-同比增长"]), 1)
    prev_val = round(float(prev["国内生产总值-同比增长"]), 1)
    return {
        "name": "GDP 增速",
        "nameEn": "GDP Growth",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["季度"]),
        "publishDate": "2026-04-15",
        "yoy": round(val - prev_val, 1),
        "mom": None,
        "trend": "up" if val > prev_val else "down",
        "category": "growth",
    }


def get_exports():
    df = ak.macro_china_hgjck()
    latest, prev = df.iloc[0], df.iloc[1]
    val = round(float(latest["当月出口额-同比增长"]), 1)
    prev_val = round(float(prev["当月出口额-同比增长"]), 1)
    return {
        "name": "出口增速",
        "nameEn": "Export Growth",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-07",
        "yoy": round(val - prev_val, 1),
        "mom": round(float(latest["当月出口额-环比增长"]), 1) if not __import__('math').isnan(float(latest["当月出口额-环比增长"])) else None,
        "trend": "up" if val > prev_val else "down",
        "category": "trade",
    }


def get_imports():
    df = ak.macro_china_hgjck()
    latest, prev = df.iloc[0], df.iloc[1]
    val = round(float(latest["当月进口额-同比增长"]), 1)
    prev_val = round(float(prev["当月进口额-同比增长"]), 1)
    return {
        "name": "进口增速",
        "nameEn": "Import Growth",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-07",
        "yoy": round(val - prev_val, 1),
        "mom": round(float(latest["当月进口额-环比增长"]), 1) if not __import__('math').isnan(float(latest["当月进口额-环比增长"])) else None,
        "trend": "up" if val > prev_val else "down",
        "category": "trade",
    }


def get_m2():
    df = ak.macro_china_money_supply()
    latest, prev = df.iloc[0], df.iloc[1]
    val = round(float(latest["货币和准货币(M2)-同比增长"]), 1)
    prev_val = round(float(prev["货币和准货币(M2)-同比增长"]), 1)
    return {
        "name": "M2 增速",
        "nameEn": "M2 Growth",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-11",
        "yoy": round(val - prev_val, 1),
        "mom": round(float(latest["货币和准货币(M2)-环比增长"]), 1) if not __import__('math').isnan(float(latest["货币和准货币(M2)-环比增长"])) else None,
        "trend": "up" if val > prev_val else "down",
        "category": "finance",
    }


def get_social_financing():
    df = ak.macro_china_new_financial_credit()
    latest, prev = df.iloc[0], df.iloc[1]
    val = round(float(latest["累计-同比增长"]), 1)
    prev_val = round(float(prev["累计-同比增长"]), 1)
    return {
        "name": "社融增量",
        "nameEn": "Total Social Financing",
        "latestValue": round(float(latest["累计"]) / 10000, 1),
        "previousValue": round(float(prev["累计"]) / 10000, 1),
        "unit": "万亿",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-11",
        "yoy": round(val - prev_val, 1),
        "mom": round(float(latest["当月-环比增长"]), 1) if not __import__('math').isnan(float(latest["当月-环比增长"])) else None,
        "trend": "up" if val > prev_val else "down",
        "category": "finance",
    }


def get_fixed_asset_investment():
    df = ak.macro_china_gdzctz()
    latest, prev = df.iloc[0], df.iloc[1]
    val = round(float(latest["同比增长"]), 1)
    prev_val = round(float(prev["同比增长"]), 1)
    return {
        "name": "固定资产投资",
        "nameEn": "Fixed Asset Investment",
        "latestValue": val,
        "previousValue": prev_val,
        "unit": "%",
        "period": str(latest["月份"]),
        "publishDate": "2026-04-16",
        "yoy": round(val - prev_val, 1),
        "mom": None,
        "trend": "up" if val > prev_val else "down",
        "category": "property",
    }


def get_lpr():
    df = ak.macro_china_lpr()
    latest = df.iloc[0]
    return {
        "name": "LPR (1年)",
        "nameEn": "Loan Prime Rate 1Y",
        "latestValue": round(float(latest["RATE_1"]), 2) if __import__('math').isfinite(float(latest["RATE_1"])) else None,
        "previousValue": round(float(df.iloc[1]["RATE_1"]), 2) if __import__('math').isfinite(float(df.iloc[1]["RATE_1"])) else None,
        "unit": "%",
        "period": str(latest["TRADE_DATE"])[:7],
        "publishDate": "2026-04-20",
        "yoy": None,
        "mom": None,
        "trend": "stable",
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
