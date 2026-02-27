import { useAtom } from 'jotai'
import { manaCostAtom } from '../../stores/editorAtoms.ts'
import { getSymbolPath } from '../../engine/manaSymbolLoader.ts'

const MANA_BUTTONS = [
  { label: '0', value: '{0}', key: '0', color: '#888' },
  { label: '1', value: '{1}', key: '1', color: '#888' },
  { label: '2', value: '{2}', key: '2', color: '#888' },
  { label: '3', value: '{3}', key: '3', color: '#888' },
  { label: '4', value: '{4}', key: '4', color: '#888' },
  { label: '5', value: '{5}', key: '5', color: '#888' },
  { label: '6', value: '{6}', key: '6', color: '#888' },
  { label: '7', value: '{7}', key: '7', color: '#888' },
  { label: 'X', value: '{X}', key: 'x', color: '#888' },
  { label: 'W', value: '{W}', key: 'w', color: '#f9faf4', textColor: '#333' },
  { label: 'U', value: '{U}', key: 'u', color: '#0e68ab', textColor: '#fff' },
  { label: 'B', value: '{B}', key: 'b', color: '#150b00', textColor: '#ccc' },
  { label: 'R', value: '{R}', key: 'r', color: '#d3202a', textColor: '#fff' },
  { label: 'G', value: '{G}', key: 'g', color: '#00733e', textColor: '#fff' },
  { label: 'C', value: '{C}', key: 'c', color: '#ccc2c0', textColor: '#333' },
  { label: 'S', value: '{S}', key: 's', color: '#8ad' },
  { label: 'T', value: '{T}', key: 't', color: '#666' },
]

export function ManaKeyboard() {
  const [manaCost, setManaCost] = useAtom(manaCostAtom)

  function addSymbol(value: string) {
    setManaCost(manaCost + value)
  }

  function backspace() {
    // Remove last {X} token
    const lastBrace = manaCost.lastIndexOf('{')
    if (lastBrace >= 0) {
      setManaCost(manaCost.slice(0, lastBrace))
    } else {
      setManaCost(manaCost.slice(0, -1))
    }
  }

  function clear() {
    setManaCost('')
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-text-secondary">Mana Symbols</label>
        <div className="flex gap-1">
          <button
            onClick={backspace}
            className="rounded bg-surface-3 px-2 py-1 text-xs text-text-secondary hover:bg-surface-2 min-h-[32px]"
          >
            Backspace
          </button>
          <button
            onClick={clear}
            className="rounded bg-surface-3 px-2 py-1 text-xs text-danger hover:bg-surface-2 min-h-[32px]"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-1">
        {MANA_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            onClick={() => addSymbol(btn.value)}
            className="flex h-11 w-full items-center justify-center rounded transition-transform active:scale-95 bg-surface-2 hover:bg-surface-3"
          >
            <img
              src={getSymbolPath(btn.key)}
              alt={btn.label}
              className="h-8 w-8"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
