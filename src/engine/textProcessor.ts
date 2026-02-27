import type { Keyword } from '../types/keyword.ts'
import { expandKeywords } from './keywordEngine.ts'

export interface TextSegment {
  type: 'text' | 'mana' | 'italic' | 'bold' | 'newline'
  content: string
}

/**
 * Process raw rules text through the full pipeline:
 * 1. Keyword expansion (with reminder text)
 * 2. CARDNAME substitution
 * 3. Mana symbol detection
 * 4. Italic detection (parenthetical reminder text)
 */
export function processRulesText(
  rawText: string,
  cardName: string,
  keywords: Keyword[],
  expandReminders: boolean = true,
): TextSegment[] {
  if (!rawText) return []

  let text = rawText

  // 1. Keyword expansion
  if (expandReminders) {
    text = expandKeywords(text, keywords)
  }

  // 2. CARDNAME substitution
  if (cardName) {
    text = text.replace(/CARDNAME/g, cardName)
    text = text.replace(/~/g, cardName)
  }

  // 3. Parse into segments
  return parseSegments(text)
}

const SEGMENT_PATTERN = /(\{[^}]+\})|(\([^)]*\))|(\n)/g

function parseSegments(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let lastIndex = 0

  SEGMENT_PATTERN.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = SEGMENT_PATTERN.exec(text)) !== null) {
    // Text before this match
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }

    if (match[1]) {
      // Mana symbol: {W}, {2}, etc.
      segments.push({ type: 'mana', content: match[1].slice(1, -1) })
    } else if (match[2]) {
      // Parenthetical reminder text -> italic
      segments.push({ type: 'italic', content: match[2] })
    } else if (match[3]) {
      // Newline
      segments.push({ type: 'newline', content: '\n' })
    }

    lastIndex = match.index + match[0].length
  }

  // Remaining text after last match
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return segments
}

/**
 * Convert segments back to plain text (for display in simple text contexts)
 */
export function segmentsToPlainText(segments: TextSegment[]): string {
  return segments
    .map((s) => {
      if (s.type === 'mana') return `{${s.content}}`
      return s.content
    })
    .join('')
}
