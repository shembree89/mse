import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useCards } from '../../db/hooks/useCards.ts'
import { useSet } from '../../db/hooks/useSets.ts'
import { useAppStore } from '../../stores/appStore.ts'
import { useEffect } from 'react'

const COLOR_MAP: Record<string, string> = {
  W: '#f9faf4',
  U: '#0e68ab',
  B: '#2a2020',
  R: '#d3202a',
  G: '#00733e',
  Multicolor: '#c9a43d',
  Colorless: '#9ba0a8',
}

const RARITY_COLORS: Record<string, string> = {
  common: '#666',
  uncommon: '#aac',
  rare: '#da4',
  mythic: '#d44',
}

export function StatsPanel() {
  const { setId } = useParams<{ setId: string }>()
  const set = useSet(setId ?? null)
  const cards = useCards(setId ?? null)
  const setCurrentSet = useAppStore((s) => s.setCurrentSet)

  useEffect(() => {
    if (setId) setCurrentSet(setId)
  }, [setId, setCurrentSet])

  const colorData = useMemo(() => {
    const counts: Record<string, number> = { W: 0, U: 0, B: 0, R: 0, G: 0, Multicolor: 0, Colorless: 0 }
    for (const card of cards) {
      if (card.colors.length === 0) counts.Colorless++
      else if (card.colors.length > 1) counts.Multicolor++
      else counts[card.colors[0]]++
    }
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name, value }))
  }, [cards])

  const rarityData = useMemo(() => {
    const counts: Record<string, number> = { common: 0, uncommon: 0, rare: 0, mythic: 0 }
    for (const card of cards) counts[card.rarity]++
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value, key: name }))
  }, [cards])

  const cmcData = useMemo(() => {
    const counts: Record<number, number> = {}
    for (const card of cards) {
      const cmc = card.cmc
      counts[cmc] = (counts[cmc] || 0) + 1
    }
    const maxCmc = Math.max(0, ...Object.keys(counts).map(Number))
    return Array.from({ length: maxCmc + 1 }, (_, i) => ({
      cmc: i.toString(),
      count: counts[i] || 0,
    }))
  }, [cards])

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const card of cards) {
      for (const t of card.types) {
        counts[t] = (counts[t] || 0) + 1
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }))
  }, [cards])

  if (!setId) return null

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">{set?.name ?? 'Set'} Statistics</h1>
        <p className="text-sm text-text-muted">{cards.length} cards</p>
      </div>

      {cards.length === 0 ? (
        <p className="text-text-muted">Add some cards to see statistics.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Color Distribution */}
            <div className="rounded-lg border border-border bg-surface-1 p-4">
              <h3 className="mb-3 text-sm font-semibold text-text-secondary">Color Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={colorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {colorData.map((entry) => (
                      <Cell key={entry.name} fill={COLOR_MAP[entry.name] ?? '#888'} stroke="#333" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Mana Curve */}
            <div className="rounded-lg border border-border bg-surface-1 p-4">
              <h3 className="mb-3 text-sm font-semibold text-text-secondary">Mana Curve</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cmcData}>
                  <XAxis dataKey="cmc" stroke="#727169" fontSize={12} />
                  <YAxis stroke="#727169" fontSize={12} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#7e9cd8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rarity Breakdown */}
            <div className="rounded-lg border border-border bg-surface-1 p-4">
              <h3 className="mb-3 text-sm font-semibold text-text-secondary">Rarity Breakdown</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={rarityData} layout="vertical">
                  <XAxis type="number" stroke="#727169" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#727169" fontSize={12} width={80} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {rarityData.map((entry) => (
                      <Cell key={entry.key} fill={RARITY_COLORS[entry.key] ?? '#888'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Type Breakdown */}
            <div className="rounded-lg border border-border bg-surface-1 p-4">
              <h3 className="mb-3 text-sm font-semibold text-text-secondary">Card Types</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={typeData} layout="vertical">
                  <XAxis type="number" stroke="#727169" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="#727169" fontSize={12} width={100} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#98bb6c" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
