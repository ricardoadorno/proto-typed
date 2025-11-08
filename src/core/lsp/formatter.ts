/**
 * LSP Formatter - Format DSL Code
 *
 * Provides code formatting functionality for the DSL.
 * Uses AST to ensure correct formatting with proper indentation.
 */

import { parseAndBuildAst } from '../parser/parse-and-build-ast';
import type { FormattingOptions, TextEdit, DocumentFormattingResult } from './types';
import { createRange } from './types';
import type { AstNode } from '../../types/ast-node';

/**
 * Formatter options
 */
export interface FormatOptions extends FormattingOptions {
  /** Maximum line length before wrapping */
  maxLineLength?: number;
  /** Indentation string (e.g., '  ' for 2 spaces) */
  indentString?: string;
}

/**
 * Format DSL code
 *
 * Takes DSL code and returns formatted version with proper indentation,
 * spacing, and line breaks.
 *
 * @param text DSL code to format
 * @param options Formatting options
 * @returns Array of TextEdits or null if formatting fails
 *
 * @example
 * ```typescript
 * const formatted = format('Screen Home:\nButton primary:Click', { tabSize: 2, insertSpaces: true });
 * // Returns formatted code with proper spacing and indentation
 * ```
 */
export function format(
  text: string,
  options: FormatOptions = { tabSize: 2, insertSpaces: true }
): DocumentFormattingResult {
  try {
    // Parse the code to get AST
    const ast = parseAndBuildAst(text);

    // If parsing failed or no nodes, return null
    if (!ast || (Array.isArray(ast) && ast.length === 0)) {
      return null;
    }

    // Format the AST back to text
    const formattedText = formatAst(ast, options);

    // If formatting didn't change anything, return null
    if (formattedText === text) {
      return null;
    }

    // Create a TextEdit that replaces the entire document
    const lines = text.split('\n');
    const lastLine = lines.length - 1;
    const lastChar = lines[lastLine]?.length ?? 0;

    const edit: TextEdit = {
      range: createRange(0, 0, lastLine, lastChar),
      newText: formattedText,
    };

    return [edit];
  } catch (error) {
    console.error('Formatting error:', error);
    return null;
  }
}

/**
 * Format AST back to text
 *
 * @param ast AST to format (can be array of nodes or single node)
 * @param options Formatting options
 * @returns Formatted text
 */
function formatAst(ast: AstNode | AstNode[], options: FormatOptions): string {
  const indentStr = options.indentString ?? (options.insertSpaces ? ' '.repeat(options.tabSize) : '\t');
  const lines: string[] = [];

  // Normalize ast to array
  const nodes = Array.isArray(ast) ? ast : [ast];

  // Format each top-level node
  for (const node of nodes) {
    formatNode(node, 0, indentStr, lines);
  }

  // Apply formatting options
  let result = lines.join('\n');

  // Trim trailing whitespace if requested
  if (options.trimTrailingWhitespace) {
    result = result
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n');
  }

  // Insert final newline if requested
  if (options.insertFinalNewline && !result.endsWith('\n')) {
    result += '\n';
  }

  // Trim final newlines if requested
  if (options.trimFinalNewlines) {
    result = result.replace(/\n+$/, '\n');
  }

  return result;
}

/**
 * Format a single AST node
 *
 * @param node AST node to format
 * @param depth Indentation depth
 * @param indentStr Indentation string
 * @param lines Output lines array
 */
function formatNode(
  node: AstNode,
  depth: number,
  indentStr: string,
  lines: string[]
): void {
  const indent = indentStr.repeat(depth);

  // Format based on node type
  switch (node.type) {
    case 'Screen':
    case 'Modal':
    case 'Drawer':
      formatViewNode(node, depth, indentStr, lines);
      break;

    case 'Component':
      formatComponentNode(node, depth, indentStr, lines);
      break;

    case 'Layout':
    case 'List':
      formatLayoutNode(node, depth, indentStr, lines);
      break;

    case 'Button':
      formatButtonNode(node, depth, indentStr, lines);
      break;

    case 'Input':
    case 'Checkbox':
    case 'RadioOption':
      formatInputNode(node, depth, indentStr, lines);
      break;

    case 'Text':
    case 'Heading':
    case 'Paragraph':
    case 'Link':
    case 'Image':
    case 'MutedText':
    case 'Note':
    case 'Quote':
      formatPrimitiveNode(node, depth, indentStr, lines);
      break;

    case 'Separator':
    case 'Navigator':
    case 'Fab':
      formatSimpleNode(node, depth, indentStr, lines);
      break;

    default:
      // Generic formatting for unknown node types
      formatGenericNode(node, depth, indentStr, lines);
      break;
  }
}

/**
 * Format view node (Screen, Modal, Drawer)
 */
function formatViewNode(
  node: AstNode,
  depth: number,
  indentStr: string,
  lines: string[]
): void {
  const indent = indentStr.repeat(depth);
  const props = node.props as any;
  const name = props?.name ?? 'Unnamed';
  lines.push(`${indent}${node.type} ${name}:`);

  // Format children
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      formatNode(child, depth + 1, indentStr, lines);
    }
  }
}

/**
 * Format component node
 */
function formatComponentNode(
  node: AstNode,
  depth: number,
  indentStr: string,
  lines: string[]
): void {
  const indent = indentStr.repeat(depth);
  const props = node.props as any;
  const name = props?.name ?? 'Unnamed';
  lines.push(`${indent}Component ${name}:`);

  // Format children
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      formatNode(child, depth + 1, indentStr, lines);
    }
  }
}

/**
 * Format layout node
 */
function formatLayoutNode(
  node: AstNode,
  depth: number,
  indentStr: string,
  lines: string[]
): void {
  const indent = indentStr.repeat(depth);
  const props = node.props as any;
  const layoutType = props?.layoutType ?? '';

  // Convert layout type to DSL syntax (e.g., 'container-wide' -> 'Container wide')
  let formattedLayout = '';
  if (layoutType) {
    const parts = layoutType.split('-');
    const base = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    const modifier = parts.slice(1).join(' ');
    formattedLayout = modifier ? `${base} ${modifier}` : base;
  } else {
    formattedLayout = node.type;
  }

  lines.push(`${indent}${formattedLayout}:`);

  // Format children
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      formatNode(child, depth + 1, indentStr, lines);
    }
  }
}

/**
 * Format button node
 */
function formatButtonNode(
  node: AstNode,
  depth: number,
  indentStr: string,
  lines: string[]
): void {
  const indent = indentStr.repeat(depth);
  const props = node.props as any;
  const variant = props?.variant ?? 'primary';
  const size = props?.size ? ` ${props.size}` : '';
  const label = props?.label ?? props?.text ?? '';
  const action = props?.action ? ` -> ${props.action}` : '';

  lines.push(`${indent}Button ${variant}${size}: ${label}${action}`);
}

/**
 * Format input node
 */
function formatInputNode(
  node: AstNode,
  depth: number,
  indentStr: string,
  lines: string[]
): void {
  const indent = indentStr.repeat(depth);
  const props = node.props as any;

  if (node.type === 'Input') {
    const inputType = props?.type ?? 'text';
    const label = props?.label ?? '';
    const placeholder = props?.placeholder ? ` (${props.placeholder})` : '';
    lines.push(`${indent}Input ${inputType}: ${label}${placeholder}`);
  } else if (node.type === 'Checkbox') {
    const label = props?.label ?? '';
    const checked = props?.checked ? ' [checked]' : '';
    lines.push(`${indent}Checkbox: ${label}${checked}`);
  } else if (node.type === 'RadioOption') {
    const value = props?.value ?? '';
    const label = props?.label ?? '';
    lines.push(`${indent}RadioOption ${value}: ${label}`);
  }
}

/**
 * Format primitive node (Text, Heading, etc.)
 */
function formatPrimitiveNode(
  node: AstNode,
  depth: number,
  indentStr: string,
  lines: string[]
): void {
  const indent = indentStr.repeat(depth);
  const props = node.props as any;
  const content = props?.content ?? props?.text ?? props?.label ?? '';

  if (node.type === 'Heading') {
    const level = props?.level ? ` ${props.level}` : '';
    lines.push(`${indent}Heading${level}: ${content}`);
  } else if (node.type === 'Link') {
    const href = props?.href ?? props?.destination ?? '#';
    lines.push(`${indent}Link ${href}: ${content}`);
  } else if (node.type === 'Image') {
    const src = props?.src ?? '';
    const alt = props?.alt ? ` "${props.alt}"` : '';
    lines.push(`${indent}Image ${src}${alt}`);
  } else {
    lines.push(`${indent}${node.type}: ${content}`);
  }
}

/**
 * Format simple node (no children, simple syntax)
 */
function formatSimpleNode(
  node: AstNode,
  depth: number,
  indentStr: string,
  lines: string[]
): void {
  const indent = indentStr.repeat(depth);
  lines.push(`${indent}${node.type}`);
}

/**
 * Format generic node
 */
function formatGenericNode(
  node: AstNode,
  depth: number,
  indentStr: string,
  lines: string[]
): void {
  const indent = indentStr.repeat(depth);
  lines.push(`${indent}${node.type}: ${JSON.stringify(node.props ?? {})}`);

  // Format children
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      formatNode(child, depth + 1, indentStr, lines);
    }
  }
}

/**
 * Format range in document
 *
 * @param text Document text
 * @param startLine Start line (0-based)
 * @param endLine End line (0-based)
 * @param options Formatting options
 * @returns Array of TextEdits or null
 */
export function formatRange(
  text: string,
  startLine: number,
  endLine: number,
  options: FormatOptions = { tabSize: 2, insertSpaces: true }
): DocumentFormattingResult {
  // For now, format the entire document
  // Range formatting can be implemented later if needed
  return format(text, options);
}

/**
 * Check if text needs formatting
 *
 * @param text Text to check
 * @param options Formatting options
 * @returns true if text would be changed by formatting
 */
export function needsFormatting(text: string, options?: FormatOptions): boolean {
  const result = format(text, options);
  return result !== null && result.length > 0;
}
