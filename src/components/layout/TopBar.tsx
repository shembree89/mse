import { useState } from 'react'
import { useAppStore } from '../../stores/appStore.ts'
import { useSet } from '../../db/hooks/useSets.ts'
import { SetEditDialog } from '../setmanager/SetEditDialog.tsx'

interface TopBarProps {
  compact?: boolean
}

export function TopBar({ compact }: TopBarProps) {
  const currentSetId = useAppStore((s) => s.currentSetId)
  const set = useSet(currentSetId)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <>
      <header
        className={`flex shrink-0 items-center justify-between border-b border-border bg-surface-1 px-4 ${
          compact ? 'h-10' : 'h-12'
        }`}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold tracking-wide text-accent">MSE</h1>
          {set && (
            <>
              <span className="text-text-muted">/</span>
              <button
                onClick={() => setEditDialogOpen(true)}
                className="text-sm text-text-primary hover:text-accent transition-colors"
              >
                {set.name}
              </button>
              {!compact && (
                <span className="rounded bg-surface-3 px-1.5 py-0.5 text-xs text-text-secondary">
                  {set.code}
                </span>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {set && (
            <button
              onClick={() => useAppStore.getState().setExportDialogOpen(true)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-2 hover:text-text-primary min-h-[36px]"
            >
              Export
            </button>
          )}
        </div>
      </header>
      {set && editDialogOpen && (
        <SetEditDialog setId={set.id} onClose={() => setEditDialogOpen(false)} />
      )}
    </>
  )
}
