export interface NavItem {
  icon: string
  label: string
  id: string
  requiresSet: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { icon: '📚', label: 'Sets', id: 'sets', requiresSet: false },
  { icon: '🃏', label: 'Cards', id: 'cards', requiresSet: true },
  { icon: '✏️', label: 'Editor', id: 'editor', requiresSet: true },
  { icon: '🔑', label: 'Keys', id: 'keywords', requiresSet: true },
  { icon: '📊', label: 'Stats', id: 'stats', requiresSet: true },
]
