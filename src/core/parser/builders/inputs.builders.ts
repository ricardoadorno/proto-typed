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
  // Handle new input format
  if (ctx.Input) {
    const inputText = ctx.Input[0].image;
    
    const isPassword = inputText.includes('___*');
    const isDisabled = inputText.includes('___-');
    
    // Extract optional label if present
    const labelMatch = inputText.match(/:([^{(\[]+)(?=\{|\(|\[|$)/);
    // Extract optional placeholder if present
    const placeholderMatch = inputText.match(/\{([^}]+)\}/);
    
    // Extract optional type or options if present
    const contentMatch = inputText.match(/\[([^\]]*)\]/);
    const content = contentMatch ? contentMatch[1].trim() : '';
    
    // Default props that will always be included
    const props: any = {
      type: isPassword ? 'password' : 'text',
      disabled: isDisabled,
      label: labelMatch ? labelMatch[1].trim() : '',
      placeholder: placeholderMatch ? placeholderMatch[1] : ''
    };

    // Check if content contains options (indicates select field)
    if (content && content.includes('|')) {
      // This is a select field with options
      const options = content.split('|').map((opt: string) => opt.trim()).filter((opt: string) => opt.length > 0);
      
      return {
        type: "Select",
        props: {
          ...props,
          type: 'select',
          options
        }
      };
    } else if (content) {
      // Single content, could be a type or validation rule
      props.inputType = content;
    }

    return {
      type: "Input",
      props
    };
  }

  return null;
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
    type: "RadioGroup",
    props: {
      options
    }
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
      props: {
        checked: isChecked,
        label: label.trim(),
        value: label.toLowerCase().replace(/\s+/g, '_')
      }
    };
  }
  
  return {
    type: "Checkbox",
    props: {
      checked: false,
      label: '',
      value: ''
    }
  };
}