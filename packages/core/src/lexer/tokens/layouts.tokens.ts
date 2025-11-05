import { createToken } from 'chevrotain'

// Canonical Layout Tokens
// Preset layouts that cover common UI patterns without modifiers
// Each layout has predefined Tailwind classes and shadcn styling
//
// Categories:
// - Containers: container, container-narrow, container-wide, container-full
// - Stacks: stack, stack-tight, stack-loose, stack-none
// - Rows: row, row-start, row-center, row-between, row-end
// - Grids: grid, grid-2, grid-3, grid-4, grid-responsive
// - Layer / Position: layer-static, layer-relative, layer-absolute, layer-fixed, layer-sticky, layer-overlay
// - Overflow: scroll-auto, scroll-x, scroll-y, scroll-hidden
// - Cards & Special layouts remain available (card, header, sidebar, list, etc.)

// Container Layouts
export const ContainerNarrow = createToken({
  name: 'ContainerNarrow',
  pattern: /container-narrow/,
  label: 'container-narrow',
})

export const ContainerWide = createToken({
  name: 'ContainerWide',
  pattern: /container-wide/,
  label: 'container-wide',
})

export const ContainerFull = createToken({
  name: 'ContainerFull',
  pattern: /container-full/,
  label: 'container-full',
})

export const Container = createToken({
  name: 'Container',
  pattern: /container(?!-)/,
  label: 'container',
})

// Stack Layouts (Vertical)
export const StackTight = createToken({
  name: 'StackTight',
  pattern: /stack-tight/,
  label: 'stack-tight',
})

export const StackLoose = createToken({
  name: 'StackLoose',
  pattern: /stack-loose/,
  label: 'stack-loose',
})

export const StackNone = createToken({
  name: 'StackNone',
  pattern: /(stack-none|stack-flush)/,
  label: 'stack-none',
})

export const Stack = createToken({
  name: 'Stack',
  pattern: /stack(?!-)/,
  label: 'stack',
})

// Row Layouts (Horizontal)
export const RowStart = createToken({
  name: 'RowStart',
  pattern: /row-start/,
  label: 'row-start',
})

export const RowCenter = createToken({
  name: 'RowCenter',
  pattern: /row-center/,
  label: 'row-center',
})

export const RowBetween = createToken({
  name: 'RowBetween',
  pattern: /row-between/,
  label: 'row-between',
})

export const RowEnd = createToken({
  name: 'RowEnd',
  pattern: /row-end/,
  label: 'row-end',
})

export const Row = createToken({
  name: 'Row',
  pattern: /row(?!-)/,
  label: 'row',
})

// Grid Layouts
export const Grid2 = createToken({
  name: 'Grid2',
  pattern: /grid-2/,
  label: 'grid-2',
})

export const Grid3 = createToken({
  name: 'Grid3',
  pattern: /grid-3/,
  label: 'grid-3',
})

export const Grid4 = createToken({
  name: 'Grid4',
  pattern: /grid-4/,
  label: 'grid-4',
})

export const GridResponsive = createToken({
  name: 'GridResponsive',
  pattern: /grid-(responsive|auto)/,
  label: 'grid-responsive',
})

export const Grid = createToken({
  name: 'Grid',
  pattern: /grid(?!-)/,
  label: 'grid',
})

// Layer / Position Layouts
export const LayerStatic = createToken({
  name: 'LayerStatic',
  pattern: /layer-static/,
  label: 'layer-static',
})

export const LayerRelative = createToken({
  name: 'LayerRelative',
  pattern: /layer-relative/,
  label: 'layer-relative',
})

export const LayerAbsolute = createToken({
  name: 'LayerAbsolute',
  pattern: /layer-absolute/,
  label: 'layer-absolute',
})

export const LayerFixed = createToken({
  name: 'LayerFixed',
  pattern: /layer-fixed/,
  label: 'layer-fixed',
})

export const LayerSticky = createToken({
  name: 'LayerSticky',
  pattern: /layer-sticky/,
  label: 'layer-sticky',
})

export const LayerOverlay = createToken({
  name: 'LayerOverlay',
  pattern: /layer-overlay/,
  label: 'layer-overlay',
})

// Overflow Layouts
export const ScrollAuto = createToken({
  name: 'ScrollAuto',
  pattern: /scroll-auto/,
  label: 'scroll-auto',
})

export const ScrollX = createToken({
  name: 'ScrollX',
  pattern: /scroll-x/,
  label: 'scroll-x',
})

export const ScrollY = createToken({
  name: 'ScrollY',
  pattern: /scroll-y/,
  label: 'scroll-y',
})

export const ScrollHidden = createToken({
  name: 'ScrollHidden',
  pattern: /scroll-hidden/,
  label: 'scroll-hidden',
})

// Card Layouts
export const Card = createToken({
  name: 'Card',
  pattern: /card/,
  label: 'card',
})

export const CardCompact = createToken({
  name: 'CardCompact',
  pattern: /card-compact/,
  label: 'card-compact',
})

export const CardFeature = createToken({
  name: 'CardFeature',
  pattern: /card-feature/,
  label: 'card-feature',
})

// Special Layouts
export const Header = createToken({
  name: 'Header',
  pattern: /header/,
  label: 'header',
})

export const Sidebar = createToken({
  name: 'Sidebar',
  pattern: /sidebar/,
  label: 'sidebar',
})

// Structural Elements (now part of layouts)
export const List = createToken({
  name: 'List',
  pattern: /list/,
  label: 'list',
})

export const Navigator = createToken({
  name: 'Navigator',
  pattern: /navigator/,
  label: 'navigator',
})

export const Fab = createToken({
  name: 'Fab',
  pattern: /fab/,
  label: 'fab',
})

export const UnorderedListItem = createToken({
  name: 'UnorderedListItem',
  pattern: /-\s+[^\n\r]+/,
  label: '- list item',
})

export const Separator = createToken({
  name: 'Separator',
  pattern: /---/,
  label: '---',
})
