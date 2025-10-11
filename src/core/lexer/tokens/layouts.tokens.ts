import { createToken } from "chevrotain";

// Canonical Layout Tokens
// Preset layouts that cover common UI patterns without modifiers
// Each layout has predefined Tailwind classes and shadcn styling
//
// Categories:
// - Containers: container, container-narrow, container-wide, container-full
// - Stacks: stack, stack-tight, stack-loose (vertical flow)
// - Rows: row-start, row-center, row-between, row-end (horizontal flow)
// - Grids: grid-2, grid-3, grid-4, grid-auto
// - Cards: card, card-compact, card-feature
// - Special: header, sidebar, list

// Container Layouts
export const ContainerNarrow = createToken({ 
  name: "ContainerNarrow", 
  pattern: /container-narrow/,
  label: "container-narrow"
});

export const ContainerWide = createToken({ 
  name: "ContainerWide", 
  pattern: /container-wide/,
  label: "container-wide"
});

export const ContainerFull = createToken({ 
  name: "ContainerFull", 
  pattern: /container-full/,
  label: "container-full"
});

export const Container = createToken({ 
  name: "Container", 
  pattern: /container/,
  label: "container",
  longer_alt: ContainerNarrow
});

// Stack Layouts (Vertical)
export const Stack = createToken({ 
  name: "Stack", 
  pattern: /stack/,
  label: "stack"
});

export const StackTight = createToken({ 
  name: "StackTight", 
  pattern: /stack-tight/,
  label: "stack-tight"
});

export const StackLoose = createToken({ 
  name: "StackLoose", 
  pattern: /stack-loose/,
  label: "stack-loose"
});

export const StackFlush = createToken({
  name: "StackFlush",
  pattern: /stack-flush/,
  label: "stack-flush"
});

// Row Layouts (Horizontal)
export const RowStart = createToken({ 
  name: "RowStart", 
  pattern: /row-start/,
  label: "row-start"
});

export const RowCenter = createToken({ 
  name: "RowCenter", 
  pattern: /row-center/,
  label: "row-center"
});

export const RowBetween = createToken({ 
  name: "RowBetween", 
  pattern: /row-between/,
  label: "row-between"
});

export const RowEnd = createToken({ 
  name: "RowEnd", 
  pattern: /row-end/,
  label: "row-end"
});

// Grid Layouts
export const Grid2 = createToken({ 
  name: "Grid2", 
  pattern: /grid-2/,
  label: "grid-2"
});

export const Grid3 = createToken({ 
  name: "Grid3", 
  pattern: /grid-3/,
  label: "grid-3"
});

export const Grid4 = createToken({ 
  name: "Grid4", 
  pattern: /grid-4/,
  label: "grid-4"
});

export const GridAuto = createToken({ 
  name: "GridAuto", 
  pattern: /grid-auto/,
  label: "grid-auto"
});

// Card Layouts
export const Card = createToken({ 
  name: "Card", 
  pattern: /card/,
  label: "card"
});

export const CardCompact = createToken({ 
  name: "CardCompact", 
  pattern: /card-compact/,
  label: "card-compact"
});

export const CardFeature = createToken({ 
  name: "CardFeature", 
  pattern: /card-feature/,
  label: "card-feature"
});

// Special Layouts
export const Header = createToken({ 
  name: "Header", 
  pattern: /header/,
  label: "header"
});

export const Sidebar = createToken({ 
  name: "Sidebar", 
  pattern: /sidebar/,
  label: "sidebar"
});

// Structural Elements (now part of layouts)
export const List = createToken({ 
  name: "List", 
  pattern: /list/,
  label: "list"
});

export const Navigator = createToken({
  name: "Navigator",
  pattern: /navigator/,
  label: "navigator"
});

export const Fab = createToken({
  name: "Fab",
  pattern: /fab/,
  label: "fab"
});

export const UnorderedListItem = createToken({
  name: "UnorderedListItem",
  pattern: /-\s+[^\n\r]+/,
  label: "- list item"
});

export const Separator = createToken({
  name: "Separator", 
  pattern: /---/,
  label: "---"
});