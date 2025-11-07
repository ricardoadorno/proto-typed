import type * as monacoEditor from 'monaco-editor'

const VIEW_KEYWORDS = ['screen', 'modal', 'drawer']
const COMPONENT_KEYWORDS = ['component']
const LAYOUT_BASES = [
  'row',
  'col',
  'grid',
  'container',
  'stack',
  'layer',
  'scroll',
  'sidebar',
  'fab',
]
const STRUCTURE_BASES = ['list', 'card', 'header', 'navigator']

const identifierPattern = /[A-Za-z_][\w-]*/

const viewDeclarationPattern = buildDeclarationPattern(VIEW_KEYWORDS)
const componentDeclarationPattern = buildDeclarationPattern(COMPONENT_KEYWORDS)
const layoutPattern = buildKeywordPattern(LAYOUT_BASES, true)
const structurePattern = buildKeywordPattern(STRUCTURE_BASES, true)

export function registerDSLMonarchLanguage(
  monaco: typeof monacoEditor,
  languageId: string
) {
  monaco.languages.setMonarchTokensProvider(languageId, {
    defaultToken: '',
    tokenizer: {
      root: [
        [viewDeclarationPattern, { token: 'keyword.view', next: '@viewName' }],
        [
          componentDeclarationPattern,
          { token: 'keyword.component', next: '@componentName' },
        ],
        [layoutPattern, 'keyword.layout'],
        [structurePattern, 'keyword.structure'],
        [/^\s*styles(?=\s*:)/, 'keyword.styles'],
        [/^\s*---+/, 'delimiter.separator'],
        [/^\s*-\s+/, 'markup.list'],
        [/^\s*\*\*>/, 'markup.note'],
        [/^\s*\*>/, 'markup.quote'],
        [/^\s*#{1,4}(?=\s)/, 'markup.heading'],
        [/^\s*>>>(?=\s)/, 'markup.muted'],
        [/^\s*>>(?=\s)/, 'markup.text'],
        [/^\s*>(?=\s)/, 'markup.paragraph'],
        [/^\s*@{1,3}(?:[A-Za-z-]+)?(?=\[)/, 'keyword.button'],
        [/^\s*!\w*(?=\[)/, 'keyword.image'],
        [/^\s*#(?=\[)/, 'keyword.link'],
        [/\bi-[A-Za-z]\w*\b/, 'entity.name.icon'],
        [/^\s*___[a-zA-Z]*/, 'keyword.input'],
        [/^\s*\[[Xx\s]\]/, 'keyword.checkbox'],
        [/^\s*\([Xx\s]\)/, 'keyword.radio'],
        [/\$[A-Z][\w-]*/, 'variable.component'],
        [/%[a-zA-Z][\w-]*/, 'variable.prop'],
        [/--[a-zA-Z-]+/, 'variable.css'],
        [/\|/, 'delimiter.pipe'],
        [/:/, 'delimiter.colon'],
        [/\{|\}/, 'delimiter.brace'],
        [/\(|\)/, 'delimiter.parenthesis'],
        [/\[|\]/, 'delimiter.bracket'],
        [/".*?"/, 'string'],
        [/'.*?'/, 'string'],
        [/`.*?`/, 'string'],
      ],
      viewName: [
        [/\s+/, 'white'],
        [identifierPattern, { token: 'entity.name.view', next: '@pop' }],
        [/$/, { token: '', next: '@pop' }],
      ],
      componentName: [
        [/\s+/, 'white'],
        [identifierPattern, { token: 'entity.name.component', next: '@pop' }],
        [/$/, { token: '', next: '@pop' }],
      ],
    },
  })
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildKeywordPattern(
  words: string[],
  allowModifiers = false
): RegExp {
  const choices = words
    .map((word) => {
      const escaped = escapeRegExp(word)
      if (allowModifiers) {
        return `${escaped}(?:-[\\w]+)*`
      }
      return escaped
    })
    .join('|')
  return new RegExp(`^\\s*(?:${choices})(?=\\s|:|$)`)
}

function buildDeclarationPattern(words: string[]): RegExp {
  const escaped = words.map((word) => escapeRegExp(word)).join('|')
  return new RegExp(`^\\s*(?:${escaped})(?=\\s+[A-Za-z_])`)
}
