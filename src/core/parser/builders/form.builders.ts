/**
 * Form element builders for AST construction
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
    const props: Record<string, any> = {
      type: isPassword ? 'password' : 'text',
      disabled: isDisabled
    };
    
    // Only add label if it exists
    if (labelMatch && labelMatch[1].trim()) {
      props.label = labelMatch[1].trim();
    }
    
    // Only add placeholder if it exists
    if (placeholderMatch && placeholderMatch[1].trim()) {
      props.placeholder = placeholderMatch[1].trim();
    }
    
    // Check if this is a select field (has pipe-separated options)
    if (content.includes('|')) {
      const options = content.split('|').map((opt: string) => opt.trim());
      return {
        type: "Select",
        props: {
          ...props,
          options,
          type: undefined // Remove type for select fields
        }
      };
    } else {
      // Regular input field - ignore single types like [text], [email], etc.
      return {
        type: "Input",
        props
      };
    }
  }
  
  return null;
}

/**
 * Build radio button group from context
 */
export function buildRadioButtonGroup(ctx: Context) {
  const options = ctx.RadioOption.map((option: any) => {
    const match = option.image.match(/\(([xX ]?)\)\s+([^\n\r]+)/);
    return {
      selected: match ? match[1].toLowerCase() === 'x' : false,
      label: match ? match[2].trim() : ''
    };
  });

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
  if (!ctx.Checkbox || !ctx.Checkbox[0]) {
    return null;
  }

  const checkboxText = ctx.Checkbox[0].image;
  const match = checkboxText.match(/\[([ xX]?)\](?:\s+([^\n\r]+))/);
  
  if (!match) {
    console.warn('Failed to parse checkbox:', checkboxText);
    return null;
  }

  const isChecked = match[1]?.toLowerCase() === 'x';
  const label = match[2] ? match[2].trim() : '';

  return {
    type: "Checkbox",
    props: {
      checked: isChecked,
      label: label
    }
  };
}