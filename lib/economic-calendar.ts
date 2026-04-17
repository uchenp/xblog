// 全球经济数据发布日历
// 包含中国、美国、欧洲等主要经济体的重要数据发布日程

export interface EconomicEvent {
  id: string
  date: string // YYYY-MM-DD
  time: string // HH:MM 格式，如 "09:30"
  country: 'CN' | 'US' | 'EU' | 'JP' | 'UK'
  countryName: string
  indicator: string
  indicatorEn: string
  period: string // 数据所属期间
  importance: 'high' | 'medium' | 'low'
  previous?: string
  forecast?: string
  actual?: string // 发布后填入
  unit: string
}

export const economicCalendar: EconomicEvent[] = [
  // 中国数据
  {
    id: 'cn-1',
    date: '2026-04-15',
    time: '10:00',
    country: 'CN',
    countryName: '中国',
    indicator: '一季度 GDP',
    indicatorEn: 'Q1 GDP',
    period: '2026年Q1',
    importance: 'high',
    previous: '5.2%',
    forecast: '5.3%',
    unit: '%',
  },
  {
    id: 'cn-2',
    date: '2026-04-15',
    time: '10:00',
    country: 'CN',
    countryName: '中国',
    indicator: '3月工业增加值',
    indicatorEn: 'Industrial Production',
    period: '2026年3月',
    importance: 'high',
    previous: '5.8%',
    forecast: '6.0%',
    unit: '%',
  },
  {
    id: 'cn-3',
    date: '2026-04-16',
    time: '10:00',
    country: 'CN',
    countryName: '中国',
    indicator: '3月固定资产投资',
    indicatorEn: 'Fixed Asset Investment',
    period: '2026年3月',
    importance: 'high',
    previous: '4.2%',
    forecast: '4.5%',
    unit: '%',
  },
  {
    id: 'cn-4',
    date: '2026-04-17',
    time: '10:00',
    country: 'CN',
    countryName: '中国',
    indicator: '3月社会消费品零售',
    indicatorEn: 'Retail Sales',
    period: '2026年3月',
    importance: 'medium',
    previous: '5.5%',
    forecast: '5.8%',
    unit: '%',
  },
  {
    id: 'cn-5',
    date: '2026-04-30',
    time: '09:00',
    country: 'CN',
    countryName: '中国',
    indicator: '4月制造业 PMI',
    indicatorEn: 'Manufacturing PMI',
    period: '2026年4月',
    importance: 'high',
    previous: '50.5',
    forecast: '50.6',
    unit: '',
  },
  {
    id: 'cn-6',
    date: '2026-05-09',
    time: '09:30',
    country: 'CN',
    countryName: '中国',
    indicator: '4月 CPI',
    indicatorEn: 'CPI',
    period: '2026年4月',
    importance: 'medium',
    previous: '0.8%',
    forecast: '0.9%',
    unit: '%',
  },
  {
    id: 'cn-7',
    date: '2026-05-09',
    time: '09:30',
    country: 'CN',
    countryName: '中国',
    indicator: '4月 PPI',
    indicatorEn: 'PPI',
    period: '2026年4月',
    importance: 'medium',
    previous: '-2.1%',
    forecast: '-1.9%',
    unit: '%',
  },
  // 美国数据
  {
    id: 'us-1',
    date: '2026-04-15',
    time: '20:30',
    country: 'US',
    countryName: '美国',
    indicator: '3月 CPI',
    indicatorEn: 'CPI',
    period: '2026年3月',
    importance: 'high',
    previous: '2.8%',
    forecast: '2.9%',
    unit: '%',
  },
  {
    id: 'us-2',
    date: '2026-04-16',
    time: '20:30',
    country: 'US',
    countryName: '美国',
    indicator: '3月零售销售',
    indicatorEn: 'Retail Sales',
    period: '2026年3月',
    importance: 'medium',
    previous: '0.3%',
    forecast: '0.4%',
    unit: '%',
  },
  {
    id: 'us-3',
    date: '2026-04-17',
    time: '20:30',
    country: 'US',
    countryName: '美国',
    indicator: '4月密歇根消费者信心',
    indicatorEn: 'Michigan Consumer Sentiment',
    period: '2026年4月',
    importance: 'medium',
    previous: '58.5',
    forecast: '59.0',
    unit: '',
  },
  {
    id: 'us-4',
    date: '2026-04-30',
    time: '20:30',
    country: 'US',
    countryName: '美国',
    indicator: '一季度 GDP 初值',
    indicatorEn: 'Q1 GDP Advance',
    period: '2026年Q1',
    importance: 'high',
    previous: '2.3%',
    forecast: '2.5%',
    unit: '%',
  },
  {
    id: 'us-5',
    date: '2026-05-02',
    time: '20:30',
    country: 'US',
    countryName: '美国',
    indicator: '4月非农就业',
    indicatorEn: 'Non-Farm Payrolls',
    period: '2026年4月',
    importance: 'high',
    previous: '+22.8万',
    forecast: '+20万',
    unit: '',
  },
  {
    id: 'us-6',
    date: '2026-05-02',
    time: '20:30',
    country: 'US',
    countryName: '美国',
    indicator: '4月失业率',
    indicatorEn: 'Unemployment Rate',
    period: '2026年4月',
    importance: 'high',
    previous: '4.2%',
    forecast: '4.2%',
    unit: '%',
  },
  // 欧洲数据
  {
    id: 'eu-1',
    date: '2026-04-17',
    time: '17:00',
    country: 'EU',
    countryName: '欧元区',
    indicator: '3月调和 CPI',
    indicatorEn: 'HICP',
    period: '2026年3月',
    importance: 'high',
    previous: '2.2%',
    forecast: '2.3%',
    unit: '%',
  },
  {
    id: 'eu-2',
    date: '2026-04-30',
    time: '17:00',
    country: 'EU',
    countryName: '欧元区',
    indicator: '一季度 GDP',
    indicatorEn: 'Q1 GDP',
    period: '2026年Q1',
    importance: 'high',
    previous: '0.9%',
    forecast: '1.0%',
    unit: '%',
  },
  // 日本数据
  {
    id: 'jp-1',
    date: '2026-04-18',
    time: '07:30',
    country: 'JP',
    countryName: '日本',
    indicator: '3月核心 CPI',
    indicatorEn: 'Core CPI',
    period: '2026年3月',
    importance: 'medium',
    previous: '3.0%',
    forecast: '2.9%',
    unit: '%',
  },
]

// 获取国家标签样式
export function getCountryStyle(country: EconomicEvent['country']) {
  const styles: Record<EconomicEvent['country'], { bg: string; text: string; flag: string }> = {
    CN: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-300', flag: '🇨🇳' },
    US: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-300', flag: '🇺🇸' },
    EU: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-300', flag: '🇪' },
    JP: { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-800 dark:text-pink-300', flag: '🇯🇵' },
    UK: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-800 dark:text-purple-300', flag: '🇬' },
  }
  return styles[country]
}

// 获取重要程度标签
export function getImportanceLabel(importance: EconomicEvent['importance']): string {
  const labels = { high: '重要', medium: '一般', low: '次要' }
  return labels[importance]
}

export function getImportanceStyle(importance: EconomicEvent['importance']): string {
  const styles = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  }
  return styles[importance]
}

// 生成动态摘要：显示最近 7 天内最重要的 2-3 项数据
export function getCalendarSummary(): string {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  const weekLaterStr = weekLater.toISOString().split('T')[0]

  // 筛选未来 7 天内的事件，优先选 high importance
  const upcoming = economicCalendar
    .filter((e) => e.date >= todayStr && e.date <= weekLaterStr)
    .sort((a, b) => {
      // 先按重要程度排序（high 在前），再按日期排序
      const importanceOrder = { high: 0, medium: 1, low: 2 }
      if (importanceOrder[a.importance] !== importanceOrder[b.importance]) {
        return importanceOrder[a.importance] - importanceOrder[b.importance]
      }
      return a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
    })

  // 取前 3 项
  const top = upcoming.slice(0, 3)
  if (top.length === 0) return '暂无近期数据'

  return top
    .map((e) => {
      // 如果有 actual 值就显示 actual，否则显示 indicator 名
      if (e.actual) return `${e.indicator} ${e.actual}`
      if (e.forecast) return `${e.indicator} ${e.forecast}`
      return e.indicator
    })
    .join(' · ')
}
