import { AstNode } from '../../../types/ast-node';

/**
 * Custom CSS properties manager for processing styles configurations
 */
export class CustomPropertiesManager {
  private customProperties: Record<string, string> = {};

  /**
   * Process styles configuration from AST
   */
  processStylesConfig(stylesNodes: AstNode[]): void {
    for (const stylesNode of stylesNodes) {
      if (stylesNode.type === 'styles') {
        this.processStyleDeclarations(stylesNode.elements || []);
      }
    }
  }

  /**
   * Process individual style declarations
   */
  private processStyleDeclarations(declarations: AstNode[]): void {
    for (const decl of declarations) {
      if (decl.type === 'css-property' && decl.props?.property && decl.props?.value) {
        this.customProperties[decl.props.property] = decl.props.value;
      }
    }
  }

  /**
   * Generate CSS variables for custom properties only
   */
  generateCustomCssVariables(): string {
    return Object.entries(this.customProperties)
      .map(([property, value]) => `    --${property}: ${value};`)
      .join('\n');
  }

  /**
   * Get all custom properties
   */
  getCustomProperties(): Record<string, string> {
    return { ...this.customProperties };
  }

  /**
   * Reset custom properties manager
   */
  reset(): void {
    this.customProperties = {};
  }
}

// Global custom properties manager instance
export const customPropertiesManager = new CustomPropertiesManager();