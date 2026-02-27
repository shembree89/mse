import { useNavigation } from './NavigationRail.tsx'
import { NAV_ITEMS } from './navItems.ts'

export function BottomTabBar() {
  const { handleNav, isActive, currentSetId } = useNavigation()

  return (
    <nav className="flex h-14 shrink-0 items-stretch border-t border-border bg-surface-1">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item)
        const disabled = item.requiresSet && !currentSetId
        return (
          <button
            key={item.id}
            onClick={() => handleNav(item)}
            disabled={disabled}
            className={`flex flex-1 flex-col items-center justify-center text-xs transition-colors ${
              active
                ? 'text-accent'
                : disabled
                  ? 'text-text-muted/40 cursor-not-allowed'
                  : 'text-text-secondary active:text-text-primary'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="mt-0.5 text-[10px]">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
