import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSets, createSet, deleteSet } from '../../db/hooks/useSets.ts'
import { createCard } from '../../db/hooks/useCards.ts'
import { useAppStore } from '../../stores/appStore.ts'
import { SetEditDialog } from './SetEditDialog.tsx'
import { SetSymbol } from './SetSymbol.tsx'

export function SetManager() {
  const sets = useSets()
  const navigate = useNavigate()
  const setCurrentSet = useAppStore((s) => s.setCurrentSet)
  const setCurrentCard = useAppStore((s) => s.setCurrentCard)
  const [editingSetId, setEditingSetId] = useState<string | null>(null)

  async function handleCreateSet() {
    const setId = await createSet()
    const cardId = await createCard(setId)
    setCurrentSet(setId)
    setCurrentCard(cardId)
    navigate(`/sets/${setId}/cards/${cardId}`)
  }

  function handleOpenSet(setId: string) {
    setCurrentSet(setId)
    navigate(`/sets/${setId}/cards`)
  }

  async function handleDeleteSet(e: React.MouseEvent, setId: string) {
    e.stopPropagation()
    if (!confirm('Delete this set and all its cards?')) return
    await deleteSet(setId)
  }

  function handleEditSet(e: React.MouseEvent, setId: string) {
    e.stopPropagation()
    setEditingSetId(setId)
  }

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Your Sets</h1>
        <button
          onClick={handleCreateSet}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-surface-0 transition-colors hover:bg-accent-hover min-h-[44px]"
        >
          + New Set
        </button>
      </div>

      {sets.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-text-muted">
          <span className="text-5xl">🃏</span>
          <p className="text-lg">No sets yet</p>
          <p className="text-sm">Create your first card set to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sets.map((set) => (
            <button
              key={set.id}
              onClick={() => handleOpenSet(set.id)}
              className="group flex flex-col gap-2 rounded-lg border border-border bg-surface-1 p-4 text-left transition-colors hover:border-accent/50 hover:bg-surface-2 min-h-[88px]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SetSymbol imageId={set.symbolImageId} size={20} />
                  <span className="text-base font-medium text-text-primary">{set.name}</span>
                </div>
                <span className="rounded bg-surface-3 px-1.5 py-0.5 text-xs text-text-secondary">
                  {set.code}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>{set.cardCount} card{set.cardCount !== 1 ? 's' : ''}</span>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => handleEditSet(e, set.id)}
                    className="rounded px-2 py-1 text-text-secondary hover:bg-surface-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteSet(e, set.id)}
                    className="rounded px-2 py-1 text-danger hover:bg-danger/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {editingSetId && (
        <SetEditDialog setId={editingSetId} onClose={() => setEditingSetId(null)} />
      )}
    </div>
  )
}
