/**
 * Builder Validation Helpers
 * 
 * Utilities for semantic validation during AST building.
 * Collects errors instead of throwing to enable partial AST construction.
 */

import type { ProtoError } from '@shared'; //errors';
import { ERROR_CODES } from '@shared'; //errors';

/**
 * Get error collection array from builder visitor instance
 */
export function getBuilderErrors(visitor: any): ProtoError[] {
  if (!visitor.__builderErrors) {
    visitor.__builderErrors = [];
  }
  return visitor.__builderErrors;
}

/**
 * Add error to builder error collection
 */
export function addBuilderError(visitor: any, error: ProtoError) {
  const errors = getBuilderErrors(visitor);
  errors.push(error);
}

/**
 * Validate that required props exist
 * Returns true if valid, false otherwise (and adds error)
 */
export function validateRequiredProps(
  visitor: any,
  props: Record<string, any>,
  required: string[],
  nodeType: string,
  line?: number,
  column?: number
): boolean {
  const missing = required.filter(key => !props[key] || props[key] === '');
  
  if (missing.length > 0) {
    addBuilderError(visitor, {
      stage: 'builder',
      severity: 'error',
      code: ERROR_CODES.BLD_MISSING_REQUIRED,
      message: `${nodeType} missing required properties: ${missing.join(', ')}`,
      nodeType,
      line,
      column,
    });
    return false;
  }
  
  return true;
}

/**
 * Validate layout modifier format
 * Returns validated modifier or default (and adds error if invalid)
 */
export function validateLayoutModifier(
  visitor: any,
  modifier: string | undefined,
  validValues: string[],
  defaultValue: string,
  nodeType: string,
  line?: number,
  column?: number
): string {
  if (!modifier) return defaultValue;
  
  if (!validValues.includes(modifier)) {
    addBuilderError(visitor, {
      stage: 'builder',
      severity: 'warning',
      code: ERROR_CODES.BLD_INVALID_MODIFIERS,
      message: `Invalid modifier '${modifier}' for ${nodeType}. Valid values: ${validValues.join(', ')}`,
      hint: `Using default: ${defaultValue}`,
      nodeType,
      line,
      column,
    });
    return defaultValue;
  }
  
  return modifier;
}

/**
 * Validate button variant
 */
export function validateButtonVariant(
  visitor: any,
  variant: string | undefined,
  line?: number,
  column?: number
): string {
  const validVariants = [
    'primary', 'secondary', 'outline', 'ghost', 
    'destructive', 'link', 'success', 'warning'
  ];
  
  return validateLayoutModifier(
    visitor,
    variant,
    validVariants,
    'primary',
    'Button',
    line,
    column
  );
}

/**
 * Validate button size
 */
export function validateButtonSize(
  visitor: any,
  size: string | undefined,
  line?: number,
  column?: number
): string {
  const validSizes = ['xs', 'sm', 'md', 'lg'];
  
  return validateLayoutModifier(
    visitor,
    size,
    validSizes,
    'md',
    'Button',
    line,
    column
  );
}

/**
 * Validate input type
 */
export function validateInputType(
  visitor: any,
  inputType: string | undefined,
  line?: number,
  column?: number
): string {
  const validTypes = [
    'text', 'email', 'password', 'number', 
    'date', 'textarea', 'select'
  ];
  
  if (!inputType) return 'text';
  
  if (!validTypes.includes(inputType)) {
    addBuilderError(visitor, {
      stage: 'builder',
      severity: 'warning',
      code: ERROR_CODES.BLD_INVALID_PROPS,
      message: `Invalid input type '${inputType}'. Valid types: ${validTypes.join(', ')}`,
      hint: 'Using default: text',
      nodeType: 'Input',
      line,
      column,
    });
    return 'text';
  }
  
  return inputType;
}

/**
 * Validate prop value matches expected type
 */
export function validatePropType(
  visitor: any,
  propName: string,
  propValue: any,
  expectedType: 'string' | 'number' | 'boolean' | 'array',
  nodeType: string,
  line?: number,
  column?: number
): boolean {
  const actualType = Array.isArray(propValue) ? 'array' : typeof propValue;
  
  if (actualType !== expectedType) {
    addBuilderError(visitor, {
      stage: 'builder',
      severity: 'warning',
      code: ERROR_CODES.BLD_INVALID_PROPS,
      message: `Property '${propName}' in ${nodeType} should be ${expectedType}, got ${actualType}`,
      nodeType,
      line,
      column,
    });
    return false;
  }
  
  return true;
}

/**
 * Validate component name format
 * Component names must start with uppercase letter
 */
export function validateComponentName(
  visitor: any,
  name: string,
  line?: number,
  column?: number
): boolean {
  if (!name) {
    addBuilderError(visitor, {
      stage: 'builder',
      severity: 'error',
      code: ERROR_CODES.BLD_MISSING_REQUIRED,
      message: 'Component name is required',
      nodeType: 'Component',
      line,
      column,
    });
    return false;
  }
  
  if (!/^[A-Z][a-zA-Z0-9_]*$/.test(name)) {
    addBuilderError(visitor, {
      stage: 'builder',
      severity: 'error',
      code: ERROR_CODES.BLD_INVALID_PROPS,
      message: `Component name '${name}' must start with uppercase letter and contain only letters, numbers, and underscores`,
      nodeType: 'Component',
      line,
      column,
    });
    return false;
  }
  
  return true;
}

/**
 * Validate screen/modal/drawer name format
 * View names must start with uppercase letter
 */
export function validateViewName(
  visitor: any,
  name: string,
  viewType: 'Screen' | 'Modal' | 'Drawer',
  line?: number,
  column?: number
): boolean {
  if (!name) {
    addBuilderError(visitor, {
      stage: 'builder',
      severity: 'error',
      code: ERROR_CODES.BLD_MISSING_REQUIRED,
      message: `${viewType} name is required`,
      nodeType: viewType,
      line,
      column,
    });
    return false;
  }
  
  if (!/^[A-Z][a-zA-Z0-9_]*$/.test(name)) {
    addBuilderError(visitor, {
      stage: 'builder',
      severity: 'error',
      code: ERROR_CODES.BLD_INVALID_PROPS,
      message: `${viewType} name '${name}' must start with uppercase letter and contain only letters, numbers, and underscores`,
      nodeType: viewType,
      line,
      column,
    });
    return false;
  }
  
  return true;
}
