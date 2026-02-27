export type Color = 'W' | 'U' | 'B' | 'R' | 'G'
export type Rarity = 'common' | 'uncommon' | 'rare' | 'mythic'

export const COLORS: Color[] = ['W', 'U', 'B', 'R', 'G']

export const COLOR_NAMES: Record<Color, string> = {
  W: 'White',
  U: 'Blue',
  B: 'Black',
  R: 'Red',
  G: 'Green',
}

export const COLOR_ORDER: Record<Color, number> = {
  W: 0,
  U: 1,
  B: 2,
  R: 3,
  G: 4,
}

export const SUPERTYPES = ['Basic', 'Legendary', 'Snow', 'World'] as const
export const CARD_TYPES = [
  'Artifact',
  'Battle',
  'Conspiracy',
  'Creature',
  'Dungeon',
  'Enchantment',
  'Instant',
  'Land',
  'Phenomenon',
  'Plane',
  'Planeswalker',
  'Scheme',
  'Sorcery',
  'Tribal',
  'Vanguard',
] as const

export type CardType = (typeof CARD_TYPES)[number]
export type Supertype = (typeof SUPERTYPES)[number]
