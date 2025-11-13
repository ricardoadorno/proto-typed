/**
 * Simple test script for formatter and linter
 */

import { formatDocument, isFormattingIdempotent } from './src/core/formatter';
import { parseAndBuildAst } from './src/core/parser/parse-and-build-ast';

// ============================================================
// Test Cases
// ============================================================

const testCases = [
  {
    name: 'Basic formatting with inconsistent indentation',
    input: `screen Home:
    container:
       # Welcome
          > This is a test
    stack:
      @primary[Click Me](Next)`,
    expectedIssues: [],
  },
  {
    name: 'Undefined component reference',
    input: `screen Home:
  container:
    $UndefinedComponent`,
    expectedIssues: ['Component "UndefinedComponent" is not defined'],
  },
  {
    name: 'Unused component definition',
    input: `component UnusedComponent:
  > This is never used

screen Home:
  container:
    # Welcome`,
    expectedIssues: ['Component "UnusedComponent" is defined but never instantiated'],
  },
  {
    name: 'Invalid navigation target',
    input: `screen Home:
  container:
    @primary[Go](NonExistentScreen)`,
    expectedIssues: ['Navigation target "NonExistentScreen" does not exist'],
  },
  {
    name: 'Valid complete example',
    input: `component Header:
  # %title

screen Home:
  container:
    $Header | Welcome
    @primary[Next](Settings)

screen Settings:
  container:
    # Settings
    @link[Back](Home)`,
    expectedIssues: [],
  },
];

// ============================================================
// Run Tests
// ============================================================

console.log('🧪 Testing Formatter and Linter\n');
console.log('='.repeat(60));

let passedTests = 0;
let totalTests = testCases.length;

for (const testCase of testCases) {
  console.log(`\n📋 Test: ${testCase.name}`);
  console.log('-'.repeat(60));

  // Test formatting
  console.log('\n1️⃣  Testing Formatter...');
  try {
    const formatted = formatDocument(testCase.input);
    const isIdempotent = isFormattingIdempotent(testCase.input);

    console.log(`   ✓ Formatting successful`);
    console.log(`   ✓ Idempotence: ${isIdempotent ? 'PASS' : 'FAIL'}`);

    if (!isIdempotent) {
      console.log('   ⚠️  Formatting is not idempotent!');
    }

    // Show formatted output
    console.log('\n   Formatted output:');
    console.log(formatted.split('\n').map(line => `   | ${line}`).join('\n'));
  } catch (error) {
    console.log(`   ✗ Formatting failed: ${error}`);
  }

  // Test linting
  console.log('\n2️⃣  Testing Linter...');
  try {
    const ast = parseAndBuildAst(testCase.input);
    const errors = (ast as any).__errors || [];

    console.log(`   Found ${errors.length} diagnostic(s):`);

    if (errors.length > 0) {
      errors.forEach((err: any, i: number) => {
        const severity = err.severity === 'error' ? '❌' : err.severity === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`   ${severity} [${err.stage}] ${err.message}`);
      });
    } else {
      console.log('   ✓ No issues found');
    }

    // Check expected issues
    const issueMessages = errors.map((e: any) => e.message);
    const allExpectedFound = testCase.expectedIssues.every(expected =>
      issueMessages.some(msg => msg.includes(expected))
    );

    if (allExpectedFound) {
      console.log(`   ✓ All expected issues detected`);
      passedTests++;
    } else {
      console.log(`   ✗ Expected issues not found:`);
      testCase.expectedIssues.forEach(expected => {
        const found = issueMessages.some(msg => msg.includes(expected));
        console.log(`      ${found ? '✓' : '✗'} "${expected}"`);
      });
    }
  } catch (error) {
    console.log(`   ✗ Linting failed: ${error}`);
  }

  console.log();
}

console.log('='.repeat(60));
console.log(`\n✅ Tests passed: ${passedTests}/${totalTests}`);
console.log();

// Exit with appropriate code
process.exit(passedTests === totalTests ? 0 : 1);
