import { AstNode } from '../../../types/ast-node';
import { ImportManager } from '../infrastructure/import-manager';

/**
 * Convert Input AST node to shadcn Input component
 */
export function redeemInput(node: AstNode, importManager: ImportManager): string {
  const props = node.props as any;
  const { label, placeholder, value, password } = props;

  importManager.addShadcnComponent('Input');
  importManager.addReactImport('useState');

  const inputProps: string[] = [];
  if (placeholder) {
    inputProps.push(`placeholder="${placeholder}"`);
  }
  if (password) {
    inputProps.push(`type="password"`);
  }

  const propsString = inputProps.length > 0 ? ' ' + inputProps.join(' ') : '';

  if (label) {
    return `<div className="space-y-2">
  <label className="text-sm font-medium">${label}</label>
  <Input${propsString} />
</div>`;
  }

  return `<Input${propsString} />`;
}

/**
 * Convert Select AST node to shadcn Select component
 */
export function redeemSelect(node: AstNode, importManager: ImportManager): string {
  const props = node.props as any;
  const { label, placeholder = 'Select option', options = [] } = props;

  // Add all Select-related components
  importManager.addShadcnComponent('Select');
  importManager.addShadcnComponent('SelectTrigger');
  importManager.addShadcnComponent('SelectValue');
  importManager.addShadcnComponent('SelectContent');
  importManager.addShadcnComponent('SelectItem');
  importManager.addReactImport('useState');

  const optionsJsx = options.map((opt: string) =>
    `    <SelectItem value="${opt.toLowerCase()}">${opt}</SelectItem>`
  ).join('\n');

  const selectComponent = `<Select>
  <SelectTrigger>
    <SelectValue placeholder="${placeholder}" />
  </SelectTrigger>
  <SelectContent>
${optionsJsx}
  </SelectContent>
</Select>`;

  if (label) {
    return `<div className="space-y-2">
  <label className="text-sm font-medium">${label}</label>
  ${selectComponent}
</div>`;
  }

  return selectComponent;
}

/**
 * Convert Checkbox AST node to shadcn Checkbox component
 */
export function redeemCheckbox(node: AstNode, importManager: ImportManager): string {
  const props = node.props as any;
  const { label, checked } = props;

  importManager.addShadcnComponent('Checkbox');
  importManager.addReactImport('useState');

  return `<div className="flex items-center space-x-2">
  <Checkbox id="${label?.toLowerCase().replace(/\s/g, '-')}" ${checked ? 'defaultChecked' : ''} />
  <label htmlFor="${label?.toLowerCase().replace(/\s/g, '-')}" className="text-sm font-medium">
    ${label || 'Checkbox'}
  </label>
</div>`;
}

/**
 * Convert RadioOption AST node to Radio component
 */
export function redeemRadioOption(node: AstNode, importManager: ImportManager): string {
  const props = node.props as any;
  const { label, value } = props;

  return `<div className="flex items-center space-x-2">
  <input type="radio" id="${value}" value="${value}" className="h-4 w-4" />
  <label htmlFor="${value}" className="text-sm font-medium">
    ${label || value}
  </label>
</div>`;
}
