/**
 * Completion Provider for Proto-Typed DSL
 * 
 * Provides context-aware IntelliSense completions following VS Code best practices:
 * - Context-aware suggestions based on cursor position
 * - Proper trigger characters
 * - Rich documentation with examples
 * - Snippet support with tab stops
 */

import * as vscode from 'vscode'

/**
 * Create and register the completion provider
 */
export function createCompletionProvider(): vscode.Disposable {
  return vscode.languages.registerCompletionItemProvider(
    { language: 'proto-typed', scheme: 'file' },
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
      ): vscode.CompletionItem[] | vscode.CompletionList {
        
        const line = document.lineAt(position)
        const linePrefix = line.text.substring(0, position.character)
        
        // Context-aware completions
        const completions: vscode.CompletionItem[] = []
        
        // Check if at start of line (views, layouts, structures)
        if (/^\s*$/.test(linePrefix) || /^\s*\w*$/.test(linePrefix)) {
          completions.push(...getViewCompletions())
          completions.push(...getComponentCompletions())
          completions.push(...getLayoutCompletions())
          completions.push(...getStructureCompletions())
          completions.push(...getStylesCompletions())
        }
        
        // Typography completions (after >, #, etc.)
        if (/^\s*(?:[>#"]|\*{1,2})?\s*$/.test(linePrefix)) {
          completions.push(...getTypographyCompletions())
        }
        
        // Button completions (after @)
        if (context.triggerCharacter === '@' || /@\w*$/.test(linePrefix)) {
          completions.push(...getButtonCompletions())
        }
        
        // Link completions (after #)
        if (context.triggerCharacter === '#' || /#\w*$/.test(linePrefix)) {
          completions.push(...getLinkCompletions())
        }
        
        // Form/Input completions (after _)
        if (context.triggerCharacter === '_' || /_+\w*$/.test(linePrefix)) {
          completions.push(...getFormCompletions())
        }
        
        // Component instance/props
        if (context.triggerCharacter === '$' || /\$\w*$/.test(linePrefix)) {
          completions.push(...getComponentInstanceCompletions())
        }
        
        if (context.triggerCharacter === '%' || /%\w*$/.test(linePrefix)) {
          completions.push(...getComponentPropCompletions())
        }
        
        return completions
      }
    },
    // Trigger characters
    '@', '#', '>', '_', '$', '%', '-', '!', '*'
  )
}

// ==============================================
// VIEWS
// ==============================================

function getViewCompletions(): vscode.CompletionItem[] {
  const screen = new vscode.CompletionItem('screen', vscode.CompletionItemKind.Keyword)
  screen.insertText = new vscode.SnippetString('screen ${1:ScreenName}:\n\t$0')
  screen.documentation = new vscode.MarkdownString(
    '**Screen View**\n\nCreate a new screen/page.\n\n```pty\nscreen Dashboard:\n\theader:\n\t\t# Welcome\n```'
  )
  screen.sortText = '01-screen'
  
  const modal = new vscode.CompletionItem('modal', vscode.CompletionItemKind.Keyword)
  modal.insertText = new vscode.SnippetString('modal ${1:ModalName}:\n\t$0')
  modal.documentation = new vscode.MarkdownString(
    '**Modal Overlay**\n\nCreate a modal dialog.\n\n```pty\nmodal ConfirmDelete:\n\tcard:\n\t\t# Are you sure?\n```'
  )
  modal.sortText = '01-modal'
  
  const drawer = new vscode.CompletionItem('drawer', vscode.CompletionItemKind.Keyword)
  drawer.insertText = new vscode.SnippetString('drawer ${1:DrawerName}:\n\t$0')
  drawer.documentation = new vscode.MarkdownString(
    '**Drawer Overlay**\n\nCreate a side drawer.\n\n```pty\ndrawer MainMenu:\n\tnavigator:\n\t\t- Home | HomeScreen\n```'
  )
  drawer.sortText = '01-drawer'
  
  return [screen, modal, drawer]
}

// ==============================================
// COMPONENTS
// ==============================================

function getComponentCompletions(): vscode.CompletionItem[] {
  const component = new vscode.CompletionItem('component', vscode.CompletionItemKind.Class)
  component.insertText = new vscode.SnippetString('component ${1:ComponentName}:\n\t$0')
  component.documentation = new vscode.MarkdownString(
    '**Reusable Component**\n\nDefine a reusable component with props.\n\n```pty\ncomponent UserCard:\n\tcard:\n\t\t# %name\n\t\t> Email: %email\n```'
  )
  component.sortText = '02-component'
  
  return [component]
}

function getComponentInstanceCompletions(): vscode.CompletionItem[] {
  const instance = new vscode.CompletionItem('$Component', vscode.CompletionItemKind.Variable)
  instance.insertText = new vscode.SnippetString('$$${1:ComponentName}')
  instance.documentation = new vscode.MarkdownString(
    '**Component Instance**\n\nInstantiate a component.\n\n```pty\n$UserCard\n```'
  )
  instance.filterText = '$'
  instance.sortText = '90-component-instance'
  
  return [instance]
}

function getComponentPropCompletions(): vscode.CompletionItem[] {
  const prop = new vscode.CompletionItem('%propName', vscode.CompletionItemKind.Property)
  prop.insertText = new vscode.SnippetString('%${1:propName}')
  prop.documentation = new vscode.MarkdownString(
    '**Component Prop**\n\nReference a component property.\n\n```pty\n# %title\n> %description\n```'
  )
  prop.filterText = '%'
  prop.sortText = '91-prop'
  
  return [prop]
}

// ==============================================
// TYPOGRAPHY
// ==============================================

function getTypographyCompletions(): vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = []
  
  // Headings
  for (let i = 1; i <= 4; i++) {
    const heading = new vscode.CompletionItem(
      `heading${i}`,
      vscode.CompletionItemKind.Text
    )
    heading.insertText = new vscode.SnippetString(`${'#'.repeat(i)} \${1:Heading Text}`)
    heading.documentation = new vscode.MarkdownString(
      `**Heading Level ${i}**\n\n\`${'#'.repeat(i)} Text\``
    )
    heading.sortText = `10-h${i}`
    items.push(heading)
  }
  
  // Paragraph (body text)
  const paragraph = new vscode.CompletionItem('paragraph', vscode.CompletionItemKind.Text)
  paragraph.insertText = new vscode.SnippetString('> ${1:Paragraph text}')
  paragraph.documentation = new vscode.MarkdownString(
    '**Paragraph (body)**\n\nPrimary body copy using shadcn typography.\n\n`> Text`'
  )
  paragraph.sortText = '11-paragraph'
  items.push(paragraph)

  // Small text
  const small = new vscode.CompletionItem('small', vscode.CompletionItemKind.Text)
  small.insertText = new vscode.SnippetString('>> ${1:Secondary text}')
  small.documentation = new vscode.MarkdownString(
    '**Small**\n\nCompact secondary text.\n\n`>> Text`'
  )
  small.sortText = '11-small'
  items.push(small)

  // Muted text
  const muted = new vscode.CompletionItem('muted', vscode.CompletionItemKind.Text)
  muted.insertText = new vscode.SnippetString('>>> ${1:Muted text}')
  muted.documentation = new vscode.MarkdownString(
    '**Muted**\n\nLow-emphasis helper text.\n\n`>>> Text`'
  )
  muted.sortText = '11-muted'
  items.push(muted)

  // Blockquote
  const blockquote = new vscode.CompletionItem('blockquote', vscode.CompletionItemKind.Text)
  blockquote.insertText = new vscode.SnippetString('*> ${1:Quoted text}')
  blockquote.documentation = new vscode.MarkdownString(
    '**Blockquote**\n\nQuoted content with left border.\n\n`*> Text`'
  )
  blockquote.sortText = '11-blockquote'
  items.push(blockquote)

  // Note
  const note = new vscode.CompletionItem('note', vscode.CompletionItemKind.Text)
  note.insertText = new vscode.SnippetString('**> ${1:Note text}')
  note.documentation = new vscode.MarkdownString(
    '**Note**\n\nCallout note with raised surface.\n\n`**> Text`'
  )
  note.sortText = '11-note'
  items.push(note)
  
  return items
}

// ==============================================
// BUTTONS
// ==============================================

function getButtonCompletions(): vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = []
  
  const variants = [
    { name: 'button', prefix: '@', desc: 'Default button' },
    { name: 'button-primary', prefix: '@primary', desc: 'Primary button' },
    { name: 'button-secondary', prefix: '@secondary', desc: 'Secondary button' },
    { name: 'button-ghost', prefix: '@ghost', desc: 'Ghost button' },
    { name: 'button-outline', prefix: '@outline', desc: 'Outline button' },
    { name: 'button-destructive', prefix: '@destructive', desc: 'Destructive button' },
    { name: 'button-success', prefix: '@success', desc: 'Success button' },
    { name: 'button-warning', prefix: '@warning', desc: 'Warning button' }
  ]
  
  variants.forEach((variant, index) => {
    const item = new vscode.CompletionItem(variant.name, vscode.CompletionItemKind.Function)
    item.insertText = new vscode.SnippetString(
      `${variant.prefix}[\${1:Button Text}](\${2:action})`
    )
    item.documentation = new vscode.MarkdownString(
      `**${variant.desc}**\n\n\`${variant.prefix}[Text](action)\``
    )
    item.sortText = `30-btn-${index}`
    items.push(item)
  })
  
  // Button with icon
  const withIcon = new vscode.CompletionItem('button-with-icon', vscode.CompletionItemKind.Function)
  withIcon.insertText = new vscode.SnippetString('@[${1:Button Text}]{${2:icon}}(${3:action})')
  withIcon.documentation = new vscode.MarkdownString(
    '**Button with Icon**\n\nButton with Lucide icon.\n\n`@[Save]{save}(save)`'
  )
  withIcon.sortText = '30-btn-icon'
  items.push(withIcon)
  
  return items
}

// ==============================================
// LINKS & IMAGES
// ==============================================

function getLinkCompletions(): vscode.CompletionItem[] {
  const link = new vscode.CompletionItem('link', vscode.CompletionItemKind.Reference)
  link.insertText = new vscode.SnippetString('> [${1:Link Text}](${2:destination})')
  link.documentation = new vscode.MarkdownString(
    '**Inline Link**\n\n`> [Text](Destination)`'
  )
  link.sortText = '40-link'
  
  const image = new vscode.CompletionItem('image', vscode.CompletionItemKind.File)
  image.insertText = new vscode.SnippetString('![${1:Alt Text}](${2:url})')
  image.documentation = new vscode.MarkdownString(
    '**Image**\n\n`![Alt](url)`'
  )
  image.sortText = '40-image'

  const roundedImage = new vscode.CompletionItem('image-rounded', vscode.CompletionItemKind.File)
  roundedImage.insertText = new vscode.SnippetString('!rounded[${1:Alt Text}](${2:url})')
  roundedImage.documentation = new vscode.MarkdownString(
    '**Rounded Image**\n\n`!rounded[Alt](url)`'
  )
  roundedImage.sortText = '40-image-rounded'

  const circleImage = new vscode.CompletionItem('image-circle', vscode.CompletionItemKind.File)
  circleImage.insertText = new vscode.SnippetString('!circle-${1:64}x${2:64}[${3:Avatar}](${4:url})')
  circleImage.documentation = new vscode.MarkdownString(
    '**Circular Image**\n\n`!circle-64x64[Avatar](url)`'
  )
  circleImage.sortText = '40-image-circle'
  
  return [link, image, roundedImage, circleImage]
}

// ==============================================
// FORMS & INPUTS
// ==============================================

function getFormCompletions(): vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = []
  
  const input = new vscode.CompletionItem('input', vscode.CompletionItemKind.Field)
  input.insertText = new vscode.SnippetString('___[${1:Label}][${2:Placeholder}]')
  input.documentation = new vscode.MarkdownString(
    '**Text Input**\n\n`___[Label][Placeholder]`'
  )
  input.sortText = '50-input'
  items.push(input)

  const password = new vscode.CompletionItem('password', vscode.CompletionItemKind.Field)
  password.insertText = new vscode.SnippetString('___password[${1:Password}][${2:Enter password}]')
  password.documentation = new vscode.MarkdownString(
    '**Password Input**\n\n`___password[Password][Enter password]`'
  )
  password.sortText = '50-password'
  items.push(password)

  const select = new vscode.CompletionItem('select', vscode.CompletionItemKind.Field)
  select.insertText = new vscode.SnippetString(
    '___[${1:Label}][${2:Placeholder}[${3:Option1} | ${4:Option2}]]'
  )
  select.documentation = new vscode.MarkdownString(
    '**Select Dropdown**\n\n`___[Label][Placeholder[Option1 | Option2]]`'
  )
  select.sortText = '50-select'
  items.push(select)
  
  const checkbox = new vscode.CompletionItem('checkbox', vscode.CompletionItemKind.Field)
  checkbox.insertText = new vscode.SnippetString('[${1| ,X|}] ${2:Label}')
  checkbox.documentation = new vscode.MarkdownString(
    '**Checkbox**\n\n`[X] Label` or `[ ] Label`'
  )
  checkbox.sortText = '50-checkbox'
  items.push(checkbox)
  
  return items
}

// ==============================================
// LAYOUTS
// ==============================================

function getLayoutCompletions(): vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = []
  
  const layouts = ['row', 'col', 'grid', 'container', 'card']
  
  layouts.forEach((layout, index) => {
    const item = new vscode.CompletionItem(layout, vscode.CompletionItemKind.Constructor)
    item.insertText = new vscode.SnippetString(`${layout}:\n\t$0`)
    item.documentation = new vscode.MarkdownString(
      `**${layout.charAt(0).toUpperCase() + layout.slice(1)} Layout**\n\n\`${layout}:\``
    )
    item.sortText = `20-${index}-${layout}`
    items.push(item)
  })
  
  return items
}

// ==============================================
// STRUCTURES
// ==============================================

function getStructureCompletions(): vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = []
  
  const list = new vscode.CompletionItem('list', vscode.CompletionItemKind.Module)
  list.insertText = new vscode.SnippetString('list:\n\t- ${1:Item 1}\n\t- ${2:Item 2}$0')
  list.documentation = new vscode.MarkdownString(
    '**List**\n\n```pty\nlist:\n\t- Item 1\n\t- Item 2\n```'
  )
  list.sortText = '21-list'
  items.push(list)
  
  const header = new vscode.CompletionItem('header', vscode.CompletionItemKind.Module)
  header.insertText = new vscode.SnippetString('header:\n\t$0')
  header.documentation = new vscode.MarkdownString(
    '**Header**\n\nMobile header component.\n\n`header:`'
  )
  header.sortText = '21-header'
  items.push(header)
  
  const navigator = new vscode.CompletionItem('navigator', vscode.CompletionItemKind.Module)
  navigator.insertText = new vscode.SnippetString(
    'navigator:\n\t- ${1:Home} | ${2:HomeScreen}\n\t- ${3:Settings} | ${4:SettingsScreen}$0'
  )
  navigator.documentation = new vscode.MarkdownString(
    '**Navigator**\n\nBottom navigation.\n\n```pty\nnavigator:\n\t- Home | HomeScreen\n```'
  )
  navigator.sortText = '21-navigator'
  items.push(navigator)
  
  const fab = new vscode.CompletionItem('fab', vscode.CompletionItemKind.Module)
  fab.insertText = new vscode.SnippetString('fab{${1:plus}}(${2:action})')
  fab.documentation = new vscode.MarkdownString(
    '**FAB**\n\nFloating Action Button.\n\n`fab{plus}(action)`'
  )
  fab.sortText = '21-fab'
  items.push(fab)
  
  const separator = new vscode.CompletionItem('separator', vscode.CompletionItemKind.Operator)
  separator.insertText = '---'
  separator.documentation = new vscode.MarkdownString(
    '**Separator**\n\nHorizontal line.\n\n`---`'
  )
  separator.sortText = '21-separator'
  items.push(separator)
  
  return items
}

// ==============================================
// STYLES
// ==============================================

function getStylesCompletions(): vscode.CompletionItem[] {
  const styles = new vscode.CompletionItem('styles', vscode.CompletionItemKind.Module)
  styles.insertText = new vscode.SnippetString('styles:\n\t--${1:property}: ${2:value};$0')
  styles.documentation = new vscode.MarkdownString(
    '**CSS Styles**\n\nCSS custom properties.\n\n```pty\nstyles:\n\t--primary-color: #3b82f6;\n```'
  )
  styles.sortText = '05-styles'
  
  return [styles]
}
