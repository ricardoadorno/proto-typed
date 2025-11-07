/**
 * Manages imports for generated React components
 */
export class ImportManager {
  private reactImports: Set<string> = new Set();
  private shadcnImports: Set<string> = new Set();
  private lucideImports: Set<string> = new Set();
  private nextImports: Set<string> = new Set();
  private customImports: Map<string, string> = new Map();

  reset(): void {
    this.reactImports.clear();
    this.shadcnImports.clear();
    this.lucideImports.clear();
    this.nextImports.clear();
    this.customImports.clear();
  }

  addReactImport(name: string): void {
    this.reactImports.add(name);
  }

  addShadcnComponent(component: string): void {
    this.shadcnImports.add(component);
  }

  addLucideIcon(icon: string): void {
    this.lucideImports.add(icon);
  }

  addNextImport(name: string): void {
    this.nextImports.add(name);
  }

  addCustomImport(importStatement: string, source: string): void {
    this.customImports.set(source, importStatement);
  }

  /**
   * Generate all import statements
   */
  generateImports(): string {
    const imports: string[] = [];

    // React imports
    if (this.reactImports.size > 0) {
      const reactImportList = Array.from(this.reactImports).sort().join(', ');
      imports.push(`import { ${reactImportList} } from 'react';`);
    }

    // Next.js imports
    if (this.nextImports.size > 0) {
      if (this.nextImports.has('Link')) {
        imports.push(`import Link from 'next/link';`);
      }
      if (this.nextImports.has('Image')) {
        imports.push(`import Image from 'next/image';`);
      }
    }

    // shadcn/ui imports (grouped by component)
    if (this.shadcnImports.size > 0) {
      const shadcnList = Array.from(this.shadcnImports).sort();
      shadcnList.forEach(component => {
        imports.push(`import { ${component} } from '@/components/ui/${this.getComponentPath(component)}';`);
      });
    }

    // Lucide icons
    if (this.lucideImports.size > 0) {
      const lucideList = Array.from(this.lucideImports).sort().join(', ');
      imports.push(`import { ${lucideList} } from 'lucide-react';`);
    }

    // Custom imports
    if (this.customImports.size > 0) {
      Array.from(this.customImports.entries()).forEach(([source, statement]) => {
        imports.push(statement);
      });
    }

    return imports.join('\n');
  }

  /**
   * Map component name to file path
   */
  private getComponentPath(component: string): string {
    const pathMap: Record<string, string> = {
      'Button': 'button',
      'Input': 'input',
      'Select': 'select',
      'SelectTrigger': 'select',
      'SelectValue': 'select',
      'SelectContent': 'select',
      'SelectItem': 'select',
      'Checkbox': 'checkbox',
      'Dialog': 'dialog',
      'DialogContent': 'dialog',
      'DialogHeader': 'dialog',
      'DialogTitle': 'dialog',
      'DialogDescription': 'dialog',
      'Sheet': 'sheet',
      'SheetContent': 'sheet',
      'SheetHeader': 'sheet',
      'SheetTitle': 'sheet',
      'SheetDescription': 'sheet',
      'Separator': 'separator',
      'Card': 'card',
      'CardHeader': 'card',
      'CardTitle': 'card',
      'CardDescription': 'card',
      'CardContent': 'card',
      'CardFooter': 'card',
    };

    return pathMap[component] || component.toLowerCase();
  }
}
