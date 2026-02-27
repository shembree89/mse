import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../../stores/appStore.ts'
import { NAV_ITEMS, type NavItem } from './navItems.ts'

export function useNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentSetId = useAppStore((s) => s.currentSetId)

  function handleNav(item: NavItem) {
    if (item.requiresSet && !currentSetId) return
    switch (item.id) {
      case 'sets':
        navigate('/sets')
        break
      case 'cards':
        navigate(`/sets/${currentSetId}/cards`)
        break
      case 'editor': {
        const cardId = useAppStore.getState().currentCardId
        if (cardId) navigate(`/sets/${currentSetId}/cards/${cardId}`)
        break
      }
      case 'keywords':
        navigate(`/sets/${currentSetId}/keywords`)
        break
      case 'stats':
        navigate(`/sets/${currentSetId}/stats`)
        break
    }
  }

  function isActive(item: NavItem) {
    const p = location.pathname
    switch (item.id) {
      case 'sets': return p === '/sets' || p === '/'
      case 'cards': return p.endsWith('/cards')
      case 'editor': return p.includes('/cards/') && !p.endsWith('/cards')
      case 'keywords': return p.endsWith('/keywords')
      case 'stats': return p.endsWith('/stats')
      default: return false
    }
  }

  return { handleNav, isActive, currentSetId }
}

export function NavigationRail() {
  const { handleNav, isActive, currentSetId } = useNavigation()

  return (
    <nav className="flex w-16 shrink-0 flex-col items-center gap-1 border-r border-border bg-surface-1 py-3">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item)
        const disabled = item.requiresSet && !currentSetId
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item)}
            disabled={disabled}
            className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg text-xs transition-colors ${
              active
                ? 'bg-accent/20 text-accent'
                : disabled
                  ? 'text-text-muted/40 cursor-not-allowed'
                  : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="mt-0.5">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
