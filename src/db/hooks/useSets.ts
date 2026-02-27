import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid } from 'uuid'
import { db } from '../database.ts'
import type { CardSet } from '../../types/set.ts'
import { createDefaultSet } from '../../types/set.ts'

export function useSets() {
  const sets = useLiveQuery(() => db.sets.orderBy('updatedAt').reverse().toArray())
  return sets ?? []
}

export function useSet(id: string | null) {
  return useLiveQuery(() => (id ? db.sets.get(id) : undefined), [id])
}

export async function createSet(overrides?: Partial<CardSet>): Promise<string> {
  const id = uuid()
  const set: CardSet = { ...createDefaultSet(), ...overrides, id }
  await db.sets.add(set)
  return id
}

export async function updateSet(id: string, changes: Partial<CardSet>) {
  await db.sets.update(id, { ...changes, updatedAt: Date.now() })
}

export async function deleteSet(id: string) {
  await db.transaction('rw', [db.sets, db.cards, db.images], async () => {
    const cards = await db.cards.where('setId').equals(id).toArray()
    const imageIds = cards
      .map((c) => c.artworkImageId)
      .filter((id): id is string => id !== null)
    await db.images.bulkDelete(imageIds)
    await db.cards.where('setId').equals(id).delete()
    await db.sets.delete(id)
  })
}
