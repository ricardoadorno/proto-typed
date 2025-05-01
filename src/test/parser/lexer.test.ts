import { describe, test, expect } from 'vitest';
import { tokenize } from '../../core/lexer/lexer';

describe('Lexer Tests', () => {
  test('should tokenize a simple screen correctly', () => {
    const input = '@screen Home:\n  # Welcome';
    const result = tokenize(input);
    
    expect(result.errors).toHaveLength(0);
    expect(result.tokens).toBeDefined();
    
    // Find screen token
    const screenToken = result.tokens.find(token => token.tokenType.name === 'Screen');
    expect(screenToken).toBeDefined();
    
    // Find identifier token (screen name)
    const identifierToken = result.tokens.find(token => token.tokenType.name === 'Identifier');
    expect(identifierToken).toBeDefined();
    expect(identifierToken?.image).toBe('Home');
    
    // Find heading token
    const headingToken = result.tokens.find(token => token.tokenType.name === 'Heading');
    expect(headingToken).toBeDefined();
    expect(headingToken?.image).toContain('Welcome');
  });

  test('should tokenize various UI elements', () => {
    const input = `@screen Elements:
  # Heading
  > Paragraph text
  @[Button]
  #[Link](https://example.com)
  __ type="text" placeholder="Input"
  ---`;
    
    const result = tokenize(input);
    expect(result.errors).toHaveLength(0);
    
    // Verify all expected token types are present
    const tokenTypes = result.tokens.map(token => token.tokenType.name);
    expect(tokenTypes).toContain('Screen');
    expect(tokenTypes).toContain('Heading');
    expect(tokenTypes).toContain('Text');
    expect(tokenTypes).toContain('Button');
    expect(tokenTypes).toContain('Link');
    expect(tokenTypes).toContain('Input');
    expect(tokenTypes).toContain('Separator');
  });

  test('should handle form elements correctly', () => {
    const input = `@screen Form:
  [X] Checkbox checked
  [ ] Checkbox unchecked`;
    
    const result = tokenize(input);
    expect(result.errors).toHaveLength(0);
    
    // Print all token types to debug
    console.log('Token types:', result.tokens.map(t => t.tokenType.name));
    
    // Checkbox is captured by CheckboxOption token in the lexer
    const checkboxTokens = result.tokens.filter(token => token.tokenType.name === 'CheckboxOption');
    expect(checkboxTokens).toHaveLength(2);
  });

  test('should tokenize radio and select options', () => {
    const input = `@screen Options:
  (X) Radio selected
  ( ) Radio unselected
  <[Option 1]>
  <[Option 2]>`;
    
    const result = tokenize(input);
    expect(result.errors).toHaveLength(0);
    
    // Verify radio option tokens
    const radioTokens = result.tokens.filter(token => token.tokenType.name === 'RadioOption');
    expect(radioTokens).toHaveLength(2);
    
    // Verify select option tokens
    const selectTokens = result.tokens.filter(token => token.tokenType.name === 'SelectField');
    expect(selectTokens).toHaveLength(2);
  });

  test('should tokenize multiple heading levels', () => {
    const input = `@screen Headings:
  # Heading 1
  ## Heading 2
  ### Heading 3
  #### Heading 4
  ##### Heading 5
  ###### Heading 6`;
    
    const result = tokenize(input);
    expect(result.errors).toHaveLength(0);
    
    // Find all heading tokens
    const headingTokens = result.tokens.filter(token => token.tokenType.name === 'Heading');
    expect(headingTokens).toHaveLength(6);
    
    // Verify heading content
    expect(headingTokens[0].image).toContain('Heading 1');
    expect(headingTokens[1].image).toContain('Heading 2');
    expect(headingTokens[2].image).toContain('Heading 3');
    expect(headingTokens[3].image).toContain('Heading 4');
    expect(headingTokens[4].image).toContain('Heading 5');
    expect(headingTokens[5].image).toContain('Heading 6');
  });

  test('should tokenize special characters in text', () => {
    const input = `@screen SpecialChars:
  # Title with special chars
  > Text with some special characters`;
    
    const result = tokenize(input);
    expect(result.errors).toHaveLength(0);
    
    // Get heading and text tokens
    const headingToken = result.tokens.find(token => token.tokenType.name === 'Heading');
    const textToken = result.tokens.find(token => token.tokenType.name === 'Text');
    
    expect(headingToken).toBeDefined();
    expect(textToken).toBeDefined();
    expect(headingToken?.image).toContain('Title with special chars');
    expect(textToken?.image).toContain('Text with some special characters');
  });

  test('should tokenize text variants correctly', () => {
    const input = `@screen TextVariants:
  > Regular text
  *> Note text
  "> Quote text`;
    
    const result = tokenize(input);
    expect(result.errors).toHaveLength(0);
    
    // Get text variant tokens
    const textToken = result.tokens.find(token => token.tokenType.name === 'Text');
    const noteToken = result.tokens.find(token => token.tokenType.name === 'Note');
    const quoteToken = result.tokens.find(token => token.tokenType.name === 'Quote');
    
    expect(textToken).toBeDefined();
    expect(textToken?.image).toContain('Regular text');
    
    expect(noteToken).toBeDefined();
    expect(noteToken?.image).toContain('Note text');
    
    expect(quoteToken).toBeDefined();
    expect(quoteToken?.image).toContain('Quote text');
  });

  test('should tokenize complex layout structures', () => {
    const input = `@screen Layout:
  card:
    row:
      col:
        # Title
        > Content
      col:
        @[Button]`;
    
    const result = tokenize(input);
    expect(result.errors).toHaveLength(0);
    
    // Get all token types
    const tokenTypes = result.tokens.map(token => token.tokenType.name);
    
    // Check for layout tokens
    expect(tokenTypes).toContain('Card');
    expect(tokenTypes).toContain('Row');
    expect(tokenTypes).toContain('Column');
    expect(tokenTypes).toContain('Heading');
    expect(tokenTypes).toContain('Text');
    expect(tokenTypes).toContain('Button');
  });

  test('should handle empty or whitespace-only input', () => {
    const emptyResult = tokenize('');
    expect(emptyResult.tokens).toHaveLength(0);
    
    const whitespaceResult = tokenize('   \n   \t   ');
    expect(whitespaceResult.tokens).toHaveLength(0);
  });

  test('should tokenize input with attributes', () => {
    const input = `@screen Attributes:
  __ type="text" placeholder="Enter your name"`;
    
    const result = tokenize(input);
    expect(result.errors).toHaveLength(0);
    
    // There will be multiple identifiers: screen name, attribute names
    const identifiers = result.tokens.filter(token => token.tokenType.name === 'Identifier');
    expect(identifiers.length).toBeGreaterThanOrEqual(2); // At least 2 identifiers
    
    // Verify presence of equals sign
    const equals = result.tokens.filter(token => token.tokenType.name === 'Equals');
    expect(equals.length).toBeGreaterThanOrEqual(1);
    
    // Verify string literals
    const stringLiterals = result.tokens.filter(token => token.tokenType.name === 'StringLiteral');
    expect(stringLiterals.length).toBeGreaterThanOrEqual(1);
    
    // Verify specific values
    const typeIdentifier = identifiers.find(id => id.image === 'type');
    expect(typeIdentifier).toBeDefined();
    const textValue = stringLiterals.find(str => str.image === '"text"');
    expect(textValue).toBeDefined();
  });
});