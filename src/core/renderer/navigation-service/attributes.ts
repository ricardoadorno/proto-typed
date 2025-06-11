/**
 * HTML Attribute Generators
 * Generate navigation-related HTML attributes for elements
 */
import { analyzeNavigationTarget } from './analyzer';

/**
 * Generate navigation attributes for HTML elements
 */
export function generateNavigationAttributes(target: string | undefined): string {
  const navTarget = analyzeNavigationTarget(target);
  
  if (!navTarget.isValid) {
    return '';
  }

  const attributes = [`data-nav="${navTarget.value}"`];
  
  switch (navTarget.type) {
    case 'internal':
      attributes.push(`data-nav-type="internal"`);
      break;
    case 'external':
      attributes.push(`data-nav-type="external"`);
      break;
    case 'action':
      attributes.push(`data-nav-type="action"`);
      break;
    case 'toggle':
      attributes.push(`data-nav-type="toggle"`);
      break;
    case 'back':
      attributes.push(`data-nav-type="back"`);
      break;
  }

  return attributes.join(' ');
}

/**
 * Generate href attribute for links
 */
export function generateHrefAttribute(target: string | undefined): string {
  const navTarget = analyzeNavigationTarget(target);
  
  if (!navTarget.isValid) {
    return 'href="#"';
  }

  switch (navTarget.type) {
    case 'internal':
      return `href="#${navTarget.value}"`;
    case 'external':
      return `href="${navTarget.value}"`;
    case 'action':
      return 'href="#"'; // Actions don't use href
    default:
      return 'href="#"';
  }
}

/**
 * Generate navigation data attributes as an object
 */
export function generateNavigationDataAttributes(target: string | undefined): Record<string, string> {
  const navTarget = analyzeNavigationTarget(target);
  
  if (!navTarget.isValid) {
    return {};
  }

  return {
    'data-nav': navTarget.value,
    'data-nav-type': navTarget.type
  };
}
