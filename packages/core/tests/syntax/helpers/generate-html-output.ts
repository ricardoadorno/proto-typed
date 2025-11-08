/**
 * Helper script to generate expected HTML output for fixtures.
 *
 * This script processes DSL strings and generates the corresponding HTML output,
 * which can then be added to fixture files for precise validation.
 *
 * Usage:
 * 1. Import this function in your test or script
 * 2. Pass DSL string to generateHtmlOutput()
 * 3. Copy the output to your fixture's expected.htmlOutput field
 */

import { parseAndBuildAst } from '../../../src/parser/parse-and-build-ast'
import { renderNode } from '../../../src/renderer/core/node-renderer'
import { setComponentDefinitions } from '../../../src/renderer/nodes/components.node'

export interface HtmlGenerationResult {
  dsl: string
  html: string
  errors: string[]
  hasErrors: boolean
}

/**
 * Generates HTML output from DSL input
 * @param dsl - The DSL string to process
 * @returns Object containing the generated HTML and any errors
 */
export function generateHtmlOutput(dsl: string): HtmlGenerationResult {
  const ast = parseAndBuildAst(dsl)
  const errors =
    ast.__errors?.map((e) => `[${e.severity}] ${e.code}: ${e.message}`) || []

  // Set component definitions if any exist
  const componentNodes =
    ast.children?.filter((n) => n.type === 'Component') || []
  if (componentNodes.length > 0) {
    setComponentDefinitions(componentNodes)
  }

  // Render screens and other non-component nodes
  const renderableNodes =
    ast.children?.filter((n) => n.type !== 'Component') || []
  const html = renderableNodes.map((node) => renderNode(node)).join('\n')

  return {
    dsl,
    html,
    errors,
    hasErrors: errors.length > 0,
  }
}

/**
 * Generates HTML output for multiple DSL fixtures
 * @param fixtures - Object containing fixture DSL strings
 * @returns Object with same structure but HTML output included
 */
export function generateFixtureOutputs(
  fixtures: Record<string, string>
): Record<string, string> {
  const results: Record<string, string> = {}

  for (const [key, dsl] of Object.entries(fixtures)) {
    const result = generateHtmlOutput(dsl)
    results[key] = result.html
  }

  return results
}

/**
 * Formats HTML output for fixture file (with proper escaping)
 * @param html - The HTML string to format
 * @returns Formatted string ready to paste in fixture file
 */
export function formatForFixture(html: string): string {
  // Escape backticks for template literals
  const escaped = html.replace(/`/g, '\\`').replace(/\${/g, '\\${')

  // Return formatted as template literal
  return `\`${escaped}\``
}

/**
 * Pretty prints generation results for console debugging
 */
export function printGenerationResult(result: HtmlGenerationResult): void {
  console.log('\n' + '='.repeat(80))
  console.log('DSL Input:')
  console.log('-'.repeat(80))
  console.log(result.dsl)
  console.log('\n' + '-'.repeat(80))
  console.log('Generated HTML:')
  console.log('-'.repeat(80))
  console.log(result.html)

  if (result.hasErrors) {
    console.log('\n' + '-'.repeat(80))
    console.log('Errors:')
    console.log('-'.repeat(80))
    result.errors.forEach((err) => console.log(err))
  }

  console.log('\n' + '-'.repeat(80))
  console.log('For fixture file:')
  console.log('-'.repeat(80))
  console.log(`htmlOutput: ${formatForFixture(result.html)},`)
  console.log('='.repeat(80) + '\n')
}
