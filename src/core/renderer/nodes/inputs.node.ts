import { AstNode } from '../../../types/ast-node';
import { elementStyles, getFormControlClasses, getInputInlineStyles, getLabelInlineStyles, getSelectInlineStyles, getCheckboxInlineStyles, getRadioInlineStyles } from './styles/styles';

/**
 * Render input element
 */
export function renderInput(node: AstNode): string {
  const inputProps = node.props as any;
  let inputHtml = '';
  
  if (inputProps?.label) {
    inputHtml += `<label class="${elementStyles.label}" style="${getLabelInlineStyles()}">${inputProps.label}:${inputProps.flags?.required ? ' <span style="color: var(--destructive);">*</span>' : ''}\n`;
  }
  
  inputHtml += `  <input type="${inputProps.kind}" class="${elementStyles.input}" style="${getInputInlineStyles()}" placeholder="${inputProps?.attributes?.placeholder || ''}" />`;

  if (inputProps?.label) {
    inputHtml += '\n</label>';
  }
  
  return inputHtml;
}

/**
 * Render radio group element
 */
export function renderRadioGroup(node: AstNode): string {
  const props = node.props as any;
  const radioName = `radio-group-${Math.random().toString(36).substring(7)}`;
  const radioOptions = (props?.options || [])
    .map((option: { label: string, selected: boolean }) => `
      <label class="${getFormControlClasses()} mb-2">
        <input type="radio" name="${radioName}" ${option.selected ? 'checked' : ''} class="${elementStyles.radio}" style="${getRadioInlineStyles()}" />
        <span style="color: var(--foreground);">${option.label}</span>
      </label>
    `)
    .join('\n');
  return `<div class="space-y-2">${radioOptions}</div>`;
}

/**
 * Render select element
 */
export function renderSelect(node: AstNode): string {
  const selectProps = node.props as any;
  let selectHtml = '';
  
  if (selectProps?.label) {
    selectHtml += `<label class="${elementStyles.label}" style="${getLabelInlineStyles()}">${selectProps.label}:${selectProps.required ? ' <span style="color: var(--destructive);">*</span>' : ''}\n`;
  }
  
  const selectOptions = (selectProps?.options || [])
    .map((option: string) => `<option value="${option}">${option}</option>`)
    .join('\n');
    
  selectHtml += `  <select class="${elementStyles.select}" style="${getSelectInlineStyles()}">\n${selectOptions}\n  </select>`;

  if (selectProps?.label) {
    selectHtml += '\n</label>';
  }
  
  return selectHtml;
}

/**
 * Render checkbox element
 */
export function renderCheckbox(node: AstNode): string {
  const checkboxProps = node.props as any;
  const checked = checkboxProps?.checked ? 'checked' : '';
  
  return `<label class="${getFormControlClasses()}">
    <input type="checkbox" ${checked} class="${elementStyles.checkbox}" style="${getCheckboxInlineStyles()}" />
    <span style="color: var(--foreground);">${checkboxProps?.label || ''}</span>
  </label>`;
}