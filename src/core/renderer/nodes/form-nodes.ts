import { AstNode } from '../../../types/astNode';
import { elementStyles, getFormControlClasses } from './styles';

/**
 * Render input element
 */
export function renderInput(node: AstNode): string {
  const inputProps = node.props as any;
  let inputHtml = '';
  
  if (inputProps?.label) {
    inputHtml += `<label class="${elementStyles.label}">${inputProps.label}:${inputProps.required ? ' <span class="text-red-500">*</span>' : ''}\n`;
  }
  
  inputHtml += `  <input class="${elementStyles.input}" placeholder="${inputProps?.placeholder || ''}" />`;

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
        <input type="radio" name="${radioName}" ${option.selected ? 'checked' : ''} class="${elementStyles.radio}" />
        <span class="text-gray-700 dark:text-gray-300">${option.label}</span>
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
    selectHtml += `<label class="${elementStyles.label}">${selectProps.label}:${selectProps.required ? ' <span class="text-red-500">*</span>' : ''}\n`;
  }
  
  const optionsHtml = (selectProps?.options || [])
    .map((option: string) => {
      if (selectProps?.placeholder && option === selectProps.options[0]) {
        return `<option value="" disabled selected>${selectProps.placeholder}</option>
<option value="${option}">${option}</option>`;
      }
      return `<option value="${option}">${option}</option>`;
    })
    .join('\n');
  
  selectHtml += `  <select class="${elementStyles.select}">${optionsHtml}</select>`;
  
  if (selectProps?.label) {
    selectHtml += '\n</label>';
  }
  
  return selectHtml;
}

/**
 * Render checkbox element
 */
export function renderCheckbox(node: AstNode): string {
  const props = node.props as any;
  const checked = props?.checked || false;
  const label = props?.label || '';
  return `
    <label class="${getFormControlClasses()}">
      <input type="checkbox" ${checked ? 'checked' : ''} class="${elementStyles.checkbox}" />
      <span class="text-gray-700 dark:text-gray-300">${label}</span>
    </label>
  `;
}
