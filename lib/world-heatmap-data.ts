// 全球经济热力图数据
// 包含主要经济体的关键宏观指标

export interface CountryData {
  id: string
  name: string
  nameEn: string
  code: string
  region: string
  gdpGrowth: number // GDP 增速 %
  inflation: number // 通胀率 %
  pmi: number // 制造业 PMI
  unemployment: number // 失业率 %
  interestRate: number // 基准利率 %
}

export const countriesData: CountryData[] = [
  // 亚洲
  { id: 'cn', name: '中国', nameEn: 'China', code: 'CN', region: '亚洲', gdpGrowth: 5.4, inflation: 0.8, pmi: 50.5, unemployment: 5.1, interestRate: 3.10 },
  { id: 'jp', name: '日本', nameEn: 'Japan', code: 'JP', region: '亚洲', gdpGrowth: 1.2, inflation: 2.9, pmi: 49.8, unemployment: 2.5, interestRate: 0.10 },
  { id: 'kr', name: '韩国', nameEn: 'South Korea', code: 'KR', region: '亚洲', gdpGrowth: 2.3, inflation: 2.1, pmi: 50.1, unemployment: 3.0, interestRate: 3.00 },
  { id: 'in', name: '印度', nameEn: 'India', code: 'IN', region: '亚洲', gdpGrowth: 7.2, inflation: 4.8, pmi: 56.5, unemployment: 7.8, interestRate: 6.50 },
  { id: 'id', name: '印度尼西亚', nameEn: 'Indonesia', code: 'ID', region: '亚洲', gdpGrowth: 5.0, inflation: 2.6, pmi: 51.2, unemployment: 5.3, interestRate: 6.00 },
  { id: 'th', name: '泰国', nameEn: 'Thailand', code: 'TH', region: '亚洲', gdpGrowth: 2.8, inflation: 1.5, pmi: 49.5, unemployment: 1.2, interestRate: 2.50 },
  { id: 'vn', name: '越南', nameEn: 'Vietnam', code: 'VN', region: '亚洲', gdpGrowth: 6.5, inflation: 3.2, pmi: 52.8, unemployment: 2.3, interestRate: 4.50 },
  { id: 'sg', name: '新加坡', nameEn: 'Singapore', code: 'SG', region: '亚洲', gdpGrowth: 2.5, inflation: 2.4, pmi: 50.8, unemployment: 1.9, interestRate: 3.20 },
  { id: 'my', name: '马来西亚', nameEn: 'Malaysia', code: 'MY', region: '亚洲', gdpGrowth: 4.2, inflation: 2.0, pmi: 50.3, unemployment: 3.3, interestRate: 3.00 },
  { id: 'ph', name: '菲律宾', nameEn: 'Philippines', code: 'PH', region: '亚洲', gdpGrowth: 5.8, inflation: 3.5, pmi: 51.0, unemployment: 4.5, interestRate: 6.50 },
  { id: 'tw', name: '台湾', nameEn: 'Taiwan', code: 'TW', region: '亚洲', gdpGrowth: 3.5, inflation: 2.2, pmi: 51.5, unemployment: 3.4, interestRate: 2.00 },
  { id: 'hk', name: '香港', nameEn: 'Hong Kong', code: 'HK', region: '亚洲', gdpGrowth: 3.0, inflation: 2.1, pmi: 50.0, unemployment: 2.9, interestRate: 5.25 },

  // 欧洲
  { id: 'de', name: '德国', nameEn: 'Germany', code: 'DE', region: '欧洲', gdpGrowth: 0.8, inflation: 2.3, pmi: 46.5, unemployment: 5.8, interestRate: 4.25 },
  { id: 'fr', name: '法国', nameEn: 'France', code: 'FR', region: '欧洲', gdpGrowth: 1.1, inflation: 2.4, pmi: 47.2, unemployment: 7.3, interestRate: 4.25 },
  { id: 'gb', name: '英国', nameEn: 'United Kingdom', code: 'GB', region: '欧洲', gdpGrowth: 0.6, inflation: 3.1, pmi: 48.5, unemployment: 4.2, interestRate: 4.75 },
  { id: 'it', name: '意大利', nameEn: 'Italy', code: 'IT', region: '欧洲', gdpGrowth: 0.9, inflation: 2.2, pmi: 47.8, unemployment: 7.5, interestRate: 4.25 },
  { id: 'es', name: '西班牙', nameEn: 'Spain', code: 'ES', region: '欧洲', gdpGrowth: 2.1, inflation: 2.5, pmi: 50.2, unemployment: 11.2, interestRate: 4.25 },
  { id: 'nl', name: '荷兰', nameEn: 'Netherlands', code: 'NL', region: '欧洲', gdpGrowth: 1.0, inflation: 2.8, pmi: 49.0, unemployment: 3.8, interestRate: 4.25 },
  { id: 'ch', name: '瑞士', nameEn: 'Switzerland', code: 'CH', region: '欧洲', gdpGrowth: 1.3, inflation: 1.4, pmi: 48.0, unemployment: 2.3, interestRate: 1.50 },
  { id: 'se', name: '瑞典', nameEn: 'Sweden', code: 'SE', region: '欧洲', gdpGrowth: 0.5, inflation: 3.5, pmi: 47.5, unemployment: 7.5, interestRate: 3.75 },
  { id: 'pl', name: '波兰', nameEn: 'Poland', code: 'PL', region: '欧洲', gdpGrowth: 2.8, inflation: 4.5, pmi: 49.8, unemployment: 5.0, interestRate: 5.75 },
  { id: 'tr', name: '土耳其', nameEn: 'Turkey', code: 'TR', region: '欧洲', gdpGrowth: 3.5, inflation: 65.0, pmi: 50.5, unemployment: 9.2, interestRate: 45.00 },
  { id: 'ru', name: '俄罗斯', nameEn: 'Russia', code: 'RU', region: '欧洲', gdpGrowth: 3.2, inflation: 7.5, pmi: 52.0, unemployment: 2.8, interestRate: 16.00 },

  // 北美
  { id: 'us', name: '美国', nameEn: 'United States', code: 'US', region: '北美', gdpGrowth: 2.8, inflation: 2.9, pmi: 50.3, unemployment: 4.2, interestRate: 5.25 },
  { id: 'ca', name: '加拿大', nameEn: 'Canada', code: 'CA', region: '北美', gdpGrowth: 1.2, inflation: 2.8, pmi: 49.5, unemployment: 6.1, interestRate: 5.00 },
  { id: 'mx', name: '墨西哥', nameEn: 'Mexico', code: 'MX', region: '北美', gdpGrowth: 2.5, inflation: 4.2, pmi: 50.8, unemployment: 2.8, interestRate: 11.00 },

  // 南美
  { id: 'br', name: '巴西', nameEn: 'Brazil', code: 'BR', region: '南美', gdpGrowth: 2.2, inflation: 4.0, pmi: 51.5, unemployment: 7.5, interestRate: 10.50 },
  { id: 'ar', name: '阿根廷', nameEn: 'Argentina', code: 'AR', region: '南美', gdpGrowth: -2.5, inflation: 280.0, pmi: 42.0, unemployment: 6.2, interestRate: 80.00 },
  { id: 'cl', name: '智利', nameEn: 'Chile', code: 'CL', region: '南美', gdpGrowth: 1.8, inflation: 3.8, pmi: 49.0, unemployment: 8.5, interestRate: 7.25 },
  { id: 'co', name: '哥伦比亚', nameEn: 'Colombia', code: 'CO', region: '南美', gdpGrowth: 1.5, inflation: 5.5, pmi: 50.0, unemployment: 10.2, interestRate: 12.75 },

  // 大洋洲
  { id: 'au', name: '澳大利亚', nameEn: 'Australia', code: 'AU', region: '大洋洲', gdpGrowth: 1.5, inflation: 3.5, pmi: 49.8, unemployment: 4.0, interestRate: 4.35 },
  { id: 'nz', name: '新西兰', nameEn: 'New Zealand', code: 'NZ', region: '大洋洲', gdpGrowth: 0.8, inflation: 3.2, pmi: 48.5, unemployment: 4.2, interestRate: 5.50 },

  // 中东 & 非洲
  { id: 'sa', name: '沙特阿拉伯', nameEn: 'Saudi Arabia', code: 'SA', region: '中东', gdpGrowth: 1.5, inflation: 2.3, pmi: 55.0, unemployment: 8.0, interestRate: 6.00 },
  { id: 'ae', name: '阿联酋', nameEn: 'UAE', code: 'AE', region: '中东', gdpGrowth: 3.5, inflation: 2.5, pmi: 54.0, unemployment: 3.0, interestRate: 5.40 },
  { id: 'il', name: '以色列', nameEn: 'Israel', code: 'IL', region: '中东', gdpGrowth: 2.0, inflation: 3.0, pmi: 49.0, unemployment: 3.5, interestRate: 4.50 },
  { id: 'za', name: '南非', nameEn: 'South Africa', code: 'ZA', region: '非洲', gdpGrowth: 0.8, inflation: 5.2, pmi: 48.0, unemployment: 32.0, interestRate: 7.75 },
  { id: 'eg', name: '埃及', nameEn: 'Egypt', code: 'EG', region: '非洲', gdpGrowth: 3.8, inflation: 32.0, pmi: 48.5, unemployment: 7.1, interestRate: 27.00 },
  { id: 'ng', name: '尼日利亚', nameEn: 'Nigeria', code: 'NG', region: '非洲', gdpGrowth: 3.2, inflation: 28.0, pmi: 49.0, unemployment: 5.3, interestRate: 24.75 },
]

// 可切换的指标
export const indicators = [
  { key: 'gdpGrowth', label: 'GDP 增速', unit: '%', colorRange: ['#ef4444', '#f59e0b', '#22c55e'], ranges: [-3, 0, 2, 6] },
  { key: 'inflation', label: '通胀率', unit: '%', colorRange: ['#22c55e', '#f59e0b', '#ef4444'], ranges: [0, 2, 4, 10] },
  { key: 'pmi', label: '制造业 PMI', unit: '', colorRange: ['#ef4444', '#f59e0b', '#22c55e'], ranges: [45, 48, 50, 55] },
  { key: 'unemployment', label: '失业率', unit: '%', colorRange: ['#22c55e', '#f59e0b', '#ef4444'], ranges: [0, 4, 7, 15] },
  { key: 'interestRate', label: '基准利率', unit: '%', colorRange: ['#22c55e', '#f59e0b', '#ef4444'], ranges: [0, 3, 6, 15] },
] as const

export type IndicatorKey = typeof indicators[number]['key']

// 根据值获取颜色（线性插值）
export function getColorForValue(
  value: number,
  colorRange: readonly string[],
  ranges: readonly number[]
): string {
  // 找到 value 在 ranges 中的区间
  for (let i = 0; i < ranges.length - 1; i++) {
    if (value >= ranges[i] && value <= ranges[i + 1]) {
      const t = (value - ranges[i]) / (ranges[i + 1] - ranges[i])
      return interpolateColor(colorRange[i], colorRange[i + 1], t)
    }
  }
  // 超出范围
  if (value < ranges[0]) return colorRange[0]
  return colorRange[colorRange.length - 1]
}

// 颜色插值
function interpolateColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  const r = Math.round(c1.r + (c2.r - c1.r) * t)
  const g = Math.round(c1.g + (c2.g - c1.g) * t)
  const b = Math.round(c1.b + (c2.b - c1.b) * t)
  return `rgb(${r}, ${g}, ${b})`
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}
