import type { Keyword } from '../../types/keyword.ts'

// Partial keyword records — id is assigned at seed time
type KeywordSeed = Omit<Keyword, 'id'>

export const evergreenKeywords: KeywordSeed[] = [
  {
    setId: null, name: 'Deathtouch', match: '\\bDeathtouch\\b',
    reminderText: '(Any amount of damage this deals to a creature is enough to destroy it.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 0,
  },
  {
    setId: null, name: 'Defender', match: '\\bDefender\\b',
    reminderText: '(This creature can\'t attack.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 1,
  },
  {
    setId: null, name: 'Double strike', match: '\\bDouble strike\\b',
    reminderText: '(This creature deals both first-strike and regular combat damage.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 2,
  },
  {
    setId: null, name: 'Enchant', match: '\\bEnchant\\b',
    reminderText: '',
    parameters: [{ name: 'quality', placeholder: '{quality}', type: 'quality' }],
    isEvergreen: true, isCustom: false, sortOrder: 3,
  },
  {
    setId: null, name: 'Equip', match: '\\bEquip\\b',
    reminderText: '({cost}: Attach to target creature you control. Equip only as a sorcery.)',
    parameters: [{ name: 'cost', placeholder: '{cost}', type: 'cost' }],
    isEvergreen: true, isCustom: false, sortOrder: 4,
  },
  {
    setId: null, name: 'First strike', match: '\\bFirst strike\\b',
    reminderText: '(This creature deals combat damage before creatures without first strike.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 5,
  },
  {
    setId: null, name: 'Flash', match: '\\bFlash\\b',
    reminderText: '(You may cast this spell any time you could cast an instant.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 6,
  },
  {
    setId: null, name: 'Flying', match: '\\bFlying\\b',
    reminderText: '(This creature can\'t be blocked except by creatures with flying or reach.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 7,
  },
  {
    setId: null, name: 'Haste', match: '\\bHaste\\b',
    reminderText: '(This creature can attack and {T} as soon as it comes under your control.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 8,
  },
  {
    setId: null, name: 'Hexproof', match: '\\bHexproof\\b',
    reminderText: '(This creature can\'t be the target of spells or abilities your opponents control.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 9,
  },
  {
    setId: null, name: 'Indestructible', match: '\\bIndestructible\\b',
    reminderText: '(Damage and effects that say "destroy" don\'t destroy this.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 10,
  },
  {
    setId: null, name: 'Lifelink', match: '\\bLifelink\\b',
    reminderText: '(Damage dealt by this creature also causes you to gain that much life.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 11,
  },
  {
    setId: null, name: 'Menace', match: '\\bMenace\\b',
    reminderText: '(This creature can\'t be blocked except by two or more creatures.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 12,
  },
  {
    setId: null, name: 'Protection', match: '\\bProtection from\\b',
    reminderText: '(This creature can\'t be blocked, targeted, dealt damage, enchanted, or equipped by anything {quality}.)',
    parameters: [{ name: 'quality', placeholder: '{quality}', type: 'quality' }],
    isEvergreen: true, isCustom: false, sortOrder: 13,
  },
  {
    setId: null, name: 'Reach', match: '\\bReach\\b',
    reminderText: '(This creature can block creatures with flying.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 14,
  },
  {
    setId: null, name: 'Trample', match: '\\bTrample\\b',
    reminderText: '(This creature can deal excess combat damage to the player or planeswalker it\'s attacking.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 15,
  },
  {
    setId: null, name: 'Vigilance', match: '\\bVigilance\\b',
    reminderText: '(Attacking doesn\'t cause this creature to tap.)',
    parameters: [], isEvergreen: true, isCustom: false, sortOrder: 16,
  },
  {
    setId: null, name: 'Ward', match: '\\bWard\\b',
    reminderText: '(Whenever this creature becomes the target of a spell or ability an opponent controls, counter it unless that player pays {cost}.)',
    parameters: [{ name: 'cost', placeholder: '{cost}', type: 'cost' }],
    isEvergreen: true, isCustom: false, sortOrder: 17,
  },
]
