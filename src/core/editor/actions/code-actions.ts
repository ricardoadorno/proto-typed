/**
 * Code Actions Provider (Quick Fixes)
 *
 * Provides automated fixes for common errors in the proto-typed DSL.
 * Integrates with Monaco's Code Action API to show lightbulb suggestions.
 *
 * @version 0.0.2
 */

import type { Monaco } from '@monaco-editor/react';
import type { ProtoError } from '../../../types/errors';
import { ERROR_CODES } from '../../../types/errors';
import {
  suggestClosest,
  suggestLayoutModifier,
  suggestButtonVariant,
  suggestButtonSize,
  suggestInputType,
} from '../../utils/suggestions';

// ============================================================
// Types
// ============================================================

export interface CodeAction {
  title: string;
  kind: 'quickfix' | 'refactor';
  edit?: {
    range: any; // Monaco IRange
    text: string;
  };
  command?: {
    id: string;
    title: string;
    arguments?: any[];
  };
}

// ============================================================
// Quick Fix Generators
// ============================================================

/**
 * Generate quick fixes for invalid component references
 */
function fixUndefinedComponent(
  monaco: Monaco,
  model: any,
  error: ProtoError
): CodeAction[] {
  if (!error.hint || !error.hint.startsWith('Did you mean')) return [];

  const suggestion = error.hint.match(/'([^']+)'/)?.[1];
  if (!suggestion) return [];

  const line = model.getLineContent(error.line || 1);
  const componentMatch = line.match(/\$([A-Z]\w*)/);
  if (!componentMatch) return [];

  const wrongName = componentMatch[1];
  const newLine = line.replace(`$${wrongName}`, `$${suggestion}`);

  return [
    {
      title: `Change to '${suggestion}'`,
      kind: 'quickfix',
      edit: {
        range: {
          startLineNumber: error.line || 1,
          startColumn: 1,
          endLineNumber: error.line || 1,
          endColumn: line.length + 1,
        },
        text: newLine,
      },
    },
  ];
}

/**
 * Generate quick fixes for invalid navigation targets
 */
function fixInvalidNavigation(
  monaco: Monaco,
  model: any,
  error: ProtoError
): CodeAction[] {
  if (!error.hint || !error.hint.startsWith('Did you mean')) return [];

  const suggestion = error.hint.match(/'([^']+)'/)?.[1];
  if (!suggestion) return [];

  const line = model.getLineContent(error.line || 1);
  const navMatch = line.match(/->([A-Z]\w*)/);
  if (!navMatch) return [];

  const wrongTarget = navMatch[1];
  const newLine = line.replace(`->${wrongTarget}`, `->${suggestion}`);

  return [
    {
      title: `Change navigation target to '${suggestion}'`,
      kind: 'quickfix',
      edit: {
        range: {
          startLineNumber: error.line || 1,
          startColumn: 1,
          endLineNumber: error.line || 1,
          endColumn: line.length + 1,
        },
        text: newLine,
      },
    },
  ];
}

/**
 * Generate quick fixes for invalid button variants
 */
function fixInvalidButtonVariant(
  monaco: Monaco,
  model: any,
  error: ProtoError
): CodeAction[] {
  if (!error.message.includes('Invalid modifier') && !error.message.includes('Invalid variant')) {
    return [];
  }

  const line = model.getLineContent(error.line || 1);
  const match = error.message.match(/Invalid (?:modifier|variant) '([^']+)'/);
  if (!match) return [];

  const wrongValue = match[1];
  const validVariants = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link', 'success', 'warning'];
  const suggestion = suggestClosest(wrongValue, validVariants);

  if (!suggestion) return [];

  const fixes: CodeAction[] = [];

  // Quick fix with suggestion
  const newLine = line.replace(new RegExp(`@${wrongValue}`), `@${suggestion}`);
  fixes.push({
    title: `Change to '@${suggestion}'`,
    kind: 'quickfix',
    edit: {
      range: {
        startLineNumber: error.line || 1,
        startColumn: 1,
        endLineNumber: error.line || 1,
        endColumn: line.length + 1,
      },
      text: newLine,
    },
  });

  // Show all valid options
  validVariants.forEach((variant) => {
    if (variant !== suggestion) {
      const altLine = line.replace(new RegExp(`@${wrongValue}`), `@${variant}`);
      fixes.push({
        title: `Change to '@${variant}'`,
        kind: 'quickfix',
        edit: {
          range: {
            startLineNumber: error.line || 1,
            startColumn: 1,
            endLineNumber: error.line || 1,
            endColumn: line.length + 1,
          },
          text: altLine,
        },
      });
    }
  });

  return fixes;
}

/**
 * Generate quick fixes for invalid button sizes
 */
function fixInvalidButtonSize(
  monaco: Monaco,
  model: any,
  error: ProtoError
): CodeAction[] {
  if (!error.message.includes('Invalid modifier') || !error.message.includes('Button')) {
    return [];
  }

  const line = model.getLineContent(error.line || 1);
  const match = error.message.match(/Invalid modifier '([^']+)'/);
  if (!match) return [];

  const wrongValue = match[1];
  const validSizes = ['xs', 'sm', 'md', 'lg'];

  // Check if it's actually a size error
  const buttonMatch = line.match(/@(\w+)(?:-(\w+))?/);
  if (!buttonMatch) return [];

  const fixes: CodeAction[] = [];

  // Provide all valid sizes
  validSizes.forEach((size) => {
    const newLine = line.replace(/@(\w+)(?:-\w+)?/, `@$1-${size}`);
    fixes.push({
      title: `Change size to '${size}'`,
      kind: 'quickfix',
      edit: {
        range: {
          startLineNumber: error.line || 1,
          startColumn: 1,
          endLineNumber: error.line || 1,
          endColumn: line.length + 1,
        },
        text: newLine,
      },
    });
  });

  return fixes;
}

/**
 * Generate quick fixes for invalid input types
 */
function fixInvalidInputType(
  monaco: Monaco,
  model: any,
  error: ProtoError
): CodeAction[] {
  if (!error.message.includes('Invalid input type')) return [];

  const match = error.message.match(/Invalid input type '([^']+)'/);
  if (!match) return [];

  const wrongType = match[1];
  const validTypes = ['text', 'email', 'password', 'number', 'date', 'textarea', 'select'];
  const suggestion = suggestClosest(wrongType, validTypes);

  if (!suggestion) return [];

  const line = model.getLineContent(error.line || 1);
  const fixes: CodeAction[] = [];

  // Quick fix with suggestion
  const newLine = line.replace(wrongType, suggestion);
  fixes.push({
    title: `Change to '${suggestion}'`,
    kind: 'quickfix',
    edit: {
      range: {
        startLineNumber: error.line || 1,
        startColumn: 1,
        endLineNumber: error.line || 1,
        endColumn: line.length + 1,
      },
      text: newLine,
    },
  });

  // Show other valid options
  validTypes.forEach((type) => {
    if (type !== suggestion) {
      const altLine = line.replace(wrongType, type);
      fixes.push({
        title: `Change to '${type}'`,
        kind: 'quickfix',
        edit: {
          range: {
            startLineNumber: error.line || 1,
            startColumn: 1,
            endLineNumber: error.line || 1,
            endColumn: line.length + 1,
          },
          text: altLine,
        },
      });
    }
  });

  return fixes;
}

/**
 * Generate quick fixes for missing required properties
 */
function fixMissingRequiredProps(
  monaco: Monaco,
  model: any,
  error: ProtoError
): CodeAction[] {
  if (!error.message.includes('missing required properties')) return [];

  const match = error.message.match(/missing required properties: (.+)/);
  if (!match) return [];

  const missingProps = match[1].split(', ');
  const line = model.getLineContent(error.line || 1);

  // Generate placeholder for missing props
  const propsText = missingProps.map(prop => `${prop}="value"`).join(' ');
  const newLine = line.trim().endsWith(':') ? line : `${line.trimEnd()}:`;
  const indent = line.match(/^[\t ]*/)?.[0] || '';
  const propIndent = indent + (indent.includes('\t') ? '\t' : '  ');

  return [
    {
      title: `Add missing properties: ${missingProps.join(', ')}`,
      kind: 'quickfix',
      edit: {
        range: {
          startLineNumber: error.line || 1,
          startColumn: 1,
          endLineNumber: error.line || 1,
          endColumn: line.length + 1,
        },
        text: newLine + '\n' + missingProps.map(prop => `${propIndent}${prop}: "value"`).join('\n'),
      },
    },
  ];
}

/**
 * Generate quick fixes for empty blocks
 */
function fixEmptyBlock(
  monaco: Monaco,
  model: any,
  error: ProtoError
): CodeAction[] {
  if (!error.message.includes('Empty')) return [];

  const line = model.getLineContent(error.line || 1);
  const indent = line.match(/^[\t ]*/)?.[0] || '';
  const contentIndent = indent + (indent.includes('\t') ? '\t' : '  ');

  const blockType = error.nodeType?.toLowerCase() || 'block';
  let placeholder = '';

  switch (blockType) {
    case 'screen':
    case 'modal':
    case 'drawer':
      placeholder = '# Title\n' + contentIndent + '> Description text';
      break;
    case 'component':
      placeholder = '> Component content';
      break;
    case 'container':
    case 'stack':
    case 'row':
    case 'grid':
    case 'card':
      placeholder = '> Layout content';
      break;
    default:
      placeholder = '> Content here';
  }

  return [
    {
      title: 'Add placeholder content',
      kind: 'quickfix',
      edit: {
        range: {
          startLineNumber: error.line || 1,
          startColumn: line.length + 1,
          endLineNumber: error.line || 1,
          endColumn: line.length + 1,
        },
        text: '\n' + contentIndent + placeholder,
      },
    },
    {
      title: 'Remove empty block',
      kind: 'quickfix',
      edit: {
        range: {
          startLineNumber: error.line || 1,
          startColumn: 1,
          endLineNumber: (error.line || 1) + 1,
          endColumn: 1,
        },
        text: '',
      },
    },
  ];
}

/**
 * Generate quick fixes for mixed indentation
 */
function fixMixedIndentation(
  monaco: Monaco,
  model: any,
  error: ProtoError
): CodeAction[] {
  if (!error.message.includes('indentation')) return [];

  const line = model.getLineContent(error.line || 1);
  const leadingWhitespace = line.match(/^[\t ]*/)?.[0] || '';
  const content = line.slice(leadingWhitespace.length);

  const fixes: CodeAction[] = [];

  // Convert to tabs
  const tabIndent = '\t'.repeat(Math.ceil(leadingWhitespace.length / 2));
  fixes.push({
    title: 'Convert to tabs',
    kind: 'quickfix',
    edit: {
      range: {
        startLineNumber: error.line || 1,
        startColumn: 1,
        endLineNumber: error.line || 1,
        endColumn: line.length + 1,
      },
      text: tabIndent + content,
    },
  });

  // Convert to spaces (2 spaces per indent level)
  const spaceIndent = '  '.repeat(Math.ceil(leadingWhitespace.length / 2));
  fixes.push({
    title: 'Convert to spaces',
    kind: 'quickfix',
    edit: {
      range: {
        startLineNumber: error.line || 1,
        startColumn: 1,
        endLineNumber: error.line || 1,
        endColumn: line.length + 1,
      },
      text: spaceIndent + content,
    },
  });

  return fixes;
}

// ============================================================
// Main Quick Fix Dispatcher
// ============================================================

/**
 * Generate quick fixes for an error
 */
function generateQuickFixes(
  monaco: Monaco,
  model: any,
  error: ProtoError
): CodeAction[] {
  const fixes: CodeAction[] = [];

  // Dispatch to specific fix generators based on error code and message
  switch (error.code) {
    case ERROR_CODES.REND_COMPONENT_ERROR:
      fixes.push(...fixUndefinedComponent(monaco, model, error));
      break;

    case ERROR_CODES.REND_INVALID_NAV:
      fixes.push(...fixInvalidNavigation(monaco, model, error));
      break;

    case ERROR_CODES.BLD_INVALID_MODIFIERS:
      if (error.nodeType === 'Button') {
        fixes.push(...fixInvalidButtonVariant(monaco, model, error));
        fixes.push(...fixInvalidButtonSize(monaco, model, error));
      }
      break;

    case ERROR_CODES.BLD_INVALID_PROPS:
      if (error.nodeType === 'Input') {
        fixes.push(...fixInvalidInputType(monaco, model, error));
      } else if (error.message.includes('CSS custom property')) {
        // CSS variable fixes could be added here
      }
      break;

    case ERROR_CODES.BLD_MISSING_REQUIRED:
      fixes.push(...fixMissingRequiredProps(monaco, model, error));
      break;

    case ERROR_CODES.EDIT_MONACO_ERROR:
      if (error.message.includes('Empty')) {
        fixes.push(...fixEmptyBlock(monaco, model, error));
      } else if (error.message.includes('indentation')) {
        fixes.push(...fixMixedIndentation(monaco, model, error));
      }
      break;
  }

  return fixes;
}

// ============================================================
// Monaco Integration
// ============================================================

/**
 * Register code actions provider with Monaco
 */
export function registerCodeActionsProvider(
  monaco: Monaco,
  languageId: string,
  getErrors: () => ProtoError[]
): void {
  monaco.languages.registerCodeActionProvider(languageId, {
    provideCodeActions: (model, range, context) => {
      const actions: any[] = [];

      // Get errors in the current range
      const errors = getErrors();
      const relevantErrors = errors.filter(
        (err) =>
          err.line &&
          err.line >= range.startLineNumber &&
          err.line <= range.endLineNumber
      );

      // Generate quick fixes for each error
      for (const error of relevantErrors) {
        const quickFixes = generateQuickFixes(monaco, model, error);

        for (const fix of quickFixes) {
          actions.push({
            title: fix.title,
            kind: fix.kind,
            diagnostics: context.markers,
            edit: fix.edit
              ? {
                  edits: [
                    {
                      resource: model.uri,
                      edit: fix.edit,
                    },
                  ],
                }
              : undefined,
            command: fix.command,
          });
        }
      }

      return {
        actions,
        dispose: () => {},
      };
    },
  });
}
