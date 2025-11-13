/**
 * Shadcn renderers for input nodes
 */

import { AstNode } from "../../../types/ast-node.js";
import { ImportManager } from "../import-manager.js";
import { ShadcnRenderContext } from "../types.js";

export function renderInput(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponents(["Input", "Label"]);

  const formProps = node.props as any;
  const name = formProps?.name || "input";
  const placeholder = formProps?.placeholder || "";
  const type = formProps?.type || "text";
  const label = formProps?.label || "";
  const required = formProps?.required === true;

  const inputElement = `<Input
  type="${type}"
  name="${name}"
  placeholder="${placeholder}"
  ${required ? "required" : ""}
/>`;

  if (label) {
    return `<div className="grid w-full items-center gap-1.5">
  <Label htmlFor="${name}">${label}</Label>
  ${inputElement}
</div>`;
  }

  return inputElement;
}

export function renderSelect(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponents([
    "Select",
    "SelectContent",
    "SelectItem",
    "SelectTrigger",
    "SelectValue",
    "Label",
  ]);

  const formProps = node.props as any;
  const name = formProps?.name || "select";
  const label = formProps?.label || "";
  const placeholder = formProps?.placeholder || "Select an option";
  const options = node.children || [];

  const optionElements = options
    .map((option) => {
      const optionProps = option.props as any;
      const value = optionProps?.value || optionProps?.text || "";
      const optionLabel = optionProps?.text || value;
      return `    <SelectItem value="${value}">${optionLabel}</SelectItem>`;
    })
    .join("\n");

  const selectElement = `<Select name="${name}">
  <SelectTrigger>
    <SelectValue placeholder="${placeholder}" />
  </SelectTrigger>
  <SelectContent>
${optionElements}
  </SelectContent>
</Select>`;

  if (label) {
    return `<div className="grid w-full items-center gap-1.5">
  <Label htmlFor="${name}">${label}</Label>
  ${selectElement}
</div>`;
  }

  return selectElement;
}

export function renderCheckbox(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponents(["Checkbox", "Label"]);

  const formProps = node.props as any;
  const name = formProps?.name || "checkbox";
  const label = formProps?.text || formProps?.label || "";
  const checked = formProps?.checked === true;

  return `<div className="flex items-center space-x-2">
  <Checkbox id="${name}" name="${name}" ${checked ? 'defaultChecked' : ''} />
  <Label htmlFor="${name}" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
    ${label}
  </Label>
</div>`;
}

export function renderRadioGroup(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  importManager.addShadcnComponents(["RadioGroup", "RadioGroupItem", "Label"]);

  const formProps = node.props as any;
  const name = formProps?.name || "radio-group";
  const label = formProps?.label || "";
  const options = node.children || [];

  const optionElements = options
    .map((option) => {
      const optionProps = option.props as any;
      const value = optionProps?.value || optionProps?.text || "";
      const optionLabel = optionProps?.text || value;
      return `    <div className="flex items-center space-x-2">
      <RadioGroupItem value="${value}" id="${name}-${value}" />
      <Label htmlFor="${name}-${value}">${optionLabel}</Label>
    </div>`;
    })
    .join("\n");

  const radioGroupElement = `<RadioGroup name="${name}">
${optionElements}
</RadioGroup>`;

  if (label) {
    return `<div className="grid w-full items-center gap-2">
  <Label>${label}</Label>
  ${radioGroupElement}
</div>`;
  }

  return radioGroupElement;
}

export function renderRadioOption(
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
): string {
  // This is handled by renderRadioGroup
  // Individual options are rendered within the parent RadioGroup
  return "";
}
