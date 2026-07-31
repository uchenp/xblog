export const COLOR_THEMES = [
  {
    name: 'default',
    label: '极简灰',
    light: 'oklch(0.205 0 0)',
    dark: 'oklch(0.985 0 0)',
  },
  {
    name: 'ocean',
    label: '海洋蓝',
    light: 'oklch(0.623 0.214 259.815)',
    dark: 'oklch(0.546 0.245 262.881)',
  },
  {
    name: 'violet',
    label: '极光紫',
    light: 'oklch(0.606 0.25 292.717)',
    dark: 'oklch(0.541 0.281 293.009)',
  },
  {
    name: 'emerald',
    label: '翡翠绿',
    light: 'oklch(0.627 0.194 149.214)',
    dark: 'oklch(0.696 0.17 162.48)',
  },
  {
    name: 'ember',
    label: '经典橘红',
    light: 'oklch(0.637 0.237 25.331)',
    dark: 'oklch(0.637 0.237 25.331)',
  },
  {
    name: 'rose',
    label: '蔷薇粉',
    light: 'oklch(0.586 0.253 17.585)',
    dark: 'oklch(0.712 0.194 13.428)',
  },
] as const

export type ColorThemeName = (typeof COLOR_THEMES)[number]['name']

export const COLOR_THEME_NAMES: ColorThemeName[] = COLOR_THEMES.map(
  (t) => t.name
) as unknown as ColorThemeName[]

export const STORAGE_KEY = 'felixview-color-theme'
