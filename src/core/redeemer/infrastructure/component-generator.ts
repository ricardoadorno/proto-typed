import { ImportManager } from './import-manager';

export interface ComponentFileOptions {
  componentName: string;
  jsx: string;
  includeClientDirective?: boolean;
  includeComments?: boolean;
}

/**
 * Generates complete React component file
 */
export class ComponentGenerator {
  constructor(private importManager: ImportManager) {}

  generateComponentFile(options: ComponentFileOptions): string {
    const { componentName, jsx, includeClientDirective = true, includeComments = true } = options;

    const parts: string[] = [];

    // Client directive for Next.js
    if (includeClientDirective) {
      parts.push(`'use client';`);
      parts.push('');
    }

    // Imports
    const imports = this.importManager.generateImports();
    if (imports) {
      parts.push(imports);
      parts.push('');
    }

    // Component comment
    if (includeComments) {
      parts.push(`/**`);
      parts.push(` * ${componentName} - Generated from proto-typed DSL`);
      parts.push(` */`);
    }

    // Component function
    parts.push(`export function ${componentName}() {`);
    parts.push(`  return (`);

    // Add JSX with proper indentation
    const indentedJsx = jsx.split('\n').map(line => `    ${line}`).join('\n');
    parts.push(indentedJsx);

    parts.push(`  );`);
    parts.push(`}`);

    return parts.join('\n');
  }

  /**
   * Generate a client component wrapper for server component usage
   */
  generateClientWrapper(componentName: string, jsx: string): string {
    return `'use client';

import { useState } from 'react';

export function ${componentName}() {
  const [isOpen, setIsOpen] = useState(false);

  return (
${jsx}
  );
}`;
  }
}
