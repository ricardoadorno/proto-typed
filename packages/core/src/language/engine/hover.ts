import type {
  Hover,
  HoverParams,
  MarkupContent,
} from 'vscode-languageserver-protocol'
import { TextDocument } from 'vscode-languageserver-textdocument'

const HOVER_MAP = new Map<string, MarkupContent>([
  [
    'screen',
    {
      kind: 'markdown',
      value:
        '**screen**\n\nDefines a top-level screen/page.\n\n```pty\nscreen Dashboard:\n\theader:\n\t\t# Welcome\n```',
    },
  ],
  [
    'modal',
    {
      kind: 'markdown',
      value:
        '**modal**\n\nCreates a modal dialog overlay.\n\n```pty\nmodal ConfirmDelete:\n\tcard:\n\t\t# Are you sure?\n```',
    },
  ],
  [
    'drawer',
    {
      kind: 'markdown',
      value:
        '**drawer**\n\nCreates a slide-in drawer, typically for navigation.\n\n```pty\ndrawer MainMenu:\n\tnavigator:\n\t\t- Home | HomeScreen\n```',
    },
  ],
  [
    'component',
    {
      kind: 'markdown',
      value:
        '**component**\n\nDeclares a reusable component with props.\n\n```pty\ncomponent UserCard:\n\tcard:\n\t\t# %name\n\t\t> %email\n```',
    },
  ],
  [
    'row',
    {
      kind: 'markdown',
      value:
        '**row**\n\nHorizontal layout container for child elements.\n\n`row:`',
    },
  ],
  [
    'col',
    {
      kind: 'markdown',
      value: '**col**\n\nVertical stack container.\n\n`col:`',
    },
  ],
  [
    'grid',
    {
      kind: 'markdown',
      value:
        '**grid**\n\nResponsive grid layout for structured content.\n\n`grid:`',
    },
  ],
  [
    'container',
    {
      kind: 'markdown',
      value:
        '**container**\n\nOuter layout container that controls width and padding.\n\n`container:`',
    },
  ],
  [
    'card',
    {
      kind: 'markdown',
      value:
        '**card**\n\nElevated surface with padding.\n\n```pty\ncard:\n\t# Title\n\t> Body content\n```',
    },
  ],
  [
    'list',
    {
      kind: 'markdown',
      value:
        '**list**\n\nBlock list for navigation or grouped items.\n\n```pty\nlist:\n\t- Item 1\n\t- Item 2\n```',
    },
  ],
  [
    'header',
    {
      kind: 'markdown',
      value:
        '**header**\n\nMobile header component containing title/actions.\n\n`header:`',
    },
  ],
  [
    'navigator',
    {
      kind: 'markdown',
      value:
        '**navigator**\n\nBottom navigation with route targets.\n\n```pty\nnavigator:\n\t- Home | HomeScreen\n```',
    },
  ],
  [
    'fab',
    {
      kind: 'markdown',
      value: '**fab**\n\nFloating action button.\n\n`fab{plus}(action)`',
    },
  ],
  [
    'styles',
    {
      kind: 'markdown',
      value:
        '**styles**\n\nLocal CSS custom properties for the current scope.\n\n```pty\nstyles:\n\t--primary-color: #3b82f6;\n```',
    },
  ],
  [
    '@',
    {
      kind: 'markdown',
      value:
        '**Default button**\n\nCreates a button with optional action target.\n\n`@[Text](action)`',
    },
  ],
  [
    '@primary',
    {
      kind: 'markdown',
      value:
        '**Primary button**\n\nHigh-emphasis button.\n\n`@primary[Text](action)`',
    },
  ],
  [
    '@secondary',
    {
      kind: 'markdown',
      value:
        '**Secondary button**\n\nLow-emphasis button for secondary actions.\n\n`@secondary[Text](action)`',
    },
  ],
  [
    '@ghost',
    {
      kind: 'markdown',
      value:
        '**Ghost button**\n\nMinimal button with transparent background.\n\n`@ghost[Text](action)`',
    },
  ],
  [
    '@outline',
    {
      kind: 'markdown',
      value:
        '**Outline button**\n\nButton with outlined style.\n\n`@outline[Text](action)`',
    },
  ],
  [
    '@destructive',
    {
      kind: 'markdown',
      value:
        '**Destructive button**\n\nHighlights dangerous actions.\n\n`@destructive[Delete](action)`',
    },
  ],
  [
    '@success',
    {
      kind: 'markdown',
      value:
        '**Success button**\n\nAffirmative action button.\n\n`@success[Publish](action)`',
    },
  ],
  [
    '@warning',
    {
      kind: 'markdown',
      value:
        '**Warning button**\n\nUse for cautionary actions.\n\n`@warning[Retry](action)`',
    },
  ],
  [
    '!rounded',
    {
      kind: 'markdown',
      value:
        '**Rounded image**\n\nDisplay an image with rounded corners.\n\n`!rounded[Alt](url)`',
    },
  ],
  [
    '!circle',
    {
      kind: 'markdown',
      value:
        '**Circular image**\n\nDisplay an image as a circle.\n\n`!circle-96x96[Avatar](url)`',
    },
  ],
  [
    '___',
    {
      kind: 'markdown',
      value:
        '**Text input**\n\nCreates a text input with label and placeholder.\n\n`___[Label][Placeholder]`',
    },
  ],
  [
    '___password',
    {
      kind: 'markdown',
      value:
        '**Password input**\n\nMasked input for secrets.\n\n`___password[Password][Enter password]`',
    },
  ],
])

export function getHover(
  params: HoverParams,
  document: TextDocument
): Hover | null {
  const token = getTokenAt(document, params.position)
  if (!token) {
    return null
  }

  const key = normalizeToken(token)
  const contents = HOVER_MAP.get(key)
  if (!contents) {
    return null
  }

  return { contents }
}

function getTokenAt(
  document: TextDocument,
  position: { line: number; character: number }
): string | null {
  const offset = document.offsetAt(position)
  const text = document.getText()
  if (text.length === 0) {
    return null
  }

  let start = offset
  while (start > 0 && isTokenChar(text.charCodeAt(start - 1))) {
    start -= 1
  }

  let end = offset
  while (end < text.length && isTokenChar(text.charCodeAt(end))) {
    end += 1
  }

  if (start === end) {
    return null
  }

  return text.slice(start, end)
}

function isTokenChar(charCode: number): boolean {
  const ch = String.fromCharCode(charCode)
  return /[A-Za-z0-9_\-@$!]/.test(ch)
}

function normalizeToken(token: string): string {
  if (token.startsWith('!circle')) {
    return '!circle'
  }
  if (token.startsWith('___password')) {
    return '___password'
  }
  if (token.startsWith('___')) {
    return '___'
  }
  return token.toLowerCase()
}
