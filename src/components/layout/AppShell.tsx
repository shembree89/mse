import type { ReactNode } from 'react'
import { NavigationRail } from './NavigationRail.tsx'
import { BottomTabBar } from './BottomTabBar.tsx'
import { TopBar } from './TopBar.tsx'
import { useBreakpoint } from '../../hooks/useBreakpoint.ts'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const breakpoint = useBreakpoint()
  const isPhone = breakpoint === 'phone'

  return (
    <div className="flex h-full flex-col safe-area-inset">
      <TopBar compact={isPhone} />
      <div className="flex flex-1 overflow-hidden">
        {!isPhone && <NavigationRail />}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
      {isPhone && <BottomTabBar />}
    </div>
  )
}
