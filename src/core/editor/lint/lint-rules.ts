/**
 * LSP Lint Rules - Expanded Validation
 *
 * Advanced semantic validation rules for the proto-typed DSL.
 * These rules run after parsing and provide context-aware error checking.
 *
 * @version 0.0.2
 */

import type { ProtoError } from '../../../types/errors';
import { ERROR_CODES } from '../../../types/errors';
import { suggestClosest } from '../../utils/suggestions';

// ============================================================
// Types
// ============================================================

export interface LintContext {
  /** Source code text */
  source: string;
  /** Parsed AST (if available) */
  ast?: any;
  /** Line-by-line content */
  lines: string[];
  /** Existing errors from other stages */
  existingErrors: ProtoError[];
}

export interface LintRule {
  /** Unique rule ID */
  id: string;
  /** Rule description */
  description: string;
  /** Rule category */
  category: 'naming' | 'structure' | 'style' | 'reference' | 'best-practice';
  /** Execute the rule */
  check: (context: LintContext) => ProtoError[];
}

// ============================================================
// Rule: Duplicate View Names
// ============================================================

export const duplicateViewNamesRule: LintRule = {
  id: 'duplicate-view-names',
  description: 'Check for duplicate screen/modal/drawer names',
  category: 'naming',
  check: (context) => {
    const errors: ProtoError[] = [];
    const viewNames = new Map<string, { line: number; type: string }>();
    const viewRegex = /^(screen|modal|drawer)\s+([A-Z]\w*)\s*:/i;

    context.lines.forEach((line, idx) => {
      const match = line.match(viewRegex);
      if (match) {
        const [, type, name] = match;
        const lineNum = idx + 1;

        if (viewNames.has(name)) {
          const prev = viewNames.get(name)!;
          errors.push({
            stage: 'editor',
            severity: 'error',
            code: ERROR_CODES.BLD_INVALID_PROPS,
            message: `Duplicate ${type} name '${name}' (previously defined as ${prev.type} on line ${prev.line})`,
            hint: 'Each view must have a unique name',
            line: lineNum,
            column: line.indexOf(name) + 1,
            nodeType: type,
          });
        } else {
          viewNames.set(name, { line: lineNum, type });
        }
      }
    });

    return errors;
  },
};

// ============================================================
// Rule: Duplicate Component Names
// ============================================================

export const duplicateComponentNamesRule: LintRule = {
  id: 'duplicate-component-names',
  description: 'Check for duplicate component definitions',
  category: 'naming',
  check: (context) => {
    const errors: ProtoError[] = [];
    const componentNames = new Map<string, number>();
    const componentRegex = /^component\s+([A-Z]\w*)\s*:/i;

    context.lines.forEach((line, idx) => {
      const match = line.match(componentRegex);
      if (match) {
        const [, name] = match;
        const lineNum = idx + 1;

        if (componentNames.has(name)) {
          const prevLine = componentNames.get(name)!;
          errors.push({
            stage: 'editor',
            severity: 'error',
            code: ERROR_CODES.BLD_INVALID_PROPS,
            message: `Duplicate component name '${name}' (previously defined on line ${prevLine})`,
            hint: 'Each component must have a unique name',
            line: lineNum,
            column: line.indexOf(name) + 1,
            nodeType: 'Component',
          });
        } else {
          componentNames.set(name, lineNum);
        }
      }
    });

    return errors;
  },
};

// ============================================================
// Rule: Undefined Component References
// ============================================================

export const undefinedComponentReferencesRule: LintRule = {
  id: 'undefined-component-references',
  description: 'Check for component instances without definitions',
  category: 'reference',
  check: (context) => {
    const errors: ProtoError[] = [];

    // Find all component definitions
    const definedComponents = new Set<string>();
    const componentDefRegex = /^component\s+([A-Z]\w*)\s*:/i;
    context.lines.forEach((line) => {
      const match = line.match(componentDefRegex);
      if (match) {
        definedComponents.add(match[1]);
      }
    });

    // Find all component instances
    const instanceRegex = /\$([A-Z]\w*)/g;
    context.lines.forEach((line, idx) => {
      let match;
      while ((match = instanceRegex.exec(line)) !== null) {
        const componentName = match[1];
        if (!definedComponents.has(componentName)) {
          const suggestion = suggestClosest(componentName, Array.from(definedComponents));
          errors.push({
            stage: 'editor',
            severity: 'error',
            code: ERROR_CODES.REND_COMPONENT_ERROR,
            message: `Component '${componentName}' is not defined`,
            hint: suggestion ? `Did you mean '${suggestion}'?` : 'Define this component before using it',
            line: idx + 1,
            column: match.index + 1,
            nodeType: 'ComponentInstance',
          });
        }
      }
    });

    return errors;
  },
};

// ============================================================
// Rule: Invalid Navigation Targets
// ============================================================

export const invalidNavigationTargetsRule: LintRule = {
  id: 'invalid-navigation-targets',
  description: 'Check if button actions reference existing screens',
  category: 'reference',
  check: (context) => {
    const errors: ProtoError[] = [];

    // Find all screen names
    const screens = new Set<string>();
    const screenRegex = /^screen\s+([A-Z]\w*)\s*:/i;
    context.lines.forEach((line) => {
      const match = line.match(screenRegex);
      if (match) {
        screens.add(match[1]);
      }
    });

    // Find all button actions with -> navigation
    const actionRegex = /->([A-Z]\w*)/g;
    context.lines.forEach((line, idx) => {
      let match;
      while ((match = actionRegex.exec(line)) !== null) {
        const targetScreen = match[1];
        if (!screens.has(targetScreen)) {
          const suggestion = suggestClosest(targetScreen, Array.from(screens));
          errors.push({
            stage: 'editor',
            severity: 'warning',
            code: ERROR_CODES.REND_INVALID_NAV,
            message: `Navigation target '${targetScreen}' screen not found`,
            hint: suggestion ? `Did you mean '${suggestion}'?` : 'Define the target screen first',
            line: idx + 1,
            column: match.index + 1,
            nodeType: 'ButtonAction',
          });
        }
      }
    });

    return errors;
  },
};

// ============================================================
// Rule: Inconsistent Indentation
// ============================================================

export const inconsistentIndentationRule: LintRule = {
  id: 'inconsistent-indentation',
  description: 'Check for inconsistent indentation (mixing tabs and spaces)',
  category: 'style',
  check: (context) => {
    const errors: ProtoError[] = [];
    let usesSpaces: boolean | null = null;
    let usesTabs: boolean | null = null;

    context.lines.forEach((line, idx) => {
      if (line.length === 0 || line.trim().length === 0) return;

      const leadingWhitespace = line.match(/^[\t ]*/)?.[0] || '';
      if (leadingWhitespace.length === 0) return;

      const hasSpaces = /^ +/.test(leadingWhitespace);
      const hasTabs = /^\t+/.test(leadingWhitespace);

      if (hasSpaces && hasTabs) {
        errors.push({
          stage: 'editor',
          severity: 'warning',
          code: ERROR_CODES.EDIT_MONACO_ERROR,
          message: 'Mixed tabs and spaces in indentation',
          hint: 'Use either tabs or spaces consistently',
          line: idx + 1,
          column: 1,
        });
      }

      if (hasSpaces) usesSpaces = true;
      if (hasTabs) usesTabs = true;

      if (usesSpaces && usesTabs && !(/^ +/.test(leadingWhitespace) && /\t/.test(leadingWhitespace))) {
        // File uses both but this specific line doesn't mix them
        // Warn about file-level inconsistency (only once per file)
        if (idx === context.lines.findIndex((l, i) =>
          i > 0 && l.match(/^[\t ]+/) &&
          ((usesSpaces && /^\t/.test(l)) || (usesTabs && /^ /.test(l)))
        )) {
          errors.push({
            stage: 'editor',
            severity: 'info',
            code: ERROR_CODES.EDIT_MONACO_ERROR,
            message: 'File uses both tabs and spaces for indentation',
            hint: 'Consider using a consistent indentation style throughout the file',
            line: idx + 1,
            column: 1,
          });
        }
      }
    });

    return errors;
  },
};

// ============================================================
// Rule: Empty Blocks
// ============================================================

export const emptyBlocksRule: LintRule = {
  id: 'empty-blocks',
  description: 'Warn about empty view or component blocks',
  category: 'best-practice',
  check: (context) => {
    const errors: ProtoError[] = [];

    for (let i = 0; i < context.lines.length; i++) {
      const line = context.lines[i];
      const blockMatch = line.match(/^(screen|modal|drawer|component|container|stack|row|grid|card)\s+([A-Z]\w*)?\s*:?\s*$/i);

      if (blockMatch) {
        // Check if next non-empty line is at same or lower indentation
        const currentIndent = line.match(/^[\t ]*/)?.[0].length || 0;
        let isEmpty = true;

        for (let j = i + 1; j < context.lines.length; j++) {
          const nextLine = context.lines[j];
          if (nextLine.trim().length === 0) continue;

          const nextIndent = nextLine.match(/^[\t ]*/)?.[0].length || 0;
          if (nextIndent > currentIndent) {
            isEmpty = false;
            break;
          }
          if (nextIndent <= currentIndent) {
            break;
          }
        }

        if (isEmpty) {
          errors.push({
            stage: 'editor',
            severity: 'info',
            code: ERROR_CODES.EDIT_MONACO_ERROR,
            message: `Empty ${blockMatch[1]} block`,
            hint: 'Add content or remove this block',
            line: i + 1,
            column: 1,
            nodeType: blockMatch[1],
          });
        }
      }
    }

    return errors;
  },
};

// ============================================================
// Rule: Invalid CSS Variable Names
// ============================================================

export const invalidCssVariableNamesRule: LintRule = {
  id: 'invalid-css-variable-names',
  description: 'Check for invalid CSS custom property names',
  category: 'style',
  check: (context) => {
    const errors: ProtoError[] = [];
    const cssVarRegex = /--([\w-]*)/g;

    context.lines.forEach((line, idx) => {
      let match;
      while ((match = cssVarRegex.exec(line)) !== null) {
        const varName = match[1];

        // CSS variables should not be empty
        if (varName.length === 0) {
          errors.push({
            stage: 'editor',
            severity: 'error',
            code: ERROR_CODES.BLD_INVALID_PROPS,
            message: 'CSS custom property name cannot be empty',
            hint: 'Use format: --property-name',
            line: idx + 1,
            column: match.index + 1,
          });
        }

        // Warn about potentially invalid patterns
        if (varName.startsWith('-') || varName.endsWith('-')) {
          errors.push({
            stage: 'editor',
            severity: 'warning',
            code: ERROR_CODES.BLD_INVALID_PROPS,
            message: `CSS custom property '--${varName}' has leading or trailing hyphen`,
            hint: 'CSS variable names should not start or end with hyphens',
            line: idx + 1,
            column: match.index + 1,
          });
        }

        // Check for invalid characters (should be alphanumeric, hyphen, or underscore)
        if (!/^[\w-]+$/.test(varName)) {
          errors.push({
            stage: 'editor',
            severity: 'error',
            code: ERROR_CODES.BLD_INVALID_PROPS,
            message: `CSS custom property '--${varName}' contains invalid characters`,
            hint: 'Use only letters, numbers, hyphens, and underscores',
            line: idx + 1,
            column: match.index + 1,
          });
        }
      }
    });

    return errors;
  },
};

// ============================================================
// Rule: Unreachable Screens
// ============================================================

export const unreachableScreensRule: LintRule = {
  id: 'unreachable-screens',
  description: 'Warn about screens that cannot be navigated to',
  category: 'best-practice',
  check: (context) => {
    const errors: ProtoError[] = [];

    // Find all screens
    const screens = new Map<string, number>();
    const screenRegex = /^screen\s+([A-Z]\w*)\s*:/i;
    context.lines.forEach((line, idx) => {
      const match = line.match(screenRegex);
      if (match) {
        screens.set(match[1], idx + 1);
      }
    });

    // Find all navigation targets
    const referencedScreens = new Set<string>();
    const actionRegex = /->([A-Z]\w*)/g;
    context.lines.forEach((line) => {
      let match;
      while ((match = actionRegex.exec(line)) !== null) {
        referencedScreens.add(match[1]);
      }
    });

    // First screen is always reachable (entry point)
    const firstScreen = context.lines.find(line => screenRegex.test(line))?.match(screenRegex)?.[1];
    if (firstScreen) {
      referencedScreens.add(firstScreen);
    }

    // Check for unreferenced screens
    screens.forEach((lineNum, screenName) => {
      if (!referencedScreens.has(screenName)) {
        errors.push({
          stage: 'editor',
          severity: 'info',
          code: ERROR_CODES.EDIT_MONACO_ERROR,
          message: `Screen '${screenName}' is not referenced by any navigation`,
          hint: screenName === firstScreen ? 'This is the entry point' : 'Consider adding navigation to this screen or removing it',
          line: lineNum,
          column: 1,
          nodeType: 'Screen',
        });
      }
    });

    return errors;
  },
};

// ============================================================
// Export All Rules
// ============================================================

export const ALL_LINT_RULES: LintRule[] = [
  duplicateViewNamesRule,
  duplicateComponentNamesRule,
  undefinedComponentReferencesRule,
  invalidNavigationTargetsRule,
  inconsistentIndentationRule,
  emptyBlocksRule,
  invalidCssVariableNamesRule,
  unreachableScreensRule,
];

// ============================================================
// Lint Runner
// ============================================================

/**
 * Run all lint rules on the given context
 */
export function runLintRules(context: LintContext): ProtoError[] {
  const allErrors: ProtoError[] = [];

  for (const rule of ALL_LINT_RULES) {
    try {
      const ruleErrors = rule.check(context);
      allErrors.push(...ruleErrors);
    } catch (err) {
      console.error(`Error running lint rule ${rule.id}:`, err);
    }
  }

  return allErrors;
}

/**
 * Run specific lint rules by category
 */
export function runLintRulesByCategory(
  context: LintContext,
  categories: LintRule['category'][]
): ProtoError[] {
  const rules = ALL_LINT_RULES.filter(rule => categories.includes(rule.category));
  const allErrors: ProtoError[] = [];

  for (const rule of rules) {
    try {
      const ruleErrors = rule.check(context);
      allErrors.push(...ruleErrors);
    } catch (err) {
      console.error(`Error running lint rule ${rule.id}:`, err);
    }
  }

  return allErrors;
}
