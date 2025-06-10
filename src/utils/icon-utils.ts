/**
 * Utility functions for handling Lucide icons
 */
import { icons } from 'lucide';

// Cache para melhorar performance
let lucideIconsCache: Set<string> | null = null;

/**
 * Get all available Lucide icons synchronously
 */
function getLucideIcons(): Set<string> {
  if (lucideIconsCache) {
    return lucideIconsCache;
  }

  const iconNames = Object.keys(icons);
  lucideIconsCache = new Set(iconNames);
  return lucideIconsCache;
}

/**
 * Check if a string is a valid Lucide icon name
 */
export function isLucideIcon(text: string): boolean {
  const iconSet = getLucideIcons();
  return iconSet.has(text);
}

/**
 * Get the SVG content for a Lucide icon
 */
export function getLucideSvg(iconName: string): string {
  const icon = icons[iconName as keyof typeof icons];
  if (!icon) {
    return '';
  }
  
  // Lucide icons are arrays of path/element data
  // Each element has a tag name and attributes
  try {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '16');
    svg.setAttribute('height', '16');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.classList.add('inline-block');
    
    // Add the icon paths - Lucide icons are arrays of [tagName, attributes]
    icon.forEach((element: any) => {
      if (Array.isArray(element) && element.length >= 2) {
        const [tagName, attributes] = element;
        if (tagName && typeof tagName === 'string') {
          const svgElement = document.createElementNS('http://www.w3.org/2000/svg', tagName);
          if (attributes && typeof attributes === 'object') {
            Object.entries(attributes).forEach(([key, value]) => {
              svgElement.setAttribute(key, String(value));
            });
          }
          svg.appendChild(svgElement);
        }
      }
    });
    
    return svg.outerHTML;
  } catch (error) {
    console.warn(`Error rendering Lucide icon ${iconName}:`, error);
    return '';
  }
}
