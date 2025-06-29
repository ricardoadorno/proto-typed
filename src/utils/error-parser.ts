import { LexerError, ParsedError } from '../types/errors';

/**
 * Parses a Chevrotain error message and extracts structured information
 */
export function parseChevrotainError(error: string): ParsedError {
  // Try to parse lexer errors first
  const lexerErrorMatch = error.match(/Lexer errors detected:(.*)/s);
  if (lexerErrorMatch) {
    try {
      const lexerErrors = JSON.parse(lexerErrorMatch[1].trim());
      if (lexerErrors.length > 0) {
        return parseLexerError(lexerErrors[0]);
      }
    } catch (e) {
      // Fall through to generic parsing
    }
  }

  // Try to parse parser errors
  const parserErrorMatch = error.match(/Parsing error: (.*)/);
  if (parserErrorMatch) {
    return parseParserError(parserErrorMatch[1]);
  }

  // Handle "Redundant input" errors specifically
  if (error.includes('Redundant input')) {
    const redundantInputMatch = error.match(/Redundant input, expecting EOF but found: (.+?)(\s|$)/);
    const foundToken = redundantInputMatch ? redundantInputMatch[1] : 'unknown token';
    
    // Try to extract location information if present
    const locationMatch = error.match(/at offset: (\d+),(\d+)/);
    
    return {
      type: 'parser',
      title: 'Syntax Error',
      message: `Redundant input, expecting EOF but found: ${foundToken}`,
      location: locationMatch ? {
        line: parseInt(locationMatch[1]),
        column: parseInt(locationMatch[2])
      } : undefined,
      context: {
        token: foundToken,
        expected: ['EOF', 'End of file']
      },
      suggestion: `Remove the extra content "${foundToken}" or check if you have unclosed elements. The parser expected the end of file but found additional content.`
    };
  }

  // Handle indentation errors
  if (error.includes('invalid outdent')) {
    const offsetMatch = error.match(/invalid outdent at offset: (\d+)/);
    return {
      type: 'lexer',
      title: 'Indentation Error',
      message: 'Invalid indentation detected. Make sure your indentation is consistent.',
      location: offsetMatch ? { line: 1, column: parseInt(offsetMatch[1]) } : undefined,
      suggestion: 'Check that you are using consistent spaces for indentation and that all blocks are properly indented.'
    };
  }

  // Default case for unknown errors
  return {
    type: 'unknown',
    title: 'Parse Error',
    message: error,
    suggestion: 'Check your DSL syntax and ensure all elements are properly formatted.'
  };
}

function parseLexerError(lexerError: LexerError): ParsedError {
  return {
    type: 'lexer',
    title: 'Lexical Analysis Error',
    message: lexerError.message,
    location: {
      line: lexerError.line,
      column: lexerError.column
    },
    suggestion: generateLexerSuggestion(lexerError)
  };
}

function parseParserError(errorMessage: string): ParsedError {
  // Extract token information
  const tokenMatch = errorMessage.match(/Expecting token of type --> (.+?) <-- but found --> '(.+?)' <--/);
  
  // Try different location patterns that Chevrotain might use
  let locationMatch = errorMessage.match(/at line (\d+), column (\d+)/);
  if (!locationMatch) {
    locationMatch = errorMessage.match(/at offset: (\d+),(\d+)/);
  }
  if (!locationMatch) {
    locationMatch = errorMessage.match(/position (\d+):(\d+)/);
  }
  if (!locationMatch) {
    locationMatch = errorMessage.match(/(\d+):(\d+)/);
  }
  
  let expected: string[] = [];
  let foundToken = '';
  
  if (tokenMatch) {
    expected = [tokenMatch[1]];
    foundToken = tokenMatch[2];
  }

  // Extract multiple expected tokens if available
  const multiExpectedMatch = errorMessage.match(/Expecting: one of these possible Token sequences:\s*(.+?)(?:\n|$)/s);
  if (multiExpectedMatch) {
    const sequences = multiExpectedMatch[1].split('\n').map(s => s.trim()).filter(s => s);
    expected = sequences;
  }

  // If no location found, try to extract from any part of the error message
  let line = 1;
  let column = 1;
  
  if (locationMatch) {
    line = parseInt(locationMatch[1]);
    column = parseInt(locationMatch[2]);
  } else {
    // Look for any numbers that might indicate position
    const numberMatch = errorMessage.match(/(\d+)/);
    if (numberMatch) {
      const num = parseInt(numberMatch[1]);
      // If it's a reasonable line number (1-1000), use it
      if (num >= 1 && num <= 1000) {
        line = num;
      }
    }
  }

  return {
    type: 'parser',
    title: 'Syntax Error',
    message: cleanParserMessage(errorMessage),
    location: {
      line: line,
      column: column
    },
    context: {
      token: foundToken,
      expected: expected
    },
    suggestion: generateParserSuggestion(expected, foundToken)
  };
}

function cleanParserMessage(message: string): string {
  // Remove verbose Chevrotain details and make it more user-friendly
  return message
    .replace(/Expecting token of type --> (.+?) <-- but found --> '(.+?)' <--/, 'Expected $1, but found "$2"')
    .replace(/at offset: \d+,\d+/, '')
    .replace(/Expecting: one of these possible Token sequences:[\s\S]*/, 'Multiple valid options available')
    .trim();
}

function generateLexerSuggestion(error: LexerError): string {
  if (error.message.includes('unexpected character')) {
    return 'Remove or escape the unexpected character. Check for typos in your DSL syntax.';
  }
  return 'Check your syntax. Make sure all elements follow the correct DSL format.';
}

function generateParserSuggestion(expected: string[], foundToken: string): string {
  if (expected.length === 0) {
    return 'Check your syntax and ensure all elements are properly formatted.';
  }

  const suggestions: { [key: string]: string } = {
    'Identifier': 'Provide a valid name (letters, numbers, underscores only)',
    'Colon': 'Add a colon (:) after the element name',
    'Button': 'Use button syntax: @[Button Text](action)',
    'Link': 'Use link syntax: #[Link Text](target)',
    'Heading': 'Use heading syntax: # Heading Text',
    'Text': 'Use text syntax: > Your text here',
    'Input': 'Use input syntax: ___:Label{Placeholder}',
    'Image': 'Use image syntax: ![Alt Text](image-url)',
    'List': 'Use list syntax with list: followed by indented items',
    'Screen': 'Declare screens with: screen ScreenName:',
    'Component': 'Declare components with: component ComponentName:',
    'Modal': 'Declare modals with: modal ModalName:',
    'Drawer': 'Declare drawers with: drawer DrawerName:'
  };

  const suggestion = expected.map(exp => suggestions[exp] || `Use ${exp.toLowerCase()} syntax`).join(' or ');
  
  if (foundToken) {
    return `Expected ${expected.join(' or ')}, but found "${foundToken}". ${suggestion}`;
  }
  
  return suggestion;
}

/**
 * Extracts code context around an error location
 */
export function getErrorContext(code: string, line: number, column: number, contextLines = 2): string {
  const lines = code.split('\n');
  const startLine = Math.max(0, line - contextLines - 1);
  const endLine = Math.min(lines.length - 1, line + contextLines - 1);
  
  let context = '';
  for (let i = startLine; i <= endLine; i++) {
    const lineNum = i + 1;
    const isErrorLine = lineNum === line;
    const prefix = isErrorLine ? '>>> ' : '    ';
    context += `${prefix}${lineNum.toString().padStart(3)}: ${lines[i]}\n`;
    
    if (isErrorLine && column > 0) {
      // Add pointer to the error column
      const pointer = ' '.repeat(prefix.length + 4 + column - 1) + '^';
      context += pointer + '\n';
    }
  }
  
  return context.trim();
}
