/**
 * Core utility builders for AST construction
 * Contains helper methods for parsing and processing DSL elements
 */

/**
 * @function parseLayoutModifiers
 * @description Parses layout modifiers from a token image string.
 * For example, in "col-w50-center-stretch-p4", it extracts "w50", "center", "stretch", and "p4"
 * and converts them into a structured object of CSS properties.
 *
 * @param {string} tokenImage - The string from the token to parse.
 * @returns {object} An object containing the parsed layout modifiers.
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
    
    // Handle start, end, center with smart assignment (first occurrence goes to justify, second to align)
    else if (['start', 'end', 'center'].includes(modifier)) {
      if (!justifySet) {
        modifiers.justifyContent = modifier;
        justifySet = true;
      } else if (!alignSet) {
        modifiers.alignItems = modifier;
        alignSet = true;
      }
    }
    
    // Other justify content modifiers (between, around, evenly)
    else if (['between', 'around', 'evenly'].includes(modifier)) {
      if (!justifySet) {
        modifiers.justifyContent = modifier;
        justifySet = true;
      }
    }
    
    // Align items modifiers (stretch, baseline)
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
 * @function parseListItem
 * @description Parses a simple unordered list item and extracts its text content.
 * The format is "- Simple text content".
 *
 * @param {string} itemText - The full text of the list item.
 * @returns {object} An 'UnorderedListItem' AST node.
 */
export function parseListItem(itemText: string) {
  // Remove the initial "- " from the item text and return clean text
  const content = itemText.replace(/^-\s+/, '').trim();
  
  return {
    type: 'UnorderedListItem',
    id: "", // ID will be generated later
    props: { text: content },
    children: []
  };
}

/**
 * @function parseNavigatorItem
 * @description Parses a navigator item, which can have one of three formats:
 * 1. "- text | icon | destination"
 * 2. "- text | destination"
 * 3. "- text"
 *
 * @param {string} itemText - The full text of the navigator item.
 * @returns {object} A 'NavigatorItem' AST node.
 */
export function parseNavigatorItem(itemText: string) {
  // Try 3-part pipe format: "- text | icon | destination"
  const threePartMatch = itemText.match(/^-\s+([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*(.+)$/);
  if (threePartMatch) {
    return {
      type: "NavigatorItem",
      id: "", // ID will be generated later
      props: {
        text: threePartMatch[1].trim(),
        icon: threePartMatch[2].trim(),
        destination: threePartMatch[3].trim()
      },
      children: []
    };
  }
  
  // Try 2-part pipe format: "- text | destination"
  const twoPartMatch = itemText.match(/^-\s+([^|]+?)\s*\|\s*(.+)$/);
  if (twoPartMatch) {
    return {
      type: "NavigatorItem",
      id: "", // ID will be generated later
      props: {
        text: twoPartMatch[1].trim(),
        icon: '',
        destination: twoPartMatch[2].trim()
      },
      children: []
    };
  }
  
  // Fallback for simple text items
  const textMatch = itemText.match(/^-\s+(.+)$/);
  return {
    type: "NavigatorItem",
    id: "", // ID will be generated later
    props: {
      text: textMatch ? textMatch[1].trim() : itemText,
      icon: '',
      destination: ''
    },
    children: []
  };
}
