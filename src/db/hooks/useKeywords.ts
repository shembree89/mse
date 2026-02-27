import { useLiveQuery } from 'dexie-react-hooks'
import { v4 as uuid } from 'uuid'
import { db } from '../database.ts'
import type { Keyword } from '../../types/keyword.ts'
import { evergreenKeywords } from '../../data/keywords/evergreen.ts'
import { deciduousKeywords } from '../../data/keywords/deciduous.ts'

export function useKeywords(setId: string | null) {
  return (
    useLiveQuery(async () => {
      const global = await db.keywords.where('isEvergreen').equals(1).toArray()
      const deciduous = await db.keywords
        .where('isEvergreen')
        .equals(0)
        .and((k) => k.setId === null)
        .toArray()
      const setSpecific = setId
        ? await db.keywords.where('[setId+name]').between([setId, ''], [setId, '\uffff']).toArray()
        : []
      return [...global, ...deciduous, ...setSpecific]
    }, [setId]) ?? []
  )
}

export async function seedKeywords() {
  const count = await db.keywords.count()
  if (count > 0) return // Already seeded

  const all = [...evergreenKeywords, ...deciduousKeywords]
  const records: Keyword[] = all.map((kw) => ({
    ...kw,
    id: uuid(),
  }))
  await db.keywords.bulkAdd(records)
}

export async function createKeyword(keyword: Omit<Keyword, 'id'>): Promise<string> {
  const id = uuid()
  await db.keywords.add({ ...keyword, id })
  return id
}

export async function updateKeyword(id: string, changes: Partial<Keyword>) {
  await db.keywords.update(id, changes)
}

export async function deleteKeyword(id: string) {
  await db.keywords.delete(id)
}
