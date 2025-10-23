/**
 * Monaco Editor IntelliSense/Completion Provider for proto-typed DSL
 *
 * Provides context-aware completions based on ACTUAL DSL syntax.
 * All completions match documented syntax in copilot-instructions.md
 *
 * CRITICAL: Only includes elements that exist in src/core/lexer/tokens/
 * NO fictional elements - every completion maps to a real token/parser rule
 *
 * @see copilot-instructions.md for complete DSL syntax reference
 */

import { DSL_LANGUAGE_ID } from '../constants'
import { Monaco } from '@monaco-editor/react'

/**
 * Register DSL completion provider with Monaco
 */
export function registerDSLCompletionProvider(monaco: Monaco) {
  monaco.languages.registerCompletionItemProvider(DSL_LANGUAGE_ID, {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position)
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      }

      const suggestions = [
        // ========================================
        // VIEWS (views.tokens.ts)
        // ========================================
        {
          label: 'screen',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'screen ${1:ScreenName}:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Create a new screen view\nExample: screen Dashboard:',
          range: range,
        },
        {
          label: 'modal',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'modal ${1:ModalName}:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Create a modal overlay\nExample: modal ConfirmDelete:',
          range: range,
        },
        {
          label: 'drawer',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'drawer ${1:DrawerName}:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Create a drawer overlay\nExample: drawer MainMenu:',
          range: range,
        },

        // ========================================
        // TYPOGRAPHY (primitives.tokens.ts)
        // ========================================
        {
          label: 'heading1',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '# ${1:Heading Text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Heading level 1 (largest)\nExample: # Welcome',
          range: range,
        },
        {
          label: 'heading2',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '## ${1:Heading Text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Heading level 2\nExample: ## Dashboard',
          range: range,
        },
        {
          label: 'heading3',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '### ${1:Heading Text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Heading level 3\nExample: ### Statistics',
          range: range,
        },
        {
          label: 'heading4',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '#### ${1:Heading Text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Heading level 4',
          range: range,
        },
        {
          label: 'heading5',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '##### ${1:Heading Text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Heading level 5',
          range: range,
        },
        {
          label: 'heading6',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '###### ${1:Heading Text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Heading level 6 (smallest)',
          range: range,
        },
        {
          label: 'paragraph',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '> ${1:Paragraph text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Paragraph text with bottom margin\nExample: > Welcome to the app',
          range: range,
        },
        {
          label: 'text',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '>> ${1:Text content}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Text without bottom margin\nExample: >> Inline text',
          range: range,
        },
        {
          label: 'muted-text',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '>>> ${1:Muted text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Muted/secondary text\nExample: >>> Last updated 5 mins ago',
          range: range,
        },
        {
          label: 'note',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '*> ${1:Note text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Note styled text\nExample: *> Important reminder',
          range: range,
        },
        {
          label: 'quote',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '"> ${1:Quote text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Quote styled text\nExample: "> User feedback',
          range: range,
        },

        // ========================================
        // BUTTONS (primitives.tokens.ts)
        // Pattern: (@{1,3})([_+\-=!]?)\[text\](?:\{icon\})?(?:\(action\))?
        // ========================================
        {
          label: 'button-large',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@[${1:Button Text}](${2:action})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Large button (default variant)\nExample: @[Submit](submit)',
          range: range,
        },
        {
          label: 'button-medium',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@@[${1:Button Text}](${2:action})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Medium button\nExample: @@[Save](save)',
          range: range,
        },
        {
          label: 'button-small',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@@@[${1:Button Text}](${2:action})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Small button\nExample: @@@[Edit](edit)',
          range: range,
        },
        {
          label: 'button-ghost',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@_[${1:Button Text}](${2:action})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Ghost variant button\nExample: @_[Cancel](cancel)',
          range: range,
        },
        {
          label: 'button-outline',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@+[${1:Button Text}](${2:action})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Outline variant button\nExample: @+[Learn More](info)',
          range: range,
        },
        {
          label: 'button-secondary',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@-[${1:Button Text}](${2:action})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Secondary variant button\nExample: @-[Back](-1)',
          range: range,
        },
        {
          label: 'button-destructive',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@=[${1:Delete}](${2:delete})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Destructive variant button\nExample: @=[Delete](delete)',
          range: range,
        },
        {
          label: 'button-warning',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@![${1:Warning}](${2:action})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Warning variant button\nExample: @![Caution](warn)',
          range: range,
        },
        {
          label: 'button-with-icon',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@[${1:Button Text}]{${2:icon-name}}(${3:action})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Button with Lucide icon\nExample: @[Save]{save}(save)',
          range: range,
        },

        // ========================================
        // LINKS & IMAGES (primitives.tokens.ts)
        // ========================================
        {
          label: 'link',
          kind: monaco.languages.CompletionItemKind.Reference,
          insertText: '#[${1:Link Text}](${2:destination})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Navigation link\nExample: #[Go to Settings](Settings)',
          range: range,
        },
        {
          label: 'image',
          kind: monaco.languages.CompletionItemKind.File,
          insertText: '![${1:Alt Text}](${2:image-url})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Image element\nExample: ![Logo](https://example.com/logo.png)',
          range: range,
        },

        // ========================================
        // LAYOUTS (layouts.tokens.ts)
        // All support inline modifiers: element-modifier1-modifier2:
        // ========================================
        {
          label: 'row',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'row:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Row layout (horizontal flex)\nExample: row:\nExample with modifiers: row-w50-center-p4:',
          range: range,
        },
        {
          label: 'row-with-modifiers',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'row-${1:w50}-${2:center}-${3:p4}:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Row with inline modifiers\nModifiers: w/h[num], wfull, hfull, center, start, end, between, p/m[num], etc.',
          range: range,
        },
        {
          label: 'col',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'col:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Column layout (vertical flex)\nExample: col:\nExample with modifiers: col-h100-start-m2:',
          range: range,
        },
        {
          label: 'col-with-modifiers',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'col-${1:h100}-${2:start}-${3:p2}:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Column with inline modifiers\nModifiers: w/h[num], wfull, hfull, center, start, end, p/m[num], etc.',
          range: range,
        },
        {
          label: 'grid',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'grid:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Grid layout\nExample: grid:\nExample with modifiers: grid-cols3-gap4-p2:',
          range: range,
        },
        {
          label: 'grid-with-modifiers',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'grid-cols${1:3}-gap${2:4}:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Grid with columns and gap\nModifiers: cols[1-12], gap[num], p/m[num]',
          range: range,
        },
        {
          label: 'container',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'container:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Container layout\nExample: container:\nExample with modifiers: container-wfull-center-p8:',
          range: range,
        },
        {
          label: 'container-with-modifiers',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'container-${1:wfull}-${2:center}-${3:p8}:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Container with inline modifiers\nModifiers: wfull, center, stretch, p/m[num]',
          range: range,
        },

        // ========================================
        // STRUCTURES (structures.tokens.ts)
        // ========================================
        {
          label: 'list',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'list:\n\t- ${1:Item 1}\n\t- ${2:Item 2}$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'List container with items\nExample:\nlist:\n  - Item 1\n  - Item 2',
          range: range,
        },
        {
          label: 'list-item',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '- ${1:Item text}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'List item\nExample: - Simple item',
          range: range,
        },
        {
          label: 'card',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'card:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Card container\nExample: card:\nExample with modifiers: card-w75-p4:',
          range: range,
        },
        {
          label: 'card-with-modifiers',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'card-${1:w75}-${2:p4}:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Card with inline modifiers\nModifiers: w/h[num], p/m[num]',
          range: range,
        },
        {
          label: 'header',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'header:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Mobile header component\nExample: header:\nExample with modifiers: header-h100-center:',
          range: range,
        },
        {
          label: 'header-with-modifiers',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'header-${1:h100}-${2:center}:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Header with inline modifiers\nModifiers: h[num], center, between',
          range: range,
        },
        {
          label: 'navigator',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText:
            'navigator:\n\t- ${1:Home} | ${2:HomeScreen}\n\t- ${3:Settings} | ${4:SettingsScreen}$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Mobile navigator (bottom navigation)\nFormat:\n- text | destination\n- text | icon | destination\n- i-IconName Label | destination',
          range: range,
        },
        {
          label: 'navigator-item',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '- ${1:Label} | ${2:Destination}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Navigator item (2 parts: text | destination)\nExample: - Home | HomeScreen',
          range: range,
        },
        {
          label: 'navigator-item-with-icon',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '- ${1:Label} | ${2:icon-name} | ${3:Destination}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Navigator item with icon (3 parts)\nExample: - Home | home | HomeScreen',
          range: range,
        },
        {
          label: 'navigator-item-icon-first',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '- i-${1:home} ${2:Home} | ${3:HomeScreen}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Navigator item (icon-first format)\nExample: - i-Home Dashboard | HomeScreen',
          range: range,
        },
        {
          label: 'fab',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'fab{${1:plus}}(${2:action})',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Floating Action Button\nExample: fab{plus}(addItem)',
          range: range,
        },
        {
          label: 'separator',
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: '---',
          documentation: 'Horizontal separator line\nExample: ---',
          range: range,
        },

        // ========================================
        // FORMS (inputs.tokens.ts)
        // Pattern: ___[\*\-]?(?::Label)?(?:\{Placeholder\})?(?:\[Options\])?
        // ========================================
        {
          label: 'input',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '___:${1:Label}{${2:Placeholder}}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Text input field\nExample: ___:Email{Enter email}',
          range: range,
        },
        {
          label: 'password',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '___*:${1:Password}{${2:Enter password}}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Password input field\nExample: ___*:Password{Enter password}',
          range: range,
        },
        {
          label: 'disabled-input',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '___-:${1:Label}{${2:Cannot edit}}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Disabled input field\nExample: ___-:Username{Cannot edit}',
          range: range,
        },
        {
          label: 'select',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText:
            '___:${1:Label}{${2:Select}}[${3:Option1} | ${4:Option2} | ${5:Option3}]',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Select dropdown\nExample: ___:Country{Select}[USA | Canada | Mexico]',
          range: range,
        },
        {
          label: 'checkbox-checked',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '[X] ${1:Label}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Checked checkbox\nExample: [X] Agree to terms',
          range: range,
        },
        {
          label: 'checkbox-unchecked',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '[ ] ${1:Label}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Unchecked checkbox\nExample: [ ] Subscribe to newsletter',
          range: range,
        },
        {
          label: 'radio-selected',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '(X) ${1:Label}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Selected radio button\nExample: (X) Option A',
          range: range,
        },
        {
          label: 'radio-unselected',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '( ) ${1:Label}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Unselected radio button\nExample: ( ) Option B',
          range: range,
        },

        // ========================================
        // COMPONENTS (components.tokens.ts)
        // ========================================
        {
          label: 'component',
          kind: monaco.languages.CompletionItemKind.Class,
          insertText: 'component ${1:ComponentName}:\n\t$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Define reusable component\nUse %propName for variables\nExample:\ncomponent UserCard:\n  card:\n    # %name\n    > Email: %email',
          range: range,
        },
        {
          label: 'component-instance',
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: '\\$${1:ComponentName}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Instantiate component\nExample: $UserCard',
          range: range,
        },
        {
          label: 'component-with-props',
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: '\\$${1:ComponentName}:\n\t- ${2:value1} | ${3:value2}$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Instantiate component with props (pipe-separated)\nExample:\n$UserCard:\n  - John | john@email.com',
          range: range,
        },
        {
          label: 'list-with-component',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText:
            'list \\$${1:ComponentName}:\n\t- ${2:value1} | ${3:value2}\n\t- ${4:value3} | ${5:value4}$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'List with component instances\nExample:\nlist $UserCard:\n  - John | john@email.com\n  - Jane | jane@email.com',
          range: range,
        },
        {
          label: 'component-prop',
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: '%${1:propName}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'Component prop variable (inside component definition)\nExample: %name, %email, %phone',
          range: range,
        },

        // ========================================
        // STYLES (styles.tokens.ts)
        // ========================================
        {
          label: 'styles',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'styles:\n\t--${1:custom-property}: ${2:value};$0',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation:
            'CSS custom properties (variables)\nExample:\nstyles:\n  --primary-color: #3b82f6;\n  --font-size: 16px;',
          range: range,
        },
      ]

      return { suggestions }
    },
  })
}
