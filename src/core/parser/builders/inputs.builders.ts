/**
 * Input element builders for AST construction
 * Handles inputs, selects, radio buttons, and checkboxes
 */

type Context = {
  [key: string]: any;
};

/**
 * Build input element from context
 */
export function buildInputElement(ctx: Context) {
  if (!ctx.Input || !ctx.Input[0]) {
    return null;
  }

  const inputToken = ctx.Input[0];
  const inputText = inputToken.image;
  
  // Pattern: ___<type>: Label{placeholder}[options] | attributes
  const match = inputText.match(/___(?:(email|password|date|number|textarea))?:\s*([^{\[\|\n\r]+)(?:\{([^}]+)\})?(?:\[([^\]]+)\])?(?:\s*\|\s*(.+))?/);
  
  if (!match) {
    return null;
  }

  const [, typeMatch, labelMatch, placeholderMatch, optionsMatch, attributesMatch] = match;
  
  let kind = typeMatch || 'text'; // Default to text if no type specified
  const label = labelMatch ? labelMatch.trim() : '';
  const attributes: Record<string, any> = {};
  const flags: Record<string, boolean> = {};

  // Add placeholder if present
  if (placeholderMatch) {
    attributes.placeholder = placeholderMatch.trim();
  }

  // Check if it's a select (has options)
  let isSelect = false;
  if (optionsMatch) {
    isSelect = true;
    attributes.options = optionsMatch.split('|').map((opt: string) => opt.trim());
  }

  // Parse pipe-separated attributes
  if (attributesMatch) {
    const attrParts = attributesMatch.split('|').map((s: string) => s.trim());
    
    attrParts.forEach((part: string) => {
      // Check if it's a flag (no colon)
      if (/^(required|disabled|readonly|clearable|multiple|reveal-toggle)$/.test(part)) {
        if (part === 'required') flags.required = true;
        else if (part === 'disabled') flags.disabled = true;
        else if (part === 'readonly') flags.readonly = true;
        else if (part === 'clearable') flags.clearable = true;
        else if (part === 'multiple') flags.multiple = true;
        else if (part === 'reveal-toggle') flags.revealToggle = true;
      } else {
        // It's a key: value attribute
        const attrMatch = part.match(/([a-z]+):\s*(.+)/);
        if (attrMatch) {
          const [, key, value] = attrMatch;
          attributes[key.trim()] = value.trim();
        }
      }
    });
  }

  return {
    type: isSelect ? 'Select' : 'Input',
    id: "", // ID will be generated later
    props: {
      kind: isSelect ? 'select' : kind,
      label,
      attributes,
      flags
    },
    children: []
  };
}

/**
 * Build radio button group from context
 */
export function buildRadioButtonGroup(ctx: Context) {
  const options: any[] = [];

  if (ctx.RadioOption) {
    ctx.RadioOption.forEach((option: any) => {
      const optionText = option.image;
      // Match pattern: (x) Label or ( ) Label
      const match = optionText.match(/\(([xX ]?)\)\s+([^\n\r]+)/);
      
      if (match) {
        const isSelected = match[1].toLowerCase() === 'x';
        const label = match[2];
        
        options.push({
          label,
          selected: isSelected,
          value: label.toLowerCase().replace(/\s+/g, '_')
        });
      }
    });
  }

  return {
    type: "RadioOption",
    id: "", // ID will be generated later
    props: {
      options
    },
    children: []
  };
}

/**
 * Build checkbox element from context
 */
export function buildCheckboxElement(ctx: Context) {
  const checkboxText = ctx.Checkbox[0].image;
  
  // Match pattern: [x] Label or [ ] Label
  const match = checkboxText.match(/\[([ xX]?)\](?:\s+([^\n\r]+))?/);
  
  if (match) {
    const isChecked = match[1] && match[1].toLowerCase() === 'x';
    const label = match[2] || '';
    
    return {
      type: "Checkbox",
      id: "", // ID will be generated later
      props: {
        checked: isChecked,
        label: label.trim(),
        value: label.toLowerCase().replace(/\s+/g, '_')
      },
      children: []
    };
  }
  
  return {
    type: "Checkbox",
    id: "", // ID will be generated later
    props: {
      checked: false,
      label: '',
      value: ''
    },
    children: []
  };
}