export interface TemplateDefinition {
  id: string
  name: string
  gameId: string
  version: string
  canvas: {
    width: number
    height: number
    dpi: number
    cornerRadius: number
  }
  fields: TemplateField[]
  frameRules: FrameRule[]
  layers: LayerDefinition[]
  textDefaults: {
    titleFont: string
    bodyFont: string
    bodyFontItalic: string
    symbolFont: string
  }
}

export interface TemplateField {
  id: string
  type: 'text' | 'richtext' | 'image' | 'choice' | 'symbol' | 'computed'
  label: string
  required: boolean
  defaultValue: string
  choices?: { value: string; label: string }[]
  computeExpression?: string
}

export interface FrameRule {
  condition: FrameCondition
  frameAsset: string
  ptBoxAsset?: string
  typeBarAsset?: string
  priority: number
}

export interface FrameCondition {
  type:
    | 'colorCount'
    | 'colorExact'
    | 'cardType'
    | 'isLand'
    | 'isArtifact'
    | 'isColorless'
    | 'custom'
  colors?: string[]
  colorCount?: number
  cardTypes?: string[]
  operator?: 'and' | 'or'
}

export interface LayerDefinition {
  id: string
  type: 'frame' | 'artwork' | 'text' | 'symbol' | 'shape' | 'group'
  zIndex: number
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  frameRole?: 'background' | 'ptBox' | 'typeBar' | 'border'
  textConfig?: TextConfig
  artworkConfig?: ArtworkConfig
  symbolConfig?: SymbolConfig
}

export interface TextConfig {
  fieldId: string
  fontFamily: string
  fontSize: number
  fontColor: string
  align: 'left' | 'center' | 'right'
  verticalAlign: 'top' | 'middle' | 'bottom'
  lineHeight: number
  autoShrink: boolean
  minFontSize: number
  allowManaSymbols: boolean
  allowItalic: boolean
  maxLines?: number
  padding: { top: number; right: number; bottom: number; left: number }
}

export interface ArtworkConfig {
  clipPath: 'rect' | 'roundedRect' | 'custom'
  clipRadius?: number
  defaultScale: number
  allowReposition: boolean
}

export interface SymbolConfig {
  symbolType: 'manaCost' | 'setSymbol' | 'rarity'
  symbolSize: number
  spacing: number
  alignment: 'left' | 'right'
  fieldId: string
}
