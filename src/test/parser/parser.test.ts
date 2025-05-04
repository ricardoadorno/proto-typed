import { describe, it, expect } from 'vitest';
import { parseInput } from '../../core/parser/parser';

describe('Parser', () => {
  it('should parse a basic screen', () => {
    const input = '@screen Login:';
    
    const cst = parseInput(input);
    
    expect(cst).toBeDefined();
    expect(cst.name).toBe('program');
    expect(cst.children.screen).toBeDefined();
    expect(cst.children.screen.length).toBe(1);
  });
  
  it('should parse screens with nested elements', () => {
    const input = `@screen Dashboard:
  # Main Dashboard
  > Welcome to your dashboard
  card:
    ## Card title
    @[Action Button]`;
    
    const cst = parseInput(input);
    
    expect(cst).toBeDefined();
    expect(cst.children.screen.length).toBe(1);
    
    // Screen should have elements
    const screenNode = cst.children.screen[0];
    expect(screenNode.children.element).toBeDefined();
    expect(screenNode.children.element.length).toBeGreaterThan(0);
  });

  it('should parse multiple screens', () => {
    const input = `@screen First:
  # First Screen
  
@screen Second:
  # Second Screen`;
    
    const cst = parseInput(input);
    
    expect(cst).toBeDefined();
    expect(cst.children.screen.length).toBe(2);
    
    // Check screen names
    const firstScreen = cst.children.screen[0];
    const secondScreen = cst.children.screen[1];
    
    expect(firstScreen.children.name[0].image).toBe('First');
    expect(secondScreen.children.name[0].image).toBe('Second');
  });

  it('should parse layout elements correctly', () => {
    const input = `@screen Layout:
  row:
    col:
      # Content in first column
    col:
      # Content in second column`;
    
    const cst = parseInput(input);
    
    expect(cst).toBeDefined();
    
    // Navigate to the row element
    const screen = cst.children.screen[0];
    const rowElement = screen.children.element.find(
      (el: any) => el.children.rowElement !== undefined
    );
    
    expect(rowElement).toBeDefined();
    expect(rowElement.children.rowElement[0].children.blockElement).toBeDefined();
  });

  it('should throw error for invalid syntax', () => {
    const input = '@screen Missing Colon';
    
    expect(() => parseInput(input)).toThrow();
  });
});