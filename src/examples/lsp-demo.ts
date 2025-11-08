/**
 * LSP Demo - Demonstrates LSP functionality
 *
 * This file shows how to use the LSP module for linting,
 * formatting, and code actions.
 */

import { lint, format, analyze, type LintResult } from '../core/lsp';

// ============================================================
// EXAMPLE 1: Basic Linting
// ============================================================

console.log('=== EXAMPLE 1: Basic Linting ===\n');

const codeWithErrors = `
Screen Home:
Button primery: Click me
  Input emial: Enter email
`;

const lintResult: LintResult = lint(codeWithErrors);

console.log('Lint Results:');
console.log(`- Total diagnostics: ${lintResult.diagnostics.length}`);
console.log(`- Errors: ${lintResult.errorCount}`);
console.log(`- Warnings: ${lintResult.warningCount}`);
console.log(`- Hints: ${lintResult.hintCount}`);

console.log('\nDiagnostics:');
lintResult.diagnostics.forEach((diagnostic, index) => {
  console.log(`${index + 1}. [${diagnostic.severity}] ${diagnostic.message}`);
  console.log(`   Location: Line ${diagnostic.range.start.line + 1}, Column ${diagnostic.range.start.character + 1}`);
  console.log(`   Code: ${diagnostic.code}\n`);
});

// ============================================================
// EXAMPLE 2: Code Formatting
// ============================================================

console.log('\n=== EXAMPLE 2: Code Formatting ===\n');

const unformattedCode = `
Screen Home:
Button primary:Click me
Container:
Stack:
Text:Welcome
Text:to ProtoTyped
`;

console.log('Before formatting:');
console.log(unformattedCode);

const formatResult = format(unformattedCode, {
  tabSize: 2,
  insertSpaces: true,
  trimTrailingWhitespace: true,
  insertFinalNewline: true,
});

if (formatResult && formatResult.length > 0) {
  console.log('\nAfter formatting:');
  console.log(formatResult[0].newText);
} else {
  console.log('\nNo formatting changes needed');
}

// ============================================================
// EXAMPLE 3: Complete Analysis
// ============================================================

console.log('\n=== EXAMPLE 3: Complete Analysis ===\n');

const codeToAnalyze = `
Screen Dashboard:
  Container wide:
    Stack loose:
      Heading 1: Dashboard
      Button primry lg: View Details
      Input emial: Your email
`;

const analysis = analyze(codeToAnalyze, 'dashboard.pt', {
  tabSize: 2,
  insertSpaces: true,
});

console.log('Analysis Results:');
console.log(`- Diagnostics: ${analysis.lint.diagnostics.length}`);
console.log(`- Code Actions Available: ${analysis.codeActions.length}`);
console.log(`- Formatting Needed: ${analysis.format !== null}`);

if (analysis.codeActions.length > 0) {
  console.log('\nAvailable Code Actions:');
  analysis.codeActions.forEach((action, index) => {
    console.log(`${index + 1}. ${action.title} (${action.kind})`);
  });
}

// ============================================================
// EXAMPLE 4: Valid Code
// ============================================================

console.log('\n=== EXAMPLE 4: Valid Code ===\n');

const validCode = `
Screen Home:
  Container:
    Stack:
      Heading 1: Welcome
      Text: This is a demo
      Button primary: Click me
`;

const validLintResult = lint(validCode);

console.log('Lint Results for Valid Code:');
console.log(`- Total diagnostics: ${validLintResult.diagnostics.length}`);
console.log(`- Errors: ${validLintResult.errorCount}`);
console.log(`- Warnings: ${validLintResult.warningCount}`);

if (validLintResult.diagnostics.length === 0) {
  console.log('✅ Code is valid!');
}

// ============================================================
// EXAMPLE 5: Complex Layout
// ============================================================

console.log('\n=== EXAMPLE 5: Complex Layout ===\n');

const complexCode = `
Screen Products:
  Header:
    Heading 1: Product Catalog
    Navigator

  Container wide:
    Grid3:
      Card:
        Image /products/1.jpg "Product 1"
        Heading 3: Product 1
        Text: Description here
        Button primary: Buy Now

      Card:
        Image /products/2.jpg "Product 2"
        Heading 3: Product 2
        Text: Description here
        Button secondary: Learn More

      Card:
        Image /products/3.jpg "Product 3"
        Heading 3: Product 3
        Text: Description here
        Button outline: Details
`;

const complexLintResult = lint(complexCode);

console.log('Complex Layout Lint Results:');
console.log(`- Total diagnostics: ${complexLintResult.diagnostics.length}`);
console.log(`- Code is ${complexLintResult.diagnostics.length === 0 ? 'valid' : 'invalid'}`);

const complexFormatResult = format(complexCode, {
  tabSize: 2,
  insertSpaces: true,
  trimTrailingWhitespace: true,
});

console.log(`- Formatting ${complexFormatResult ? 'applied' : 'not needed'}`);

// ============================================================
// EXPORT FOR USE IN OTHER FILES
// ============================================================

export {
  codeWithErrors,
  unformattedCode,
  validCode,
  complexCode,
};
