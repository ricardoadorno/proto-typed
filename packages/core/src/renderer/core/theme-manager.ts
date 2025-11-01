import {
  availableThemes,
  generateThemeCssVariables,
  getThemeByName,
  Theme,
} from '../../themes/theme-definitions'
import { AstNode } from '../../types/ast-node'

interface HeadColorConfig {
  primary?: string
  secondary?: string
  neutral?: string
  accent?: string
}

interface HeadFontConfig {
  family?: string
}

interface HeadTemplateConfig {
  default?: string
}

interface HeadConfig {
  color?: HeadColorConfig
  font?: HeadFontConfig
  template?: HeadTemplateConfig
}

/**
 * Combined theme and head configuration manager
 */
export class CustomPropertiesManager {
  private headConfig: HeadConfig = {}
  private selectedTheme: Theme

  constructor() {
    this.selectedTheme = availableThemes.slate // Default theme
  }

  /**
   * Set external theme (from UI selector)
   */
  setExternalTheme(themeName: string): void {
    this.selectedTheme = getThemeByName(themeName)
  }

  /**
   * Get current theme name
   */
  getCurrentThemeName(): string {
    return this.selectedTheme.name
  }

  /**
   * Process head configuration from AST
   */
  processHeadConfig(headNodes: AstNode[]): void {
    for (const headNode of headNodes) {
      if (headNode.type === 'Head') {
        this.processHeadSections(headNode.children || [])
      }
    }
  }

  /**
   * Process head sections (color, font, template)
   */
  private processHeadSections(sections: AstNode[]): void {
    for (const section of sections) {
      if (section.type === 'HeadColor') {
        this.processColorSection(section.children || [])
      } else if (section.type === 'HeadFont') {
        this.processFontSection(section.children || [])
      } else if (section.type === 'HeadTemplate') {
        this.processTemplateSection(section.children || [])
      }
    }
  }

  /**
   * Process color section
   */
  private processColorSection(properties: AstNode[]): void {
    if (!this.headConfig.color) {
      this.headConfig.color = {}
    }

    for (const prop of properties) {
      if (prop.type === 'ColorProperty') {
        const { name, value } = prop.props as { name: string; value: string }
        if (name && value) {
          this.headConfig.color[name as keyof HeadColorConfig] = value
        }
      }
    }
  }

  /**
   * Process font section
   */
  private processFontSection(sections: AstNode[]): void {
    if (!this.headConfig.font) {
      this.headConfig.font = {}
    }

    for (const section of sections) {
      if (section.type === 'FontBase') {
        this.processFontBaseSection(section.children || [])
      }
    }
  }

  /**
   * Process font base section
   */
  private processFontBaseSection(properties: AstNode[]): void {
    for (const prop of properties) {
      if (prop.type === 'FontProperty') {
        const { name, value } = prop.props as { name: string; value: string }
        if (name && value) {
          this.headConfig.font![name as keyof HeadFontConfig] = value
        }
      }
    }
  }

  /**
   * Process template section
   */
  private processTemplateSection(properties: AstNode[]): void {
    if (!this.headConfig.template) {
      this.headConfig.template = {}
    }

    for (const prop of properties) {
      if (prop.type === 'TemplateProperty') {
        const { name, value } = prop.props as { name: string; value: string }
        if (name && value) {
          this.headConfig.template[name as keyof HeadTemplateConfig] = value
        }
      }
    }
  }

  /**
   * Generate complete CSS variables (theme + head config)
   */
  generateAllCssVariables(isDark: boolean = true): string {
    const themeVars = generateThemeCssVariables(this.selectedTheme, isDark)
    const headVars = this.generateHeadCssVariables()

    return headVars ? `${themeVars}\n${headVars}` : themeVars
  }

  /**
   * Generate CSS variables for head configuration
   */
  generateHeadCssVariables(): string {
    const vars: string[] = []

    if (this.headConfig.color) {
      const { primary, secondary, neutral, accent } = this.headConfig.color
      if (primary) vars.push(`    --head-color-primary: ${primary};`)
      if (secondary) vars.push(`    --head-color-secondary: ${secondary};`)
      if (neutral) vars.push(`    --head-color-neutral: ${neutral};`)
      if (accent) vars.push(`    --head-color-accent: ${accent};`)
    }

    if (this.headConfig.font?.family) {
      vars.push(`    --head-font-family: ${this.headConfig.font.family};`)
    }

    return vars.join('\n')
  }

  /**
   * Get head configuration
   */
  getHeadConfig(): HeadConfig {
    return { ...this.headConfig }
  }

  /**
   * Get template default component reference
   */
  getTemplateDefault(): string | undefined {
    return this.headConfig.template?.default
  }

  /**
   * Generate Google Fonts link if font family is configured
   */
  generateGoogleFontsLink(): string {
    const fontFamily = this.headConfig.font?.family
    if (!fontFamily) {
      return ''
    }

    // Convert font family to Google Fonts URL format
    const formattedFont = fontFamily.replace(/\s+/g, '+')
    return `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${formattedFont}:wght@300;400;500;600;700&display=swap" rel="stylesheet">`
  }

  /**
   * Generate CSS to apply head colors and fonts to theme variables
   */
  generateHeadThemeOverrides(): string {
    const overrides: string[] = []

    if (this.headConfig.color) {
      const { primary, secondary, neutral, accent } = this.headConfig.color

      // Override theme colors with head colors
      if (primary) {
        overrides.push(`    --primary: ${primary};`)
        overrides.push(`    --primary-foreground: #ffffff;`)
      }
      if (secondary) {
        overrides.push(`    --secondary: ${secondary};`)
        overrides.push(`    --secondary-foreground: #ffffff;`)
      }
      if (neutral) {
        overrides.push(`    --background: ${neutral};`)
        overrides.push(`    --foreground: #ffffff;`)
      }
      if (accent) {
        overrides.push(`    --accent: ${accent};`)
        overrides.push(`    --accent-foreground: #ffffff;`)
      }
    }

    if (this.headConfig.font?.family) {
      overrides.push(
        `    font-family: '${this.headConfig.font.family}', sans-serif;`
      )
    }

    return overrides.length > 0 ? overrides.join('\n') : ''
  }

  /**
   * Reset head configuration manager (keeps external theme)
   */
  reset(): void {
    this.headConfig = {}
    // Note: We don't reset selectedTheme here as it's controlled externally
  }
}

// Global custom properties manager instance
export const customPropertiesManager = new CustomPropertiesManager()
