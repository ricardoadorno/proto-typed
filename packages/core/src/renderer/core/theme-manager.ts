import { availableThemes, generateThemeCssVariables, getThemeByName, Theme } from '../../themes/theme-definitions';
import { AstNode } from '../../types/ast-node';

/**
 * Combined theme and custom CSS properties manager
 */
export class CustomPropertiesManager {
  private customProperties: Record<string, string> = {};
  private selectedTheme: Theme;

  constructor() {
    this.selectedTheme = availableThemes.slate; // Default theme
  }

  /**
   * Set external theme (from UI selector)
   */
  setExternalTheme(themeName: string): void {
    this.selectedTheme = getThemeByName(themeName);
  }

  /**
   * Get current theme name
   */
  getCurrentThemeName(): string {
    return this.selectedTheme.name;
  }

  /**
   * Process styles configuration from AST
   */
  processStylesConfig(stylesNodes: AstNode[]): void {
    for (const stylesNode of stylesNodes) {
      if (stylesNode.type === 'Styles') {
        this.processStyleDeclarations(stylesNode.children || []);
      }
    }
  }

  /**
   * Process individual style declarations
   */
  private processStyleDeclarations(declarations: AstNode[]): void {
    for (const decl of declarations) {
      if (decl.type === 'CssProperty') {
        const props = decl.props as any;
        if (props?.property && props?.value) {
          this.customProperties[props.property] = props.value;
        }
      }
    }
  }

  /**
   * Generate complete CSS variables (theme + custom properties)
   */
  generateAllCssVariables(isDark: boolean = true): string {
    const themeVars = generateThemeCssVariables(this.selectedTheme, isDark);
    const customVars = this.generateCustomCssVariables();
    
    return customVars ? `${themeVars}\n${customVars}` : themeVars;
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
   * Reset custom properties manager (keeps external theme)
   */
  reset(): void {
    this.customProperties = {};
    // Note: We don't reset selectedTheme here as it's controlled externally
  }
}

// Global custom properties manager instance
export const customPropertiesManager = new CustomPropertiesManager();