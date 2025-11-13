/**
 * Monaco Formatting Provider for proto-typed DSL
 *
 * Integrates the DSL formatter with Monaco Editor's LSP-style formatting features.
 * Provides both document-level and range-based formatting capabilities.
 *
 * ## Features
 *
 * - **Document Formatting**: Format entire file (Shift+Alt+F)
 * - **Range Formatting**: Format selected text (coming soon)
 * - **Format on Type**: Auto-format while typing (configurable)
 * - **Format on Paste**: Auto-format pasted content (configurable)
 *
 * ## Monaco Integration
 *
 * This provider registers with Monaco's language service and provides
 * TextEdit[] responses that Monaco applies to the editor model.
 *
 * @see https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.DocumentFormattingEditProvider.html
 */

import type { Monaco } from '@monaco-editor/react';
import { formatDocument } from './formatter';

/**
 * Register formatting provider with Monaco Editor
 *
 * Registers a DocumentFormattingEditProvider that handles:
 * - Full document formatting (triggered by Shift+Alt+F or context menu)
 * - Integration with formatOnType and formatOnPaste settings
 *
 * The provider returns a list of TextEdits that Monaco applies to update
 * the document. We replace the entire document for simplicity and to
 * ensure idempotency.
 *
 * @param monaco - Monaco editor instance
 * @param languageId - Language identifier (default: 'proto-typed-dsl')
 */
export function registerFormattingProvider(
  monaco: Monaco,
  languageId: string = 'proto-typed-dsl'
): void {
  // Register Document Formatting Provider
  monaco.languages.registerDocumentFormattingEditProvider(languageId, {
    /**
     * Provide formatting edits for entire document
     *
     * @param model - The text model to format
     * @param options - Formatting options (indentation size, tabs vs spaces, etc.)
     * @param token - Cancellation token
     * @returns Array of text edits to apply
     */
    provideDocumentFormattingEdits: (model, options, token) => {
      try {
        // Get current document text
        const originalText = model.getValue();

        // Format the document
        const formattedText = formatDocument(originalText);

        // If no changes, return empty array
        if (formattedText === originalText) {
          return [];
        }

        // Get full document range
        const fullRange = model.getFullModelRange();

        // Return single edit that replaces entire document
        // This is simpler than computing minimal diffs and ensures idempotency
        return [
          {
            range: fullRange,
            text: formattedText,
          },
        ];
      } catch (error) {
        console.error('Error in formatting provider:', error);
        // Return empty array on error - don't break the editor
        return [];
      }
    },
  });

  // Register Document Range Formatting Provider (for selected text)
  monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, {
    /**
     * Provide formatting edits for a specific range
     *
     * Note: For simplicity, we format the entire document and extract the range.
     * This ensures consistent formatting but may format more than selected.
     * A future optimization could format only the selected lines.
     *
     * @param model - The text model containing the range
     * @param range - The range to format
     * @param options - Formatting options
     * @param token - Cancellation token
     * @returns Array of text edits to apply
     */
    provideDocumentRangeFormattingEdits: (model, range, options, token) => {
      try {
        // For now, format the entire document to maintain consistency
        // TODO: Implement smart range formatting that respects context
        const originalText = model.getValue();
        const formattedText = formatDocument(originalText);

        if (formattedText === originalText) {
          return [];
        }

        const fullRange = model.getFullModelRange();

        return [
          {
            range: fullRange,
            text: formattedText,
          },
        ];
      } catch (error) {
        console.error('Error in range formatting provider:', error);
        return [];
      }
    },
  });

  // Register On-Type Formatting Provider (formats while typing)
  // This is triggered by specific characters like newlines or colons
  monaco.languages.registerOnTypeFormattingEditProvider(languageId, {
    autoFormatTriggerCharacters: ['\n', ':'],

    /**
     * Provide formatting edits triggered by typing a character
     *
     * This is called automatically when the user types a trigger character.
     * We apply lightweight formatting only to the current line and context.
     *
     * @param model - The text model
     * @param position - Cursor position after typing
     * @param ch - The character that was typed
     * @param options - Formatting options
     * @param token - Cancellation token
     * @returns Array of text edits to apply
     */
    provideOnTypeFormattingEdits: (model, position, ch, options, token) => {
      try {
        // For colon, we just ensure proper spacing
        if (ch === ':') {
          const line = model.getLineContent(position.lineNumber);
          const beforeCursor = line.substring(0, position.column - 1);

          // Check if there's trailing whitespace before the colon
          if (beforeCursor.endsWith(' ')) {
            const trimmedBefore = beforeCursor.trimEnd();
            const range = {
              startLineNumber: position.lineNumber,
              startColumn: trimmedBefore.length + 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column - 1,
            };

            return [
              {
                range,
                text: '',
              },
            ];
          }
        }

        // For newline, format the previous line
        if (ch === '\n' && position.lineNumber > 1) {
          // Get the previous line
          const prevLineNumber = position.lineNumber - 1;
          const prevLine = model.getLineContent(prevLineNumber);
          const trimmedPrevLine = prevLine.trim();

          // Remove trailing whitespace from previous line
          if (prevLine !== trimmedPrevLine) {
            const range = {
              startLineNumber: prevLineNumber,
              startColumn: 1,
              endLineNumber: prevLineNumber,
              endColumn: prevLine.length + 1,
            };

            // Preserve indentation
            const leadingWhitespace = prevLine.match(/^\s*/)?.[0] || '';

            return [
              {
                range,
                text: leadingWhitespace + trimmedPrevLine,
              },
            ];
          }
        }

        return [];
      } catch (error) {
        console.error('Error in on-type formatting provider:', error);
        return [];
      }
    },
  });

  console.log('✓ Formatting providers registered for', languageId);
}
