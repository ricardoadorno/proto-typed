// Define all possible node types - matching token names exactly
export type NodeType =
  // Views (from views.tokens.ts)
  | 'Screen'
  | 'Modal'
  | 'Drawer'

  // Primitives (from primitives.tokens.ts)
  | 'Button'
  | 'Link'
  | 'Image'
  | 'Heading'
  | 'Text'
  | 'Paragraph'
  | 'MutedText'
  | 'Note'
  | 'Quote'

  // Layouts (from layouts.tokens.ts - canonical presets + structural elements)
  | 'Layout' // Canonical layout presets (container-narrow, stack, row-center, grid-3, card, header, etc.)
  | 'List'
  | 'Navigator'
  | 'NavigatorItem'
  | 'UnorderedListItem'
  | 'Fab'
  | 'Separator'

  // Inputs (from inputs.tokens.ts)
  | 'Input'
  | 'RadioOption'
  | 'Checkbox'
  | 'Select'

  // Components (from components.tokens.ts)
  | 'Component'
  | 'ComponentInstance'
  | 'PropVariable'

  // Styles (from styles.tokens.ts)
  | 'Styles'
  | 'CssProperty'

  // Core (from core.tokens.ts)
  | 'Identifier'

// Canonical layout types
export type LayoutType =
  | 'container'
  | 'container-narrow'
  | 'container-wide'
  | 'container-full'
  | 'stack'
  | 'stack-tight'
  | 'stack-loose'
  | 'row-start'
  | 'row-center'
  | 'row-between'
  | 'row-end'
  | 'grid-2'
  | 'grid-3'
  | 'grid-4'
  | 'grid-auto'
  | 'card'
  | 'card-compact'
  | 'card-feature'
  | 'header'
  | 'sidebar'

// Define layout modifier properties (legacy - kept for backward compatibility)
export interface LayoutProps {
  layoutType?: LayoutType // New canonical layout type
  width?: string
  height?: string
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline'
  padding?: string
  paddingX?: string
  paddingY?: string
  paddingLeft?: string
  paddingRight?: string
  paddingTop?: string
  paddingBottom?: string
  margin?: string
  marginX?: string
  marginY?: string
  marginLeft?: string
  marginRight?: string
  marginTop?: string
  marginBottom?: string
  gap?: string
  gridCols?: string
}

// Define text-specific properties
export interface TextProps extends LayoutProps {
  content?: string
  level?: number // For headings (1-6)
  variant?: string
}

// Define button properties
export interface ButtonProps extends LayoutProps {
  text?: string
  action?: string
  variant?: string
  icon?: string
  size?: string
}

// Define link properties
export interface LinkProps extends LayoutProps {
  text?: string
  destination?: string
}

// Define image properties
export interface ImageProps extends LayoutProps {
  src?: string
  alt?: string
}

// Define input properties
export interface InputProps extends LayoutProps {
  label?: string
  placeholder?: string
  value?: string
  type?: string
  disabled?: boolean
  validation?: string
}

// Define select properties
export interface SelectProps extends LayoutProps {
  label?: string
  options?: string[]
  value?: string
  placeholder?: string
}

// Define checkbox properties
export interface CheckboxProps extends LayoutProps {
  label?: string
  checked?: boolean
  disabled?: boolean
}

// Define radio properties
export interface RadioProps extends LayoutProps {
  label?: string
  value?: string
  checked?: boolean
}

// Define mobile element properties
export interface MobileProps extends LayoutProps {
  icon?: string
  label?: string
  action?: string
}

// Define view properties (Screen, Modal, Drawer)
export interface ViewProps extends LayoutProps {
  name?: string
  variant?: string
}

// Define component properties
export interface ComponentProps extends LayoutProps {
  name?: string
  props?: string[]
  children?: AstNode[]
}

// Define component instance properties
export interface ComponentInstanceProps extends LayoutProps {
  componentName?: string
  propsData?: Record<string, string>
}

// Define list properties
export interface ListProps extends LayoutProps {
  items?: string[]
  variant?: string
}

// Define navigator properties
export interface NavigatorProps extends LayoutProps {
  items?: Array<{ label: string; destination: string }>
}

// Define FAB properties
export interface FabProps extends LayoutProps {
  icon?: string
  action?: string
  position?: string
}

// Union type for all possible props
export type NodeProps =
  | LayoutProps
  | TextProps
  | ButtonProps
  | LinkProps
  | ImageProps
  | InputProps
  | SelectProps
  | CheckboxProps
  | RadioProps
  | ViewProps
  | ComponentProps
  | ComponentInstanceProps
  | ListProps
  | NavigatorProps
  | FabProps
  | MobileProps
  | Record<string, unknown>

// Base AST Node interface with standardized structure
export interface AstNode<P extends NodeProps = NodeProps> {
  type: NodeType
  id: string
  children: AstNode[]
  props: P
}

// AST with errors attached
export interface AstWithErrors extends AstNode {
  __errors?: unknown[]
}

// Builder with error collection
export interface BuilderWithErrors {
  __builderErrors?: unknown[]
  visit(cst: unknown): AstNode | AstNode[]
  validateVisitor(): void
}
