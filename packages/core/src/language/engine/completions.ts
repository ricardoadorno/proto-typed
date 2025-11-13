import type {
  CompletionItem,
  CompletionList,
  CompletionParams,
} from 'vscode-languageserver-protocol'
import {
  CompletionItemKind,
  InsertTextFormat,
} from 'vscode-languageserver-types'
import { TextDocument } from 'vscode-languageserver-textdocument'

export const TRIGGER_CHARACTERS = [
  '@',
  '#',
  '>',
  '_',
  '$',
  '%',
  '-',
  '!',
  '*',
] as const

export function getCompletions(
  params: CompletionParams,
  document: TextDocument
): CompletionList {
  const linePrefix = getLinePrefix(document, params.position)
  const trigger = params.context?.triggerCharacter ?? null

  const items: CompletionItem[] = []

  if (/^\s*$/.test(linePrefix) || /^\s*\w*$/.test(linePrefix)) {
    items.push(...VIEW_COMPLETIONS)
    items.push(...COMPONENT_COMPLETIONS)
    items.push(...LAYOUT_COMPLETIONS)
    items.push(...STRUCTURE_COMPLETIONS)
    items.push(...STYLE_COMPLETIONS)
  }

  if (/^\s*(?:[>#"]|\*{1,2})?\s*$/.test(linePrefix)) {
    items.push(...TYPOGRAPHY_COMPLETIONS)
  }

  if (trigger === '@' || /@\w*$/.test(linePrefix)) {
    items.push(...BUTTON_COMPLETIONS)
  }

  if (trigger === '#' || /#\w*$/.test(linePrefix)) {
    items.push(...LINK_COMPLETIONS)
  }

  if (trigger === '_' || /_+\w*$/.test(linePrefix)) {
    items.push(...FORM_COMPLETIONS)
  }

  if (trigger === '$' || /\$\w*$/.test(linePrefix)) {
    items.push(COMPONENT_INSTANCE_COMPLETION)
  }

  if (trigger === '%' || /%\w*$/.test(linePrefix)) {
    items.push(COMPONENT_PROP_COMPLETION)
  }

  return {
    isIncomplete: false,
    items,
  }
}

function getLinePrefix(
  document: TextDocument,
  position: { line: number; character: number }
): string {
  const start = { line: position.line, character: 0 }
  return document.getText({ start, end: position })
}

interface SnippetDefinition {
  label: string
  kind: CompletionItemKind
  snippet: string
  documentation: string
  sortText?: string
  filterText?: string
  detail?: string
  format?: InsertTextFormat
}

const snippet = (definition: SnippetDefinition): CompletionItem => ({
  label: definition.label,
  kind: definition.kind,
  insertText: definition.snippet,
  insertTextFormat: definition.format ?? InsertTextFormat.Snippet,
  sortText: definition.sortText,
  filterText: definition.filterText,
  detail: definition.detail,
  documentation: {
    kind: 'markdown',
    value: definition.documentation,
  },
})

const VIEW_COMPLETIONS: CompletionItem[] = [
  snippet({
    label: 'screen',
    kind: CompletionItemKind.Keyword,
    snippet: 'screen ${1:ScreenName}:\n\t$0',
    documentation:
      '**Screen View**\n\nCreate a new screen/page.\n\n```pty\nscreen Dashboard:\n\theader:\n\t\t# Welcome\n```',
    sortText: '01-screen',
  }),
  snippet({
    label: 'modal',
    kind: CompletionItemKind.Keyword,
    snippet: 'modal ${1:ModalName}:\n\t$0',
    documentation:
      '**Modal Overlay**\n\nCreate a modal dialog.\n\n```pty\nmodal ConfirmDelete:\n\tcard:\n\t\t# Are you sure?\n```',
    sortText: '01-modal',
  }),
  snippet({
    label: 'drawer',
    kind: CompletionItemKind.Keyword,
    snippet: 'drawer ${1:DrawerName}:\n\t$0',
    documentation:
      '**Drawer Overlay**\n\nCreate a side drawer.\n\n```pty\ndrawer MainMenu:\n\tnavigator:\n\t\t- Home | HomeScreen\n```',
    sortText: '01-drawer',
  }),
]

const COMPONENT_COMPLETIONS: CompletionItem[] = [
  snippet({
    label: 'component',
    kind: CompletionItemKind.Class,
    snippet: 'component ${1:ComponentName}:\n\t$0',
    documentation:
      '**Reusable Component**\n\nDefine a reusable component with props.\n\n```pty\ncomponent UserCard:\n\tcard:\n\t\t# %name\n\t\t> Email: %email\n```',
    sortText: '02-component',
  }),
]

const COMPONENT_INSTANCE_COMPLETION = snippet({
  label: '$Component',
  kind: CompletionItemKind.Variable,
  snippet: '$$${1:ComponentName}',
  documentation:
    '**Component Instance**\n\nInstantiate a component.\n\n```pty\n$UserCard\n```',
  sortText: '90-component-instance',
  filterText: '$',
})

const COMPONENT_PROP_COMPLETION = snippet({
  label: '%propName',
  kind: CompletionItemKind.Property,
  snippet: '%${1:propName}',
  documentation:
    '**Component Prop**\n\nReference a component property.\n\n```pty\n# %title\n> %description\n```',
  sortText: '91-prop',
  filterText: '%',
})

const TYPOGRAPHY_COMPLETIONS: CompletionItem[] = [
  ...Array.from({ length: 4 }, (_, index) => {
    const level = index + 1
    return snippet({
      label: `heading${level}`,
      kind: CompletionItemKind.Text,
      snippet: `${'#'.repeat(level)} \${1:Heading Text}`,
      documentation: `**Heading Level ${level}**\n\n\`${'#'.repeat(level)} Text\``,
      sortText: `10-h${level}`,
    })
  }),
  snippet({
    label: 'paragraph',
    kind: CompletionItemKind.Text,
    snippet: '> ${1:Paragraph text}',
    documentation:
      '**Paragraph (body)**\n\nPrimary body copy using shadcn typography.\n\n`> Text`',
    sortText: '11-paragraph',
  }),
  snippet({
    label: 'small',
    kind: CompletionItemKind.Text,
    snippet: '>> ${1:Secondary text}',
    documentation: '**Small**\n\nCompact secondary text.\n\n`>> Text`',
    sortText: '11-small',
  }),
  snippet({
    label: 'muted',
    kind: CompletionItemKind.Text,
    snippet: '>>> ${1:Muted text}',
    documentation: '**Muted**\n\nLow-emphasis helper text.\n\n`>>> Text`',
    sortText: '11-muted',
  }),
  snippet({
    label: 'blockquote',
    kind: CompletionItemKind.Text,
    snippet: '*> ${1:Quoted text}',
    documentation:
      '**Blockquote**\n\nQuoted content with left border.\n\n`*> Text`',
    sortText: '11-blockquote',
  }),
  snippet({
    label: 'note',
    kind: CompletionItemKind.Text,
    snippet: '**> ${1:Note text}',
    documentation:
      '**Note**\n\nCallout note with raised surface.\n\n`**> Text`',
    sortText: '11-note',
  }),
]

const BUTTON_COMPLETIONS: CompletionItem[] = [
  ...[
    { label: 'button', prefix: '@', description: 'Default button' },
    {
      label: 'button-primary',
      prefix: '@primary',
      description: 'Primary button',
    },
    {
      label: 'button-secondary',
      prefix: '@secondary',
      description: 'Secondary button',
    },
    { label: 'button-ghost', prefix: '@ghost', description: 'Ghost button' },
    {
      label: 'button-outline',
      prefix: '@outline',
      description: 'Outline button',
    },
    {
      label: 'button-destructive',
      prefix: '@destructive',
      description: 'Destructive button',
    },
    {
      label: 'button-success',
      prefix: '@success',
      description: 'Success button',
    },
    {
      label: 'button-warning',
      prefix: '@warning',
      description: 'Warning button',
    },
  ].map((variant, index) =>
    snippet({
      label: variant.label,
      kind: CompletionItemKind.Function,
      snippet: `${variant.prefix}[\${1:Button Text}](\${2:action})`,
      documentation: `**${variant.description}**\n\n\`${variant.prefix}[Text](action)\``,
      sortText: `30-btn-${index}`,
    })
  ),
  snippet({
    label: 'button-with-icon',
    kind: CompletionItemKind.Function,
    snippet: '@[${1:Button Text}]{${2:icon}}(${3:action})',
    documentation:
      '**Button with Icon**\n\nButton with Lucide icon.\n\n`@[Save]{save}(save)`',
    sortText: '30-btn-icon',
  }),
]

const LINK_COMPLETIONS: CompletionItem[] = [
  snippet({
    label: 'link',
    kind: CompletionItemKind.Reference,
    snippet: '> [${1:Link Text}](${2:destination})',
    documentation: '**Inline Link**\n\n`> [Text](Destination)`',
    sortText: '40-link',
  }),
  snippet({
    label: 'image',
    kind: CompletionItemKind.File,
    snippet: '![${1:Alt Text}](${2:url})',
    documentation: '**Image**\n\n`![Alt](url)`',
    sortText: '40-image',
  }),
  snippet({
    label: 'image-rounded',
    kind: CompletionItemKind.File,
    snippet: '!rounded[${1:Alt Text}](${2:url})',
    documentation: '**Rounded Image**\n\n`!rounded[Alt](url)`',
    sortText: '40-image-rounded',
  }),
  snippet({
    label: 'image-circle',
    kind: CompletionItemKind.File,
    snippet: '!circle-${1:64}x${2:64}[${3:Avatar}](${4:url})',
    documentation: '**Circular Image**\n\n`!circle-64x64[Avatar](url)`',
    sortText: '40-image-circle',
  }),
]

const FORM_COMPLETIONS: CompletionItem[] = [
  snippet({
    label: 'input',
    kind: CompletionItemKind.Field,
    snippet: '___[${1:Label}][${2:Placeholder}]',
    documentation: '**Text Input**\n\n`___[Label][Placeholder]`',
    sortText: '50-input',
  }),
  snippet({
    label: 'password',
    kind: CompletionItemKind.Field,
    snippet: '___password[${1:Password}][${2:Enter password}]',
    documentation:
      '**Password Input**\n\n`___password[Password][Enter password]`',
    sortText: '50-password',
  }),
  snippet({
    label: 'select',
    kind: CompletionItemKind.Field,
    snippet: '___[${1:Label}][${2:Placeholder}[${3:Option1} | ${4:Option2}]]',
    documentation:
      '**Select Dropdown**\n\n`___[Label][Placeholder[Option1 | Option2]]`',
    sortText: '50-select',
  }),
  snippet({
    label: 'checkbox',
    kind: CompletionItemKind.Field,
    snippet: '[${1| ,X|}] ${2:Label}',
    documentation: '**Checkbox**\n\n`[X] Label` or `[ ] Label`',
    sortText: '50-checkbox',
  }),
]

const LAYOUT_COMPLETIONS: CompletionItem[] = [
  ...['row', 'col', 'grid', 'container', 'card'].map((layout, index) =>
    snippet({
      label: layout,
      kind: CompletionItemKind.Constructor,
      snippet: `${layout}:\n\t$0`,
      documentation: `**${capitalize(layout)} Layout**\n\n\`${layout}:\``,
      sortText: `20-${index}-${layout}`,
    })
  ),
]

const STRUCTURE_COMPLETIONS: CompletionItem[] = [
  snippet({
    label: 'list',
    kind: CompletionItemKind.Module,
    snippet: 'list:\n\t- ${1:Item 1}\n\t- ${2:Item 2}$0',
    documentation: '**List**\n\n```pty\nlist:\n\t- Item 1\n\t- Item 2\n```',
    sortText: '21-list',
  }),
  snippet({
    label: 'header',
    kind: CompletionItemKind.Module,
    snippet: 'header:\n\t$0',
    documentation: '**Header**\n\nMobile header component.\n\n`header:`',
    sortText: '21-header',
  }),
  snippet({
    label: 'navigator',
    kind: CompletionItemKind.Module,
    snippet:
      'navigator:\n\t- ${1:Home} | ${2:HomeScreen}\n\t- ${3:Settings} | ${4:SettingsScreen}$0',
    documentation:
      '**Navigator**\n\nBottom navigation.\n\n```pty\nnavigator:\n\t- Home | HomeScreen\n```',
    sortText: '21-navigator',
  }),
  snippet({
    label: 'fab',
    kind: CompletionItemKind.Module,
    snippet: 'fab{${1:plus}}(${2:action})',
    documentation: '**FAB**\n\nFloating Action Button.\n\n`fab{plus}(action)`',
    sortText: '21-fab',
  }),
  snippet({
    label: 'separator',
    kind: CompletionItemKind.Operator,
    snippet: '---',
    documentation: '**Separator**\n\nHorizontal line.\n\n`---`',
    sortText: '21-separator',
    format: InsertTextFormat.PlainText,
  }),
]

const STYLE_COMPLETIONS: CompletionItem[] = [
  snippet({
    label: 'styles',
    kind: CompletionItemKind.Module,
    snippet: 'styles:\n\t--${1:property}: ${2:value};$0',
    documentation:
      '**CSS Styles**\n\nCSS custom properties.\n\n```pty\nstyles:\n\t--primary-color: #3b82f6;\n```',
    sortText: '05-styles',
  }),
]

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
