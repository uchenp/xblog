// 中国关键宏观经济指标数据
// 数据来源：国家统计局、人民银行、海关总署等公开数据
// 更新频率：月度/季度

export interface MacroIndicator {
  id: string
  name: string
  nameEn: string
  latestValue: number
  previousValue: number
  unit: string
  period: string // 数据所属期间，如 "2026年3月"
  publishDate: string // 发布日期
  yoy: number | null // 同比变化（百分点或百分比）
  mom: number | null // 环比变化
  trend: 'up' | 'down' | 'stable'
  category: 'growth' | 'inflation' | 'employment' | 'trade' | 'finance' | 'property'
}

export const macroIndicators: MacroIndicator[] = [
  {
    id: 'gdp',
    name: 'GDP 增速',
    nameEn: 'GDP Growth',
    latestValue: 5.4,
    previousValue: 5.2,
    unit: '%',
    period: '2026年Q1',
    publishDate: '2026-04-15',
    yoy: 0.2,
    mom: null,
    trend: 'up',
    category: 'growth',
  },
  {
    id: 'cpi',
    name: 'CPI',
    nameEn: 'Consumer Price Index',
    latestValue: 0.8,
    previousValue: 0.7,
    unit: '%',
    period: '2026年3月',
    publishDate: '2026-04-10',
    yoy: 0.1,
    mom: 0.2,
    trend: 'up',
    category: 'inflation',
  },
  {
    id: 'ppi',
    name: 'PPI',
    nameEn: 'Producer Price Index',
    latestValue: -2.1,
    previousValue: -2.3,
    unit: '%',
    period: '2026年3月',
    publishDate: '2026-04-10',
    yoy: 0.2,
    mom: 0.3,
    trend: 'up',
    category: 'inflation',
  },
  {
    id: 'pmi',
    name: '制造业 PMI',
    nameEn: 'Manufacturing PMI',
    latestValue: 50.5,
    previousValue: 50.2,
    unit: '',
    period: '2026年3月',
    publishDate: '2026-03-31',
    yoy: 0.3,
    mom: 0.3,
    trend: 'up',
    category: 'growth',
  },
  {
    id: 'exports',
    name: '出口增速',
    nameEn: 'Export Growth',
    latestValue: 8.2,
    previousValue: 7.1,
    unit: '%',
    period: '2026年3月',
    publishDate: '2026-04-07',
    yoy: 1.1,
    mom: 1.5,
    trend: 'up',
    category: 'trade',
  },
  {
    id: 'imports',
    name: '进口增速',
    nameEn: 'Import Growth',
    latestValue: 3.5,
    previousValue: 2.8,
    unit: '%',
    period: '2026年3月',
    publishDate: '2026-04-07',
    yoy: 0.7,
    mom: 0.8,
    trend: 'up',
    category: 'trade',
  },
  {
    id: 'm2',
    name: 'M2 增速',
    nameEn: 'M2 Growth',
    latestValue: 7.8,
    previousValue: 7.5,
    unit: '%',
    period: '2026年3月',
    publishDate: '2026-04-11',
    yoy: 0.3,
    mom: 0.4,
    trend: 'up',
    category: 'finance',
  },
  {
    id: 'social_financing',
    name: '社融增量',
    nameEn: 'Total Social Financing',
    latestValue: 4.2,
    previousValue: 3.8,
    unit: '万亿',
    period: '2026年3月',
    publishDate: '2026-04-11',
    yoy: 0.4,
    mom: 0.5,
    trend: 'up',
    category: 'finance',
  },
  {
    id: 'urban_unemployment',
    name: '城镇调查失业率',
    nameEn: 'Urban Unemployment Rate',
    latestValue: 5.1,
    previousValue: 5.2,
    unit: '%',
    period: '2026年3月',
    publishDate: '2026-04-14',
    yoy: -0.1,
    mom: -0.1,
    trend: 'down',
    category: 'employment',
  },
  {
    id: 'property_sales',
    name: '商品房销售增速',
    nameEn: 'Property Sales Growth',
    latestValue: -12.5,
    previousValue: -15.3,
    unit: '%',
    period: '2026年3月',
    publishDate: '2026-04-16',
    yoy: 2.8,
    mom: 1.2,
    trend: 'up',
    category: 'property',
  },
]

// 获取分类标签
export function getCategoryLabel(category: MacroIndicator['category']): string {
  const labels: Record<MacroIndicator['category'], string> = {
    growth: '增长',
    inflation: '通胀',
    employment: '就业',
    trade: '贸易',
    finance: '金融',
    property: '地产',
  }
  return labels[category]
}

// 获取分类颜色
export function getCategoryColor(category: MacroIndicator['category']): string {
  const colors: Record<MacroIndicator['category'], string> = {
    growth: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    inflation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    employment: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    trade: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    finance: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    property: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  }
  return colors[category]
}
