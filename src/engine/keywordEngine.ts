import type { Keyword } from '../types/keyword.ts'

export function expandKeywords(text: string, keywords: Keyword[]): string {
  if (!text) return text

  let result = text

  // Sort by name length descending so longer keywords match first
  const sorted = [...keywords].sort((a, b) => b.name.length - a.name.length)

  for (const kw of sorted) {
    if (!kw.reminderText) continue

    const pattern = new RegExp(kw.match, 'gi')
    const alreadyExpanded = new RegExp(
      kw.match + '\\s*\\(' ,
      'gi',
    )

    // Skip if reminder text is already present
    if (alreadyExpanded.test(result)) continue

    result = result.replace(pattern, (match) => {
      return `${match} ${kw.reminderText}`
    })
  }

  return result
}
