export interface KeywordParameter {
  name: string
  placeholder: string
  type: 'cost' | 'quality' | 'number' | 'type'
}

export interface Keyword {
  id: string
  setId: string | null
  name: string
  match: string
  reminderText: string
  parameters: KeywordParameter[]
  isEvergreen: boolean
  isCustom: boolean
  sortOrder: number
}
