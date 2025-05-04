import { describe, it, expect } from 'vitest';
import { tokenize } from '../../core/lexer/lexer';

describe('Lexer', () => {
  it('should tokenize a simple screen declaration', () => {
    const input = '@screen Login:';
    const result = tokenize(input);
    
    expect(result.errors).toHaveLength(0);
    expect(result.tokens).toHaveLength(3); // Screen, Identifier, Colon
    expect(result.tokens[0].tokenType.name).toBe('Screen');
    expect(result.tokens[1].tokenType.name).toBe('Identifier');
    expect(result.tokens[1].image).toBe('Login');
    expect(result.tokens[2].tokenType.name).toBe('Colon');
  });

  it('should tokenize indented content correctly', () => {
    const input = `@screen Dashboard:
  # My Dashboard`;
    
    const result = tokenize(input);
    
    expect(result.errors).toHaveLength(0);
    expect(result.tokens.length).toBeGreaterThan(3);
    expect(result.tokens.some(token => token.tokenType.name === 'Indent')).toBe(true);
    expect(result.tokens.some(token => token.tokenType.name === 'Heading')).toBe(true);
  });

  it('should tokenize complex elements', () => {
    const input = `@screen Example:
  # Heading
  > Paragraph text
  @[Button]
  #[Link](Destination)
  card:
    ## Card heading
    @[Card Action]`;
    
    const result = tokenize(input);
    
    expect(result.errors).toHaveLength(0);
    expect(result.tokens.some(token => token.tokenType.name === 'Heading')).toBe(true);
    expect(result.tokens.some(token => token.tokenType.name === 'Text')).toBe(true);
    expect(result.tokens.some(token => token.tokenType.name === 'Button')).toBe(true);
    expect(result.tokens.some(token => token.tokenType.name === 'Link')).toBe(true);
    expect(result.tokens.some(token => token.tokenType.name === 'Card')).toBe(true);
  });

  it('should handle multiple levels of indentation', () => {
    const input = `@screen NestedExample:
  card:
    row:
      col:
        # Content
      col:
        # More content`;
    
    const result = tokenize(input);
    
    expect(result.errors).toHaveLength(0);
    
    // Count indents and outdents
    const indents = result.tokens.filter(token => token.tokenType.name === 'Indent').length;
    const outdents = result.tokens.filter(token => token.tokenType.name === 'Outdent').length;
    
    // Should have multiple indents for the nested structure
    expect(indents).toBeGreaterThan(1);
    // Outdents should be added to balance indents eventually
    expect(outdents).toBeGreaterThanOrEqual(indents);
  });

  it('should throw error for invalid syntax', () => {
    // The problem is that '@screen :' is actually valid syntax for the lexer
    // Let's try an invalid indentation pattern which will trigger an error
    const input = `@screen Test:
  # Content
 # Invalid indentation - less spaces than the established pattern`;
    
    expect(() => tokenize(input)).toThrow();
  });
});