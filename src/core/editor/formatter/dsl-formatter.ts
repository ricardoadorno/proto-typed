/**
 * DSL Document Formatter
 *
 * Provides automatic code formatting for the proto-typed DSL.
 * Handles indentation, spacing, and consistent styling.
 *
 * @version 0.0.2
 */

import type { Monaco } from '@monaco-editor/react';

// ============================================================
// Formatting Options
// ============================================================

export interface FormatterOptions {
  /** Use tabs for indentation (default: true) */
  useTabs: boolean;
  /** Tab size in spaces (default: 2) */
  tabSize: number;
  /** Insert final newline (default: true) */
  insertFinalNewline: boolean;
  /** Trim trailing whitespace (default: true) */
  trimTrailingWhitespace: boolean;
  /** Max line length for wrapping (default: 100) */
  maxLineLength: number;
}

const DEFAULT_OPTIONS: FormatterOptions = {
  useTabs: true,
  tabSize: 2,
  insertFinalNewline: true,
  trimTrailingWhitespace: true,
  maxLineLength: 100,
};

// ============================================================
// Token Types
// ============================================================

type TokenType =
  | 'view' // screen, modal, drawer
  | 'component'
  | 'button'
  | 'text'
  | 'layout'
  | 'input'
  | 'style'
  | 'comment'
  | 'blank'
  | 'content';

interface Line {
  raw: string;
  trimmed: string;
  type: TokenType;
  indent: number;
  requiresColon: boolean;
}

// ============================================================
// Line Analysis
// ============================================================

/**
 * Analyze a line to determine its type and properties
 */
function analyzeLine(line: string): Line {
  const trimmed = line.trim();
  const indent = line.match(/^[\t ]*/)?.[0].length || 0;

  // Blank line
  if (trimmed.length === 0) {
    return { raw: line, trimmed, type: 'blank', indent, requiresColon: false };
  }

  // Comments (future support)
  if (trimmed.startsWith('//')) {
    return { raw: line, trimmed, type: 'comment', indent, requiresColon: false };
  }

  // Views
  if (/^(screen|modal|drawer)\s+/i.test(trimmed)) {
    return { raw: line, trimmed, type: 'view', indent, requiresColon: true };
  }

  // Components
  if (/^component\s+/i.test(trimmed)) {
    return { raw: line, trimmed, type: 'component', indent, requiresColon: true };
  }

  // Buttons
  if (/^@/.test(trimmed)) {
    return { raw: line, trimmed, type: 'button', indent, requiresColon: false };
  }

  // Text elements
  if (/^(#{1,6}|>>?>?|\*>|">)\s/.test(trimmed)) {
    return { raw: line, trimmed, type: 'text', indent, requiresColon: false };
  }

  // Layouts
  if (/^(container|stack|row|grid|card|header|footer|section)\s*:?/i.test(trimmed)) {
    return { raw: line, trimmed, type: 'layout', indent, requiresColon: true };
  }

  // Inputs
  if (/^(___|(\[)|(\())\s/.test(trimmed)) {
    return { raw: line, trimmed, type: 'input', indent, requiresColon: false };
  }

  // Styles
  if (/^styles\s*:/i.test(trimmed) || /^--[\w-]+\s*:/.test(trimmed)) {
    return { raw: line, trimmed, type: 'style', indent, requiresColon: false };
  }

  // Default: content
  return { raw: line, trimmed, type: 'content', indent, requiresColon: false };
}

// ============================================================
// Formatting Rules
// ============================================================

/**
 * Ensure colon is present and properly spaced for block-level elements
 */
function normalizeColon(line: Line): string {
  if (!line.requiresColon) {
    return line.trimmed;
  }

  // Remove existing colon and whitespace at the end
  let normalized = line.trimmed.replace(/\s*:?\s*$/, '');

  // Add colon
  normalized += ':';

  return normalized;
}

/**
 * Normalize spacing in a line
 */
function normalizeSpacing(line: Line): string {
  let normalized = line.trimmed;

  // Normalize button syntax: @variant-size [Label]
  if (line.type === 'button') {
    normalized = normalized.replace(/@(\w+)(?:-(\w+))?\s*\[(.*?)\]/g, (_, variant, size, label) => {
      const sizeStr = size ? `-${size}` : '';
      return `@${variant}${sizeStr} [${label}]`;
    });

    // Normalize action spacing: -> Target
    normalized = normalized.replace(/\s*->\s*/g, ' -> ');
  }

  // Normalize text elements spacing
  if (line.type === 'text') {
    // Ensure single space after text prefix
    normalized = normalized.replace(/^(#{1,6}|>>?>?|\*>|">)\s+/, (match, prefix) => `${prefix} `);
  }

  // Normalize layout spacing
  if (line.type === 'layout') {
    // Ensure single space before colon (if any content)
    normalized = normalized.replace(/\s+:$/, ':');
  }

  // Normalize component instance spacing: $Component
  normalized = normalized.replace(/\$\s+([A-Z])/g, '$$$1');

  // Normalize prop variable spacing: %prop
  normalized = normalized.replace(/%\s+([a-z])/g, '%$1');

  return normalized;
}

/**
 * Apply indentation to a line
 */
function applyIndentation(content: string, level: number, options: FormatterOptions): string {
  if (content.trim().length === 0) {
    return '';
  }

  const indent = options.useTabs
    ? '\t'.repeat(level)
    : ' '.repeat(level * options.tabSize);

  return indent + content;
}

// ============================================================
// Main Formatter
// ============================================================

/**
 * Format the entire document
 */
export function formatDocument(text: string, options: Partial<FormatterOptions> = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const lines = text.split('\n');
  const analyzed = lines.map(analyzeLine);
  const formatted: string[] = [];

  let currentIndentLevel = 0;
  let previousLine: Line | null = null;

  for (let i = 0; i < analyzed.length; i++) {
    const line = analyzed[i];

    // Handle blank lines
    if (line.type === 'blank') {
      // Preserve single blank line between top-level blocks
      if (previousLine && previousLine.type !== 'blank' && currentIndentLevel === 0) {
        formatted.push('');
      }
      previousLine = line;
      continue;
    }

    // Determine indentation level
    if (line.type === 'view' || line.type === 'component' || line.trimmed === 'styles:') {
      currentIndentLevel = 0;

      // Add blank line before top-level blocks (except first)
      if (formatted.length > 0 && previousLine?.type !== 'blank') {
        formatted.push('');
      }
    } else if (previousLine?.requiresColon && previousLine.trimmed.endsWith(':')) {
      // If previous line was a block start, indent
      currentIndentLevel++;
    } else if (line.type === 'layout' && line.requiresColon) {
      // Layout elements might be nested, maintain or reduce indent
      // Look ahead to determine if this is a new block or continuation
      const nextLine = analyzed[i + 1];
      if (nextLine && (nextLine.type === 'view' || nextLine.type === 'component')) {
        currentIndentLevel = 0;
      }
    }

    // Check for dedent (if current line is at same level as a previous block start)
    if (
      (line.type === 'view' || line.type === 'component' || line.type === 'layout') &&
      currentIndentLevel > 0
    ) {
      // Check if we should dedent
      const shouldDedent = line.trimmed.match(/^(screen|modal|drawer|component)\s+/i);
      if (shouldDedent) {
        currentIndentLevel = 0;
      }
    }

    // Normalize the line content
    let content = normalizeColon(line);
    content = normalizeSpacing({ ...line, trimmed: content });

    // Apply indentation
    const indented = applyIndentation(content, currentIndentLevel, opts);

    // Trim trailing whitespace if enabled
    formatted.push(opts.trimTrailingWhitespace ? indented.trimEnd() : indented);

    previousLine = line;

    // Reset indent level after non-colon blocks
    if (line.requiresColon && !line.trimmed.endsWith(':')) {
      currentIndentLevel = Math.max(0, currentIndentLevel - 1);
    }
  }

  // Join lines
  let result = formatted.join('\n');

  // Ensure final newline
  if (opts.insertFinalNewline && !result.endsWith('\n')) {
    result += '\n';
  }

  // Remove excessive blank lines (more than 2 consecutive)
  result = result.replace(/\n{3,}/g, '\n\n');

  return result;
}

// ============================================================
// Range Formatter
// ============================================================

/**
 * Format a specific range in the document
 */
export function formatRange(
  text: string,
  startLine: number,
  endLine: number,
  options: Partial<FormatterOptions> = {}
): string {
  const lines = text.split('\n');
  const selectedLines = lines.slice(startLine - 1, endLine);
  const beforeLines = lines.slice(0, startLine - 1);
  const afterLines = lines.slice(endLine);

  // Format only the selected lines
  const formatted = formatDocument(selectedLines.join('\n'), options);

  // Reconstruct the document
  return [...beforeLines, formatted, ...afterLines].join('\n');
}

// ============================================================
// Monaco Integration
// ============================================================

/**
 * Register the formatter provider with Monaco
 */
export function registerFormatterProvider(monaco: Monaco, languageId: string): void {
  // Document formatting provider (Shift+Alt+F)
  monaco.languages.registerDocumentFormattingEditProvider(languageId, {
    provideDocumentFormattingEdits: (model) => {
      const text = model.getValue();
      const formatted = formatDocument(text, {
        useTabs: !model.getOptions().insertSpaces,
        tabSize: model.getOptions().tabSize as number,
      });

      return [
        {
          range: model.getFullModelRange(),
          text: formatted,
        },
      ];
    },
  });

  // Range formatting provider (selection formatting)
  monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, {
    provideDocumentRangeFormattingEdits: (model, range) => {
      const text = model.getValue();
      const formatted = formatRange(text, range.startLineNumber, range.endLineNumber, {
        useTabs: !model.getOptions().insertSpaces,
        tabSize: model.getOptions().tabSize as number,
      });

      return [
        {
          range: model.getFullModelRange(),
          text: formatted,
        },
      ];
    },
  });

  // On-type formatting provider (format as you type)
  monaco.languages.registerOnTypeFormattingEditProvider(languageId, {
    autoFormatTriggerCharacters: [':', '\n'],
    provideOnTypeFormattingEdits: (model, position, ch) => {
      const line = model.getLineContent(position.lineNumber);

      // Format current line when typing colon
      if (ch === ':') {
        const analyzed = analyzeLine(line);
        let formatted = normalizeColon(analyzed);
        formatted = normalizeSpacing({ ...analyzed, trimmed: formatted });

        if (formatted !== line.trim()) {
          return [
            {
              range: {
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: line.length + 1,
              },
              text: formatted,
            },
          ];
        }
      }

      return [];
    },
  });
}
