import { AstNode } from '../../../types/ast-node';
import { elementStyles, getFormControlClasses, getInputInlineStyles, getLabelInlineStyles, getSelectInlineStyles, getCheckboxInlineStyles, getRadioInlineStyles } from './styles/styles';

/**
 * @function renderInput
 * @description Renders an 'Input' AST node to its HTML representation.
 * This can be a standard input field or a textarea.
 *
 * @param {AstNode} node - The 'Input' AST node.
 * @returns {string} The HTML string for the input element.
 */
export function renderInput(node: AstNode): string {
  const inputProps = node.props as any;
  let inputHtml = '';
  
  if (inputProps?.label) {
    inputHtml += `<label class="${elementStyles.label}" style="${getLabelInlineStyles()}">${inputProps.label}:\n`;
  }
  
  if(inputProps?.kind === 'textarea') {
    inputHtml += `  <textarea class="${elementStyles.textarea}"
    cols="${inputProps?.attributes?.cols || 30}"
    rows="${inputProps?.attributes?.rows || 10}"
    style="${getInputInlineStyles()}" placeholder="${inputProps?.attributes?.placeholder || ''}"></textarea>`;
  } else  {
  inputHtml += `  <input type="${inputProps.kind}" class="${elementStyles.input}" style="${getInputInlineStyles()}" placeholder="${inputProps?.attributes?.placeholder || ''}" />`;
  }

  if (inputProps?.label) {
    inputHtml += '\n</label>';
  }
  
  return inputHtml;
}

/**
 * @function renderRadioGroup
 * @description Renders a 'RadioOption' AST node, which represents a group of radio buttons.
 *
 * @param {AstNode} node - The 'RadioOption' AST node.
 * @returns {string} The HTML string for the radio button group.
 */
export function renderRadioGroup(node: AstNode): string {
  const props = node.props as any;
  const radioName = `radio-group-${Math.random().toString(36).substring(7)}`;
  const radioOptions = (props?.options || [])
    .map((option: { label: string, selected: boolean }) => `
      <label class="${getFormControlClasses()}">
        <input type="radio" name="${radioName}" ${option.selected ? 'checked' : ''} class="${elementStyles.radio}" style="${getRadioInlineStyles()}" />
        <span style="color: var(--foreground);">${option.label}</span>
      </label>
    `)
    .join('\n');
  return `<div class="space-y-2">${radioOptions}</div>`;
}

/**
 * @function renderSelect
 * @description Renders a 'Select' AST node to its HTML representation, which is a dropdown menu.
 *
 * @param {AstNode} node - The 'Select' AST node.
 * @returns {string} The HTML string for the select element.
 */
export function renderSelect(node: AstNode): string {
  const selectProps = node.props as any;
  let selectHtml = '';
  
  if (selectProps?.label) {
    selectHtml += `<label class="${elementStyles.label}" style="${getLabelInlineStyles()}">${selectProps.label}:\n`;
  }
  
  const selectOptions = (selectProps?.attributes?.options || [])
    .map((option: string) => `<option value="${option}">${option}</option>`)
    .join('\n');
    
  selectHtml += `  <select class="${elementStyles.select}" style="${getSelectInlineStyles()}">\n${selectOptions}\n  </select>`;

  if (selectProps?.label) {
    selectHtml += '\n</label>';
  }
  
  return selectHtml;
}

/**
 * @function renderCheckbox
 * @description Renders a 'Checkbox' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Checkbox' AST node.
 * @returns {string} The HTML string for the checkbox element.
 */
export function renderCheckbox(node: AstNode): string {
  const checkboxProps = node.props as any;
  const checked = checkboxProps?.checked ? 'checked' : '';
  
  return `<label class="${getFormControlClasses()}">
    <input type="checkbox" ${checked} class="${elementStyles.checkbox}" style="${getCheckboxInlineStyles()}" />
    <span style="color: var(--foreground);">${checkboxProps?.label || ''}</span>
  </label>`;
}
