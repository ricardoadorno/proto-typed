/**
 * ImportManager - Manages shadcn component imports
 */

import { ShadcnImport, SHADCN_COMPONENTS } from "./types";

export class ImportManager {
  private imports = new Map<string, Set<string>>();
  private otherImports = new Set<string>();

  /**
   * Add a shadcn component import
   */
  addShadcnComponent(componentName: string): void {
    const importPath = SHADCN_COMPONENTS[componentName];
    if (!importPath) {
      console.warn(`No import path found for shadcn component: ${componentName}`);
      return;
    }

    if (!this.imports.has(importPath)) {
      this.imports.set(importPath, new Set());
    }
    this.imports.get(importPath)!.add(componentName);
  }

  /**
   * Add multiple shadcn components
   */
  addShadcnComponents(componentNames: string[]): void {
    componentNames.forEach((name) => this.addShadcnComponent(name));
  }

  /**
   * Add a custom import (e.g., React Router, utils)
   */
  addImport(importStatement: string): void {
    this.otherImports.add(importStatement);
  }

  /**
   * Generate import statements for a file
   */
  generateImports(): string {
    const lines: string[] = [];

    // Add React import if needed
    lines.push('import React from "react"');

    // Add other custom imports
    this.otherImports.forEach((imp) => {
      lines.push(imp);
    });

    // Add shadcn imports grouped by path
    const sortedPaths = Array.from(this.imports.keys()).sort();
    sortedPaths.forEach((path) => {
      const components = Array.from(this.imports.get(path)!).sort();
      lines.push(`import { ${components.join(", ")} } from "${path}"`);
    });

    return lines.join("\n");
  }

  /**
   * Check if a component is imported
   */
  hasComponent(componentName: string): boolean {
    const importPath = SHADCN_COMPONENTS[componentName];
    if (!importPath) return false;
    return this.imports.get(importPath)?.has(componentName) ?? false;
  }

  /**
   * Get all imported components
   */
  getAllComponents(): string[] {
    const components: string[] = [];
    this.imports.forEach((comps) => {
      components.push(...Array.from(comps));
    });
    return components;
  }

  /**
   * Reset the import manager
   */
  reset(): void {
    this.imports.clear();
    this.otherImports.clear();
  }

  /**
   * Clone the import manager
   */
  clone(): ImportManager {
    const cloned = new ImportManager();
    this.imports.forEach((components, path) => {
      cloned.imports.set(path, new Set(components));
    });
    this.otherImports.forEach((imp) => {
      cloned.otherImports.add(imp);
    });
    return cloned;
  }
}
