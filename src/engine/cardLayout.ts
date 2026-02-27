// Shared card layout constants matching the M15 template.
// Based on Card Conjurer's 1500x2100 canvas, scaled to 750x1050 (×0.5).

export const CARD_WIDTH = 750
export const CARD_HEIGHT = 1050

// Card border
export const BORDER_RADIUS = 30

// Art box — where the illustration goes
export const ART_BOX = { x: 57, y: 119, width: 635, height: 465 }

// Name bar / card title
export const NAME_TEXT = { x: 63, y: 94, width: 624, height: 40, fontSize: 38 }

// Mana cost symbols (positioned from right edge, drawn right-to-left)
export const MANA_SYMBOL = {
  size: 35,
  spacing: 4,
  y: 43,           // top of first symbol
  rightEdge: 658,  // x-center of rightmost symbol
  step: 39,        // each subsequent symbol shifts left by this
}

// Type line bar
export const TYPE_TEXT = { x: 63, y: 632, width: 624, height: 34, fontSize: 32 }

// Set/rarity symbol (right side of type bar)
export const RARITY_SYMBOL = { x: 691, y: 621, size: 36 }

// Text box (rules + flavor)
export const TEXT_BOX = { x: 68, y: 685, width: 615, radius: 5 }
export const TEXT_BOX_HEIGHT_WITH_PT = 290
export const TEXT_BOX_HEIGHT_NO_PT = 310

// Rules text
export const RULES_TEXT = { x: 78, y: 695, width: 595, height: 280, fontSize: 28 }

// Flavor text
export const FLAVOR_SEPARATOR_Y = 905
export const FLAVOR_TEXT = { x: 78, width: 595, height: 80, fontSize: 26 }
export const FLAVOR_Y_WITH_RULES = 915
export const FLAVOR_Y_WITHOUT_RULES = 695

// Power/Toughness box
export const PT_BOX = {
  x: 568,
  y: 929,
  width: 141,
  height: 77,
  radius: 8,
  // PT text is offset within the box image
  textX: 596,
  textY: 940,
  textWidth: 103,
  textHeight: 52,
  fontSize: 36,
}

// Bottom info / collector bar
export const INFO_BAR = { x: 49, y: 995, width: 653, fontSize: 15 }
