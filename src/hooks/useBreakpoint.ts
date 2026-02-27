import { useSyncExternalStore } from 'react'

export type Breakpoint = 'phone' | 'tablet' | 'desktop'

const PHONE_MAX = 768
const TABLET_MAX = 1024

function getBreakpoint(): Breakpoint {
  const w = window.innerWidth
  if (w < PHONE_MAX) return 'phone'
  if (w < TABLET_MAX) return 'tablet'
  return 'desktop'
}

let current = typeof window !== 'undefined' ? getBreakpoint() : ('desktop' as Breakpoint)
const listeners = new Set<() => void>()

if (typeof window !== 'undefined') {
  const phoneQuery = window.matchMedia(`(max-width: ${PHONE_MAX - 1}px)`)
  const tabletQuery = window.matchMedia(`(max-width: ${TABLET_MAX - 1}px)`)

  function update() {
    const next = getBreakpoint()
    if (next !== current) {
      current = next
      listeners.forEach((fn) => fn())
    }
  }

  phoneQuery.addEventListener('change', update)
  tabletQuery.addEventListener('change', update)
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return current
}

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(subscribe, getSnapshot)
}
