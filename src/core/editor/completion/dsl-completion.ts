import { DSL_LANGUAGE_ID } from '../constants';
import { Monaco } from '@monaco-editor/react';

/**
 * Provide completions/IntelliSense for the DSL
 */
export function registerDSLCompletionProvider(monaco: Monaco) {
  monaco.languages.registerCompletionItemProvider(DSL_LANGUAGE_ID, {
    provideCompletionItems: (model, position) => {
      // Get the word at the current position for context
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };

      const suggestions: any[] = [
        // Screen declaration
        {
          label: '@screen',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: '@screen ${1:ScreenName}:\n\t$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Create a new screen',
          range: range,
        },
        
        // Layout elements
        {
          label: 'container',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'container:\n\t$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Container layout element',
          range: range,
        },
        {
          label: 'card',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'card:\n\t$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Card container element',
          range: range,
        },
        {
          label: 'row',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'row:\n\t$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Row layout element',
          range: range,
        },
        {
          label: 'col',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'col:\n\t$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Column layout element',
          range: range,
        },
        {
          label: 'list',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'list:\n\t- ${1:Item 1}\n\t- ${2:Item 2}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'List container element',
          range: range,
        },        {
          label: 'section',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'section:\n\t$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Section container element',
          range: range,
        },
        {
          label: 'grid',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'grid:\n\t$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Grid layout element',
          range: range,
        },
        {
          label: 'flex',
          kind: monaco.languages.CompletionItemKind.Constructor,
          insertText: 'flex:\n\t$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Flex layout element',
          range: range,
        },
        
        // Typography
        {
          label: 'heading1',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '# ${1:Heading Text}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Heading level 1',
          range: range,
        },
        {
          label: 'heading2',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '## ${1:Heading Text}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Heading level 2',
          range: range,
        },
        {
          label: 'heading3',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '### ${1:Heading Text}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Heading level 3',
          range: range,
        },
        {
          label: 'text',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '> ${1:Text content}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Regular text content',
          range: range,
        },
        {
          label: 'note',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '*> ${1:Note text}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Note styled text',
          range: range,
        },
        {
          label: 'quote',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '"> ${1:Quote text}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Quote styled text',
          range: range,
        },
        
        // Interactive elements
        {
          label: 'button',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@[${1:Button Text}](${2:action})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Interactive button',
          range: range,
        },
        {
          label: 'button-with-icon',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '@[${1:Button Text}]{${2:icon}}(${3:action})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Interactive button with icon',
          range: range,
        },
        {
          label: 'link',
          kind: monaco.languages.CompletionItemKind.Reference,
          insertText: '#[${1:Link Text}](${2:destination})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Navigation link',
          range: range,
        },
        {
          label: 'image',
          kind: monaco.languages.CompletionItemKind.File,
          insertText: '![${1:Alt Text}](${2:image-url})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Image element',
          range: range,
        },
        
        // Form elements
        {
          label: 'input',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '___:${1:Label}(${2:Placeholder})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Text input field',
          range: range,
        },
        {
          label: 'password',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '___*:${1:Label}(${2:Placeholder})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Password input field',
          range: range,
        },
        {
          label: 'disabled-input',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '___-:${1:Label}(${2:Placeholder})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Disabled input field',
          range: range,
        },
        {
          label: 'select',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '___:${1:Label}(${2:Placeholder})[${3:Option1} | ${4:Option2}]',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Select dropdown field',
          range: range,
        },
        {
          label: 'checkbox-checked',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '[X] ${1:Label}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Checked checkbox',
          range: range,
        },
        {
          label: 'checkbox-unchecked',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '[ ] ${1:Label}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Unchecked checkbox',
          range: range,
        },
        {
          label: 'radio-selected',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '(X) ${1:Label}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Selected radio button',
          range: range,
        },
        {
          label: 'radio-unselected',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: '( ) ${1:Label}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Unselected radio button',
          range: range,
        },
        
        // Mobile elements
        {
          label: 'header',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'header:\n\t$0',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Mobile header component',
          range: range,
        },
        {
          label: 'bottom_nav',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'bottom_nav:\n\t${1:nav_item [Home]{🏠}(home)}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Mobile bottom navigation',
          range: range,
        },        {
          label: 'drawer',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'drawer ${1:MyDrawer}:\n\t${2:drawer_item [Settings]{⚙️}(settings)}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Named mobile drawer menu',
          range: range,
        },        {
          label: 'fab',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: 'fab {${1:+}}:\n\t${2:fab_item [Action]{🔔}(action)}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Floating action button with expandable items',
          range: range,
        },
        {
          label: 'nav_item',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: 'nav_item [${1:Label}]{${2:Icon}}(${3:action})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Navigation item',
          range: range,
        },        {
          label: 'drawer_item',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: 'drawer_item [${1:Label}]{${2:Icon}}(${3:action})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Drawer menu item',
          range: range,
        },
        {
          label: 'fab_item',
          kind: monaco.languages.CompletionItemKind.Field,
          insertText: 'fab_item [${1:Label}]{${2:Icon}}(${3:action})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'FAB menu item',
          range: range,
        },
        
        // Display elements
        {
          label: 'progress',
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: 'progress {value: ${1:75}}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Progress bar',
          range: range,
        },
        {
          label: 'badge',
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: 'badge "${1:Text}"',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Badge/label element',
          range: range,
        },
        {
          label: 'avatar',
          kind: monaco.languages.CompletionItemKind.Value,
          insertText: 'avatar {src: "${1:url}"}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Avatar image element',
          range: range,
        },
        {
          label: 'separator',
          kind: monaco.languages.CompletionItemKind.Operator,
          insertText: '---',
          documentation: 'Horizontal separator line',
          range: range,
        },
        
        // List items
        {
          label: 'list-item',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '- ${1:Item text}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Unordered list item',
          range: range,
        },
        {
          label: 'ordered-item',
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: '${1:1}. ${2:Item text}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Ordered list item',
          range: range,
        },
      ];

      return { suggestions };
    },
  });
}
