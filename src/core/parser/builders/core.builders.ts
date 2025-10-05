/**
 * Core utility builders for AST construction
 * Contains helper methods for parsing and processing DSL elements
 */

/**
 * Parse layout modifiers from token image like "col-w50-center-stretch-p4"
 * Returns structured modifiers object for CSS generation
 */
export function parseLayoutModifiers(tokenImage: string) {
  const modifiers: any = {};
  
  // Extract modifiers from token image (e.g., "col-w50-center-stretch-p4")
  const parts = tokenImage.split('-');
  const modifierParts = parts.slice(1); // ['w50', 'center', 'stretch', 'p4']
  
  // Track if justify/align have been explicitly set to avoid conflicts
  let justifySet = false;
  let alignSet = false;
  
  for (const modifier of modifierParts) {
    // Skip empty modifiers
    if (!modifier) continue;
    
    // Sizing modifiers
    if (modifier.match(/^w(\d+|full|auto)$/)) {
      modifiers.width = modifier.substring(1);
    } 
    else if (modifier.match(/^h(\d+|full|auto)$/)) {
      modifiers.height = modifier.substring(1);
    }
    
    // Justify content modifiers
    else if (['start', 'end', 'center', 'between', 'around', 'evenly'].includes(modifier)) {
      if (!justifySet) {
        modifiers.justifyContent = modifier;
        justifySet = true;
      }
    }
    
    // Align items modifiers
    else if (['stretch', 'baseline'].includes(modifier)) {
      if (!alignSet) {
        modifiers.alignItems = modifier;
        alignSet = true;
      }
    }
    
    // Spacing modifiers
    else if (modifier.match(/^p(\d+)$/)) {
      modifiers.padding = modifier.substring(1);
    }
    else if (modifier.match(/^m(\d+)$/)) {
      modifiers.margin = modifier.substring(1);
    }
    else if (modifier.match(/^px(\d+)$/)) {
      modifiers.paddingX = modifier.substring(2);
    }
    else if (modifier.match(/^py(\d+)$/)) {
      modifiers.paddingY = modifier.substring(2);
    }
    else if (modifier.match(/^mx(\d+)$/)) {
      modifiers.marginX = modifier.substring(2);
    }
    else if (modifier.match(/^my(\d+)$/)) {
      modifiers.marginY = modifier.substring(2);
    }
    
    // Grid-specific modifiers
    else if (modifier.match(/^gap(\d+)$/)) {
      modifiers.gap = modifier.substring(3);
    }
    else if (modifier.match(/^cols(\d+)$/)) {
      modifiers.columns = modifier.substring(4);
    }
  }
  
  return modifiers;
}




/**
 * Parse simple list item - just extracts the text content
 * Format: - Simple text content
 */
export function parseListItem(itemText: string) {
  // Remove the initial "- " from the item text and return clean text
  const content = itemText.replace(/^-\s+/, '').trim();
  
  return {
    type: 'ListItem',
    text: content
  };
}

/**
 * Parse navigator item: "- text (destination)"
 */
export function parseNavigatorItem(itemText: string) {
  const match = itemText.match(/^-\s+(.+?)\s*\(([^)]+)\)/);
  if (match) {
    return {
      text: match[1].trim(),
      destination: match[2].trim()
    };
  }
  
  // Fallback for simple text items
  const textMatch = itemText.match(/^-\s+(.+)/);
  return {
    text: textMatch ? textMatch[1].trim() : itemText,
    destination: null
  };
}