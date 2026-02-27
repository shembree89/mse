import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCards, createCard } from '../../db/hooks/useCards.ts'
import { useSet } from '../../db/hooks/useSets.ts'
import { useAppStore } from '../../stores/appStore.ts'

export function CardListPage() {
  const { setId } = useParams<{ setId: string }>()
  const navigate = useNavigate()
  const set = useSet(setId ?? null)
  const cards = useCards(setId ?? null)
  const setCurrentSet = useAppStore((s) => s.setCurrentSet)
  const setCurrentCard = useAppStore((s) => s.setCurrentCard)

  useEffect(() => {
    if (setId) setCurrentSet(setId)
  }, [setId, setCurrentSet])

  async function handleAddCard() {
    if (!setId) return
    const cardId = await createCard(setId)
    setCurrentCard(cardId)
    navigate(`/sets/${setId}/cards/${cardId}`)
  }

  function handleOpenCard(cardId: string) {
    setCurrentCard(cardId)
    navigate(`/sets/${setId}/cards/${cardId}`)
  }

  if (!setId) return null

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">{set?.name ?? 'Cards'}</h1>
          <p className="text-sm text-text-muted">{cards.length} card{cards.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={handleAddCard}
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-surface-0 transition-colors hover:bg-accent-hover min-h-[44px]"
        >
          + Add Card
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-text-muted">
          <p>No cards in this set yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1 overflow-y-auto">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleOpenCard(card.id)}
              className="flex items-center gap-4 rounded-lg px-4 py-3 text-left transition-colors hover:bg-surface-2 min-h-[56px]"
            >
              <div className="flex h-10 w-7 items-center justify-center rounded bg-surface-3 text-xs text-text-muted">
                🃏
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {card.name || 'Untitled Card'}
                </p>
                <p className="text-xs text-text-muted">
                  {card.typeLine}
                  {card.subtypeLine ? ` — ${card.subtypeLine}` : ''}
                  {card.manaCost ? ` • ${card.manaCost}` : ''}
                </p>
              </div>
              <span
                className={`text-xs font-medium ${
                  card.rarity === 'mythic'
                    ? 'text-red-400'
                    : card.rarity === 'rare'
                      ? 'text-yellow-400'
                      : card.rarity === 'uncommon'
                        ? 'text-slate-300'
                        : 'text-text-muted'
                }`}
              >
                {card.rarity.charAt(0).toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
