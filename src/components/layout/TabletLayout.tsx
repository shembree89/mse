import { type ReactNode, useRef, useCallback } from 'react'
import { useAppStore } from '../../stores/appStore.ts'

interface TabletLayoutProps {
  preview: ReactNode
  panel: ReactNode
}

export function TabletLayout({ preview, panel }: TabletLayoutProps) {
  const panelWidth = useAppStore((s) => s.editorPanelWidth)
  const setPanelWidth = useAppStore((s) => s.setEditorPanelWidth)
  const dividerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      const container = dividerRef.current?.parentElement
      if (!container) return
      const rect = container.getBoundingClientRect()
      const newWidth = rect.right - e.clientX
      setPanelWidth(Math.max(280, Math.min(600, newWidth)))
    },
    [setPanelWidth],
  )

  const handlePointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-hidden">{preview}</div>
      <div
        ref={dividerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-1.5 shrink-0 cursor-col-resize bg-border transition-colors hover:bg-accent/50 active:bg-accent"
      />
      <div
        style={{ width: panelWidth }}
        className="shrink-0 overflow-y-auto overflow-x-hidden bg-surface-1"
      >
        {panel}
      </div>
    </div>
  )
}
