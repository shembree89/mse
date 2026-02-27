import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid } from 'uuid'
import { db } from '../database.ts'
import type { Card } from '../../types/card.ts'
import { createDefaultCard } from '../../types/card.ts'

export function useCards(setId: string | null) {
  return (
    useLiveQuery(
      () =>
        setId
          ? db.cards.where('[setId+sortOrder]').between([setId, Dexie.minKey], [setId, Dexie.maxKey]).toArray()
          : [],
      [setId],
    ) ?? []
  )
}

// Need to import Dexie for minKey/maxKey
import Dexie from 'dexie'

export function useCard(id: string | null) {
  return useLiveQuery(() => (id ? db.cards.get(id) : undefined), [id])
}

export async function createCard(setId: string): Promise<string> {
  const id = uuid()
  const count = await db.cards.where('setId').equals(setId).count()
  const card: Card = { ...createDefaultCard(setId, count), id }
  await db.cards.add(card)
  await db.sets.update(setId, { cardCount: count + 1, updatedAt: Date.now() })
  return id
}

export async function updateCard(id: string, changes: Partial<Card>) {
  await db.cards.update(id, { ...changes, updatedAt: Date.now() })
}

export async function deleteCard(id: string) {
  const card = await db.cards.get(id)
  if (!card) return
  if (card.artworkImageId) {
    await db.images.delete(card.artworkImageId)
  }
  await db.cards.delete(id)
  const count = await db.cards.where('setId').equals(card.setId).count()
  await db.sets.update(card.setId, { cardCount: count, updatedAt: Date.now() })
}

export async function duplicateCard(id: string): Promise<string> {
  const card = await db.cards.get(id)
  if (!card) throw new Error('Card not found')
  const newId = uuid()
  const count = await db.cards.where('setId').equals(card.setId).count()
  const now = Date.now()
  await db.cards.add({
    ...card,
    id: newId,
    sortOrder: count,
    createdAt: now,
    updatedAt: now,
  })
  await db.sets.update(card.setId, { cardCount: count + 1, updatedAt: Date.now() })
  return newId
}
