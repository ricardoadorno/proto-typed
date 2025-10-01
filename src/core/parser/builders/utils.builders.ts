/**
 * Utility functions for AST builders
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
    // Flexbox: Justify content (flex main axis) - only set if not already set
    else if (['start', 'end', 'center', 'between', 'around', 'evenly'].includes(modifier)) {
      if (!justifySet) {
        modifiers.justify = modifier;
        justifySet = true;
      } else if (!alignSet) {
        modifiers.align = modifier;
        alignSet = true;
      }
    }
    // Flexbox: Align items (flex cross axis) - specific alignment values
    else if (['stretch', 'baseline'].includes(modifier)) {
      modifiers.align = modifier;
      alignSet = true;
    }
    // Padding modifiers - all directions
    else if (modifier.match(/^p(\d+)$/)) {
      modifiers.padding = modifier.substring(1);
    } 
    else if (modifier.match(/^px(\d+)$/)) {
      modifiers.paddingX = modifier.substring(2);
    } 
    else if (modifier.match(/^py(\d+)$/)) {
      modifiers.paddingY = modifier.substring(2);
    } 
    else if (modifier.match(/^pl(\d+)$/)) {
      modifiers.paddingLeft = modifier.substring(2);
    } 
    else if (modifier.match(/^pr(\d+)$/)) {
      modifiers.paddingRight = modifier.substring(2);
    } 
    else if (modifier.match(/^pt(\d+)$/)) {
      modifiers.paddingTop = modifier.substring(2);
    } 
    else if (modifier.match(/^pb(\d+)$/)) {
      modifiers.paddingBottom = modifier.substring(2);
    }
    // Margin modifiers - all directions
    else if (modifier.match(/^m(\d+)$/)) {
      modifiers.margin = modifier.substring(1);
    } 
    else if (modifier.match(/^mx(\d+)$/)) {
      modifiers.marginX = modifier.substring(2);
    } 
    else if (modifier.match(/^my(\d+)$/)) {
      modifiers.marginY = modifier.substring(2);
    } 
    else if (modifier.match(/^ml(\d+)$/)) {
      modifiers.marginLeft = modifier.substring(2);
    } 
    else if (modifier.match(/^mr(\d+)$/)) {
      modifiers.marginRight = modifier.substring(2);
    } 
    else if (modifier.match(/^mt(\d+)$/)) {
      modifiers.marginTop = modifier.substring(2);
    } 
    else if (modifier.match(/^mb(\d+)$/)) {
      modifiers.marginBottom = modifier.substring(2);
    }
    // Gap modifier for flexbox/grid spacing
    else if (modifier.match(/^gap(\d+)$/)) {
      modifiers.gap = modifier.substring(3);
    }
    // Grid columns modifier
    else if (modifier.match(/^cols(\d+)$/)) {
      modifiers.gridCols = modifier.substring(4);
    }
  }
  
  return modifiers;
}

/**
 * Helper method to parse navigator items from dash syntax
 */
export function parseNavigatorItem(itemText: string): any {
  // Remove initial "- " and trim
  const content = itemText.replace(/^(?:\r\n|\r|\n|\s)*-\s+/, '').trim();
  
  // New pattern: label | icon | action (all separated by pipes)
  const parts = content.split('|').map(part => part.trim());
  
  const label = parts[0] || '';
  const icon = parts[1] || '';
  const action = parts[2] || '';
  
  return {
    type: "NavItem",
    props: {
      label: label,
      icon: icon,
      action: action
    }
  };
}

/**
 * Helper method to parse drawer items from dash syntax
 */
export function parseDrawerItem(itemText: string): any {
  // Remove initial "- " and trim
  const content = itemText.replace(/^(?:\r\n|\r|\n|\s)*-\s+/, '').trim();
  
  // New pattern: label | icon | action (all separated by pipes)
  const parts = content.split('|').map(part => part.trim());
  
  const label = parts[0] || '';
  const icon = parts[1] || '';
  const action = parts[2] || '';
  
  return {
    type: "DrawerItem",
    props: {
      label: label,
      icon: icon,
      action: action
    }
  };
}