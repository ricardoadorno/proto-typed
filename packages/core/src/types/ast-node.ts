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
  | 'Identifier';

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
  | 'sidebar';

// Define layout modifier properties (legacy - kept for backward compatibility)
export interface LayoutProps {
  layoutType?: LayoutType; // New canonical layout type
  width?: string;
  height?: string;
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  padding?: string;
  paddingX?: string;
  paddingY?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  margin?: string;
  marginX?: string;
  marginY?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  gap?: string;
  gridCols?: string;
}

// Define text-specific properties
export interface TextProps extends LayoutProps {
  content?: string;
  level?: number; // For headings (1-6)
  variant?: string;
}

// Define interactive element properties
export interface InteractiveProps extends LayoutProps {
  text?: string;
  action?: string;
  destination?: string;
  alt?: string;
  src?: string;
}

// Define form element properties
export interface FormProps extends LayoutProps {
  label?: string;
  placeholder?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  password?: boolean;
  options?: string[];
}

// Define mobile element properties
export interface MobileProps extends LayoutProps {
  icon?: string;
  label?: string;
  action?: string;
}

// Define structural element properties
export interface StructuralProps extends LayoutProps {
  name?: string;
  componentName?: string;
  dataItems?: string[][];
  props?: string[];
}

// Union type for all possible props
export type NodeProps = 
  | LayoutProps 
  | TextProps 
  | InteractiveProps 
  | FormProps 
  | MobileProps 
  | StructuralProps
  | Record<string, any>;

// Base AST Node interface with standardized structure
export interface AstNode {
  type: NodeType;
  id: string;
  children: AstNode[];
  props: NodeProps;
}