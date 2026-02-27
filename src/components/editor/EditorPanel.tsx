import { useAtom } from 'jotai'
import {
  cardNameAtom,
  manaCostAtom,
  typeLineAtom,
  subtypeLineAtom,
  rulesTextAtom,
  flavorTextAtom,
  powerAtom,
  toughnessAtom,
  rarityAtom,
  artistAtom,
} from '../../stores/editorAtoms.ts'
import type { Rarity } from '../../types/enums.ts'
import { ManaKeyboard } from './ManaKeyboard.tsx'
import { ArtworkUploader } from './ArtworkUploader.tsx'

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
}) {
  const inputClass =
    'w-full rounded bg-surface-2 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted border border-border focus:border-accent focus:outline-none min-h-[44px]'

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-text-secondary">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  )
}

export function EditorPanel() {
  const [cardName, setCardName] = useAtom(cardNameAtom)
  const [manaCost, setManaCost] = useAtom(manaCostAtom)
  const [typeLine, setTypeLine] = useAtom(typeLineAtom)
  const [subtypeLine, setSubtypeLine] = useAtom(subtypeLineAtom)
  const [rulesText, setRulesText] = useAtom(rulesTextAtom)
  const [flavorText, setFlavorText] = useAtom(flavorTextAtom)
  const [power, setPower] = useAtom(powerAtom)
  const [toughness, setToughness] = useAtom(toughnessAtom)
  const [rarity, setRarity] = useAtom(rarityAtom)
  const [artist, setArtist] = useAtom(artistAtom)

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
        Card Editor
      </h2>

      <FieldInput label="Card Name" value={cardName} onChange={setCardName} placeholder="Enter card name" />

      <FieldInput
        label="Mana Cost"
        value={manaCost}
        onChange={setManaCost}
        placeholder="{2}{W}{U}"
      />

      <div className="grid grid-cols-2 gap-3">
        <FieldInput label="Type" value={typeLine} onChange={setTypeLine} placeholder="Creature" />
        <FieldInput label="Subtype" value={subtypeLine} onChange={setSubtypeLine} placeholder="Human Wizard" />
      </div>

      <FieldInput
        label="Rules Text"
        value={rulesText}
        onChange={setRulesText}
        placeholder="Card abilities..."
        multiline
      />

      <FieldInput
        label="Flavor Text"
        value={flavorText}
        onChange={setFlavorText}
        placeholder="Italic flavor text..."
        multiline
      />

      <div className="grid grid-cols-2 gap-3">
        <FieldInput label="Power" value={power} onChange={setPower} placeholder="0" />
        <FieldInput label="Toughness" value={toughness} onChange={setToughness} placeholder="0" />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-text-secondary">Rarity</label>
        <div className="grid grid-cols-4 gap-1">
          {(['common', 'uncommon', 'rare', 'mythic'] as Rarity[]).map((r) => (
            <button
              key={r}
              onClick={() => setRarity(r)}
              className={`rounded px-2 py-2 text-xs font-medium transition-colors min-h-[44px] ${
                rarity === r
                  ? r === 'mythic'
                    ? 'bg-red-900/40 text-red-300 border border-red-700'
                    : r === 'rare'
                      ? 'bg-yellow-900/40 text-yellow-300 border border-yellow-700'
                      : r === 'uncommon'
                        ? 'bg-slate-700/40 text-slate-300 border border-slate-500'
                        : 'bg-surface-3 text-text-primary border border-border'
                  : 'bg-surface-2 text-text-secondary border border-transparent hover:bg-surface-3'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <ArtworkUploader />

      <FieldInput label="Artist" value={artist} onChange={setArtist} placeholder="Artist name" />

      <ManaKeyboard />
    </div>
  )
}
