import { createToken } from 'chevrotain'

// Primitive Element Tokens - Basic UI elements

// Button variant tokens (optional, default is primary)
export const ButtonPrimary = createToken({
  name: 'ButtonPrimary',
  pattern: /@primary/,
  label: '@primary',
})
export const ButtonSecondary = createToken({
  name: 'ButtonSecondary',
  pattern: /@secondary/,
  label: '@secondary',
})
export const ButtonOutline = createToken({
  name: 'ButtonOutline',
  pattern: /@outline/,
  label: '@outline',
})
export const ButtonGhost = createToken({
  name: 'ButtonGhost',
  pattern: /@ghost/,
  label: '@ghost',
})
export const ButtonDestructive = createToken({
  name: 'ButtonDestructive',
  pattern: /@destructive/,
  label: '@destructive',
})
export const ButtonSuccess = createToken({
  name: 'ButtonSuccess',
  pattern: /@success/,
  label: '@success',
})
export const ButtonWarning = createToken({
  name: 'ButtonWarning',
  pattern: /@warning/,
  label: '@warning',
})

// Default button marker (when no variant specified, defaults to primary)
export const ButtonMarker = createToken({
  name: 'ButtonMarker',
  pattern: /@/,
  label: '@',
  longer_alt: [
    ButtonPrimary,
    ButtonSecondary,
    ButtonOutline,
    ButtonGhost,
    ButtonDestructive,
    ButtonSuccess,
    ButtonWarning,
  ],
})

// Button size tokens (optional, default without modifier)
export const ButtonSizeSmall = createToken({
  name: 'ButtonSizeSmall',
  pattern: /-small/,
  label: '-small',
})
export const ButtonSizeIcon = createToken({
  name: 'ButtonSizeIcon',
  pattern: /-icon/,
  label: '-icon',
})
export const ButtonSizeLarge = createToken({
  name: 'ButtonSizeLarge',
  pattern: /-large/,
  label: '-large',
})

// Button label and action
export const ButtonLabel = createToken({
  name: 'ButtonLabel',
  pattern: /\[([^\]]+)\]/,
  label: '[text]',
})
export const ButtonAction = createToken({
  name: 'ButtonAction',
  pattern: /\(([^)]+)\)/,
  label: '(action)',
})

export const Image = createToken({
  name: 'Image',
  pattern: /!(?:(?:rounded|circle)(?:-\d+x\d+)?)?\[([^\]]+)\](?:\(([^)]+)\))?/,
  label: '![alt](url), !rounded[alt](url), !circle-64x64[alt](url)',
})

export const Heading = createToken({
  name: 'Heading',
  pattern: /#{1,4}(?!#)\s+([^\n\r#[\]"=:]+)/,
  label: '# heading (h1-h4)',
})

export const Paragraph = createToken({
  name: 'Paragraph',
  pattern: />(?!>|\*)\s+([^\n\r]+)/,
  label: '> paragraph',
})

export const MutedText = createToken({
  name: 'MutedText',
  pattern: />>>\s+([^\n\r]+)/,
  label: '>>> muted text',
})

export const SmallText = createToken({
  name: 'SmallText',
  pattern: />>(?!>)\s+([^\n\r]+)/,
  label: '>> small text',
})

export const Blockquote = createToken({
  name: 'Blockquote',
  pattern: /\*(?!\*)>\s+([^\n\r]+)/,
  label: '*> blockquote',
})

export const Note = createToken({
  name: 'Note',
  pattern: /\*\*>[ \t]+([^\n\r]+)/,
  label: '**> note',
})
