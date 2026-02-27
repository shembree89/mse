import type { Keyword } from '../../types/keyword.ts'

type KeywordSeed = Omit<Keyword, 'id'>

export const deciduousKeywords: KeywordSeed[] = [
  {
    setId: null, name: 'Cycling', match: '\\bCycling\\b',
    reminderText: '({cost}, Discard this card: Draw a card.)',
    parameters: [{ name: 'cost', placeholder: '{cost}', type: 'cost' }],
    isEvergreen: false, isCustom: false, sortOrder: 100,
  },
  {
    setId: null, name: 'Kicker', match: '\\bKicker\\b',
    reminderText: '(You may pay an additional {cost} as you cast this spell.)',
    parameters: [{ name: 'cost', placeholder: '{cost}', type: 'cost' }],
    isEvergreen: false, isCustom: false, sortOrder: 101,
  },
  {
    setId: null, name: 'Flashback', match: '\\bFlashback\\b',
    reminderText: '(You may cast this card from your graveyard for its flashback cost. Then exile it.)',
    parameters: [{ name: 'cost', placeholder: '{cost}', type: 'cost' }],
    isEvergreen: false, isCustom: false, sortOrder: 102,
  },
  {
    setId: null, name: 'Landfall', match: '\\bLandfall\\b',
    reminderText: '',
    parameters: [], isEvergreen: false, isCustom: false, sortOrder: 103,
  },
  {
    setId: null, name: 'Cascade', match: '\\bCascade\\b',
    reminderText: '(When you cast this spell, exile cards from the top of your library until you exile a nonland card that costs less. You may cast it without paying its mana cost. Put the exiled cards on the bottom in a random order.)',
    parameters: [], isEvergreen: false, isCustom: false, sortOrder: 104,
  },
  {
    setId: null, name: 'Convoke', match: '\\bConvoke\\b',
    reminderText: '(Your creatures can help cast this spell. Each creature you tap while casting this spell pays for {1} or one mana of that creature\'s color.)',
    parameters: [], isEvergreen: false, isCustom: false, sortOrder: 105,
  },
  {
    setId: null, name: 'Devour', match: '\\bDevour\\b',
    reminderText: '(As this enters, you may sacrifice any number of creatures. This creature enters with {number} +1/+1 counter on it for each creature sacrificed.)',
    parameters: [{ name: 'number', placeholder: '{number}', type: 'number' }],
    isEvergreen: false, isCustom: false, sortOrder: 106,
  },
  {
    setId: null, name: 'Entwine', match: '\\bEntwine\\b',
    reminderText: '(Choose both if you pay the entwine cost.)',
    parameters: [{ name: 'cost', placeholder: '{cost}', type: 'cost' }],
    isEvergreen: false, isCustom: false, sortOrder: 107,
  },
  {
    setId: null, name: 'Exalted', match: '\\bExalted\\b',
    reminderText: '(Whenever a creature you control attacks alone, that creature gets +1/+1 until end of turn.)',
    parameters: [], isEvergreen: false, isCustom: false, sortOrder: 108,
  },
  {
    setId: null, name: 'Exploit', match: '\\bExploit\\b',
    reminderText: '(When this creature enters, you may sacrifice a creature.)',
    parameters: [], isEvergreen: false, isCustom: false, sortOrder: 109,
  },
  {
    setId: null, name: 'Fabricate', match: '\\bFabricate\\b',
    reminderText: '(When this creature enters, put {number} +1/+1 counter(s) on it or create {number} 1/1 colorless Servo artifact creature token(s).)',
    parameters: [{ name: 'number', placeholder: '{number}', type: 'number' }],
    isEvergreen: false, isCustom: false, sortOrder: 110,
  },
  {
    setId: null, name: 'Madness', match: '\\bMadness\\b',
    reminderText: '(If you discard this card, discard it into exile. When you do, cast it for its madness cost or put it into your graveyard.)',
    parameters: [{ name: 'cost', placeholder: '{cost}', type: 'cost' }],
    isEvergreen: false, isCustom: false, sortOrder: 111,
  },
  {
    setId: null, name: 'Morph', match: '\\bMorph\\b',
    reminderText: '(You may cast this card face down as a 2/2 creature for {3}. Turn it face up any time for its morph cost.)',
    parameters: [{ name: 'cost', placeholder: '{cost}', type: 'cost' }],
    isEvergreen: false, isCustom: false, sortOrder: 112,
  },
  {
    setId: null, name: 'Prowess', match: '\\bProwess\\b',
    reminderText: '(Whenever you cast a noncreature spell, this creature gets +1/+1 until end of turn.)',
    parameters: [], isEvergreen: false, isCustom: false, sortOrder: 113,
  },
  {
    setId: null, name: 'Scry', match: '\\bScry\\b',
    reminderText: '(Look at the top {number} card(s) of your library, then put any number of them on the bottom and the rest on top in any order.)',
    parameters: [{ name: 'number', placeholder: '{number}', type: 'number' }],
    isEvergreen: false, isCustom: false, sortOrder: 114,
  },
  {
    setId: null, name: 'Shroud', match: '\\bShroud\\b',
    reminderText: '(This creature can\'t be the target of spells or abilities.)',
    parameters: [], isEvergreen: false, isCustom: false, sortOrder: 115,
  },
  {
    setId: null, name: 'Suspend', match: '\\bSuspend\\b',
    reminderText: '(Rather than cast this card from your hand, you may pay {cost} and exile it with {number} time counter(s) on it. At the beginning of your upkeep, remove a time counter. When the last is removed, cast it without paying its mana cost.)',
    parameters: [
      { name: 'number', placeholder: '{number}', type: 'number' },
      { name: 'cost', placeholder: '{cost}', type: 'cost' },
    ],
    isEvergreen: false, isCustom: false, sortOrder: 116,
  },
  {
    setId: null, name: 'Undying', match: '\\bUndying\\b',
    reminderText: '(When this creature dies, if it had no +1/+1 counters on it, return it to the battlefield under its owner\'s control with a +1/+1 counter on it.)',
    parameters: [], isEvergreen: false, isCustom: false, sortOrder: 117,
  },
  {
    setId: null, name: 'Persist', match: '\\bPersist\\b',
    reminderText: '(When this creature dies, if it had no -1/-1 counters on it, return it to the battlefield under its owner\'s control with a -1/-1 counter on it.)',
    parameters: [], isEvergreen: false, isCustom: false, sortOrder: 118,
  },
  {
    setId: null, name: 'Wither', match: '\\bWither\\b',
    reminderText: '(This deals damage to creatures in the form of -1/-1 counters.)',
    parameters: [], isEvergreen: false, isCustom: false, sortOrder: 119,
  },
]
