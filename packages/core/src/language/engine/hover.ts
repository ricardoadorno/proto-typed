import type {
  Hover,
  HoverParams,
  MarkupContent,
} from 'vscode-languageserver-protocol'
import { TextDocument } from 'vscode-languageserver-textdocument'

const HOVER_MAP = new Map<string, MarkupContent>([
  // Meta & Head Configuration
  [
    'meta',
    {
      kind: 'markdown',
      value:
        '**meta**\n\nApplication metadata configuration.\n\n```pty\nmeta:\n\tversion: 0.0.1\n\ttitle: My App\n```',
    },
  ],
  [
    'version',
    {
      kind: 'markdown',
      value:
        '**version**\n\nApp version number (semantic versioning).\n\n`version: 0.0.1`',
    },
  ],
  [
    'title',
    {
      kind: 'markdown',
      value: '**title**\n\nApplication title.\n\n`title: My App`',
    },
  ],
  [
    'head',
    {
      kind: 'markdown',
      value:
        '**head**\n\nTheme and styling configuration.\n\n```pty\nhead:\n\tcolor:\n\t\tprimary: #3b82f6\n\tfont:\n\t\tbase: 16\n```',
    },
  ],
  [
    'color',
    {
      kind: 'markdown',
      value:
        '**color**\n\nColor palette configuration.\n\n```pty\ncolor:\n\tprimary: #3b82f6\n\tsecondary: #64748b\n```',
    },
  ],
  [
    'font',
    {
      kind: 'markdown',
      value:
        '**font**\n\nTypography settings.\n\n```pty\nfont:\n\tbase: 16\n\tfamily: Inter\n```',
    },
  ],
  [
    'template',
    {
      kind: 'markdown',
      value:
        '**template**\n\nDefault template component.\n\n`template: $DefaultLayout`',
    },
  ],
  [
    'primary',
    {
      kind: 'markdown',
      value: '**primary**\n\nPrimary color (hex value).\n\n`primary: #3b82f6`',
    },
  ],
  [
    'secondary',
    {
      kind: 'markdown',
      value:
        '**secondary**\n\nSecondary color (hex value).\n\n`secondary: #64748b`',
    },
  ],
  [
    'neutral',
    {
      kind: 'markdown',
      value:
        '**neutral**\n\nNeutral/background color (hex value).\n\n`neutral: #f1f5f9`',
    },
  ],
  [
    'accent',
    {
      kind: 'markdown',
      value: '**accent**\n\nAccent color (hex value).\n\n`accent: #f59e0b`',
    },
  ],
  [
    'base',
    {
      kind: 'markdown',
      value: '**base**\n\nBase font size in pixels.\n\n`base: 16`',
    },
  ],
  [
    'family',
    {
      kind: 'markdown',
      value: '**family**\n\nFont family name.\n\n`family: Inter`',
    },
  ],

  // Views
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
  // Containers
  [
    'container',
    {
      kind: 'markdown',
      value:
        '**container**\n\nStandard container (max-w-5xl).\n\n`container:`',
    },
  ],
  [
    'container-narrow',
    {
      kind: 'markdown',
      value:
        '**container-narrow**\n\nNarrow container (max-w-3xl).\n\n`container-narrow:`',
    },
  ],
  [
    'container-wide',
    {
      kind: 'markdown',
      value:
        '**container-wide**\n\nWide container (max-w-7xl).\n\n`container-wide:`',
    },
  ],
  [
    'container-full',
    {
      kind: 'markdown',
      value: '**container-full**\n\nFull-width container.\n\n`container-full:`',
    },
  ],

  // Stacks
  [
    'stack',
    {
      kind: 'markdown',
      value:
        '**stack**\n\nVertical stack with standard spacing (gap-4).\n\n`stack:`',
    },
  ],
  [
    'stack-tight',
    {
      kind: 'markdown',
      value:
        '**stack-tight**\n\nVertical stack with tight spacing (gap-2).\n\n`stack-tight:`',
    },
  ],
  [
    'stack-loose',
    {
      kind: 'markdown',
      value:
        '**stack-loose**\n\nVertical stack with loose spacing (gap-8).\n\n`stack-loose:`',
    },
  ],
  [
    'stack-none',
    {
      kind: 'markdown',
      value: '**stack-none**\n\nVertical stack with no gap.\n\n`stack-none:`',
    },
  ],

  // Rows
  [
    'row',
    {
      kind: 'markdown',
      value:
        '**row**\n\nHorizontal row with standard alignment.\n\n`row:`',
    },
  ],
  [
    'row-start',
    {
      kind: 'markdown',
      value: '**row-start**\n\nRow aligned to start.\n\n`row-start:`',
    },
  ],
  [
    'row-center',
    {
      kind: 'markdown',
      value: '**row-center**\n\nRow centered.\n\n`row-center:`',
    },
  ],
  [
    'row-between',
    {
      kind: 'markdown',
      value:
        '**row-between**\n\nRow with space-between.\n\n`row-between:`',
    },
  ],
  [
    'row-end',
    {
      kind: 'markdown',
      value: '**row-end**\n\nRow aligned to end.\n\n`row-end:`',
    },
  ],

  // Grids
  [
    'grid',
    {
      kind: 'markdown',
      value: '**grid**\n\nAuto grid layout.\n\n`grid:`',
    },
  ],
  [
    'grid-2',
    {
      kind: 'markdown',
      value: '**grid-2**\n\n2-column grid.\n\n`grid-2:`',
    },
  ],
  [
    'grid-3',
    {
      kind: 'markdown',
      value: '**grid-3**\n\n3-column grid.\n\n`grid-3:`',
    },
  ],
  [
    'grid-4',
    {
      kind: 'markdown',
      value: '**grid-4**\n\n4-column grid.\n\n`grid-4:`',
    },
  ],
  [
    'grid-responsive',
    {
      kind: 'markdown',
      value:
        '**grid-responsive**\n\nResponsive auto-fill grid.\n\n`grid-responsive:`',
    },
  ],

  // Layer/Position
  [
    'layer-static',
    {
      kind: 'markdown',
      value: '**layer-static**\n\nStatic positioning.\n\n`layer-static:`',
    },
  ],
  [
    'layer-relative',
    {
      kind: 'markdown',
      value:
        '**layer-relative**\n\nRelative positioning.\n\n`layer-relative:`',
    },
  ],
  [
    'layer-absolute',
    {
      kind: 'markdown',
      value:
        '**layer-absolute**\n\nAbsolute positioning.\n\n`layer-absolute:`',
    },
  ],
  [
    'layer-fixed',
    {
      kind: 'markdown',
      value: '**layer-fixed**\n\nFixed positioning.\n\n`layer-fixed:`',
    },
  ],
  [
    'layer-sticky',
    {
      kind: 'markdown',
      value: '**layer-sticky**\n\nSticky positioning.\n\n`layer-sticky:`',
    },
  ],
  [
    'layer-overlay',
    {
      kind: 'markdown',
      value:
        '**layer-overlay**\n\nFixed overlay with backdrop.\n\n`layer-overlay:`',
    },
  ],

  // Scroll/Overflow
  [
    'scroll-auto',
    {
      kind: 'markdown',
      value: '**scroll-auto**\n\nAuto overflow scrolling.\n\n`scroll-auto:`',
    },
  ],
  [
    'scroll-x',
    {
      kind: 'markdown',
      value:
        '**scroll-x**\n\nHorizontal overflow scroll.\n\n`scroll-x:`',
    },
  ],
  [
    'scroll-y',
    {
      kind: 'markdown',
      value: '**scroll-y**\n\nVertical overflow scroll.\n\n`scroll-y:`',
    },
  ],
  [
    'scroll-hidden',
    {
      kind: 'markdown',
      value: '**scroll-hidden**\n\nHidden overflow.\n\n`scroll-hidden:`',
    },
  ],

  // Cards
  [
    'card',
    {
      kind: 'markdown',
      value:
        '**card**\n\nElevated surface with padding.\n\n```pty\ncard:\n\t# Title\n\t> Body content\n```',
    },
  ],
  [
    'card-compact',
    {
      kind: 'markdown',
      value:
        '**card-compact**\n\nCard with small padding.\n\n`card-compact:`',
    },
  ],
  [
    'card-feature',
    {
      kind: 'markdown',
      value:
        '**card-feature**\n\nCard with featured styling.\n\n`card-feature:`',
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
