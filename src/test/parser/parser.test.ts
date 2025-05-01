import { describe, test, expect } from 'vitest';
import { parseInput } from '../../core/parser';
import { parser } from '../../core/parser/parser';
import { astBuilder } from '../../core/parser/astBuilder';

describe('Parser Tests', () => {
  test('should parse a simple screen', () => {
    const input = '@screen Home:\n  # Welcome';
    const cst = parseInput(input);
    
    expect(cst).toBeDefined();
    expect(parser.errors).toHaveLength(0);
    
    // Verify screen name in CST
    expect(cst.children.name[0].image).toBe('Home');
    
    // Convert to AST
    const ast = astBuilder.visit(cst);
    expect(ast.type).toBe('Screen');
    expect(ast.name).toBe('Home');
    expect(ast.elements).toHaveLength(1);
    expect(ast.elements[0].type).toBe('Heading');
  });

  test('should parse layout elements correctly', () => {
    const input = `@screen Layout:
  card:
    # Card Title
    row:
      col:
        > Column 1`;
    
    const cst = parseInput(input);
    expect(parser.errors).toHaveLength(0);
    
    const ast = astBuilder.visit(cst);
    expect(ast.type).toBe('Screen');
    expect(ast.name).toBe('Layout');
    
    // Check card element
    const cardElement = ast.elements[0];
    expect(cardElement.type).toBe('Card');
    expect(cardElement.elements).toHaveLength(2); // Heading and Row
    
    // Check row element
    const rowElement = cardElement.elements[1];
    expect(rowElement.type).toBe('Row');
    expect(rowElement.elements).toHaveLength(1); // One column
    
    // Check column
    expect(rowElement.elements[0].type).toBe('Column');
  });

  test('should parse interactive elements correctly', () => {
    const inputStr = `@screen Interactive:
  @[Submit Button]
  #[Link Text](https://example.com)
  __ type="text" placeholder="Input Field"
  [X] Checked checkbox`;
    
    const cst = parseInput(inputStr);
    expect(parser.errors).toHaveLength(0);
    
    const ast = astBuilder.visit(cst);
    
    // Check elements array
    expect(ast.elements).toHaveLength(4);
    
    // Verify button
    const button = ast.elements[0];
    expect(button.type).toBe('Button');
    expect(button.props.children).toBe('Submit Button');
    
    // Verify link
    const link = ast.elements[1];
    expect(link.type).toBe('Link');
    expect(link.props.href).toBe('https://example.com');
    expect(link.props.children).toBe('Link Text');
    
    // Verify input
    const input = ast.elements[2];
    expect(input.type).toBe('Input');
    expect(input.props.type).toBe('text');
    expect(input.props.placeholder).toBe('Input Field');
    
    // Verify checkbox - the parser creates a CheckboxGroup for single checkboxes
    const checkbox = ast.elements[3];
    expect(checkbox.type).toBe('CheckboxGroup');
    expect(checkbox.props.options[0].checked).toBe(true);
  });

  test('should throw error for malformed input', () => {
    const input = '@screen MissingColon\n  # Heading';
    
    expect(() => {
      parseInput(input);
    }).toThrow();
  });

  test('should parse ordered and unordered lists', () => {
    const input = `@screen Lists:
  1. First item
  2. Second item
  3. Third item
  - Bullet one
  - Bullet two`;
    
    const cst = parseInput(input);
    expect(parser.errors).toHaveLength(0);
    
    const ast = astBuilder.visit(cst);
    expect(ast.type).toBe('Screen');
    expect(ast.name).toBe('Lists');
    
    // First element should be an ordered list
    const orderedList = ast.elements[0];
    expect(orderedList.type).toBe('OrderedList');
    expect(orderedList.props.items).toHaveLength(3);
    expect(orderedList.props.items[0]).toBe('First item');
    expect(orderedList.props.items[1]).toBe('Second item');
    expect(orderedList.props.items[2]).toBe('Third item');
    
    // Second element should be an unordered list
    const unorderedList = ast.elements[1];
    expect(unorderedList.type).toBe('UnorderedList');
    expect(unorderedList.props.items).toHaveLength(2);
    expect(unorderedList.props.items[0]).toBe('Bullet one');
    expect(unorderedList.props.items[1]).toBe('Bullet two');
  });

  test('should parse text variants correctly', () => {
    const input = `@screen TextVariants:
  > Regular text
  *> Note text
  "> Quote text`;
    
    const cst = parseInput(input);
    expect(parser.errors).toHaveLength(0);
    
    const ast = astBuilder.visit(cst);
    
    // Should have three paragraphs with different variants
    expect(ast.elements).toHaveLength(3);
    
    const regText = ast.elements[0];
    expect(regText.type).toBe('Paragraph');
    expect(regText.props.variant).toBe('text');
    expect(regText.props.children).toBe('Regular text');
    
    const noteText = ast.elements[1];
    expect(noteText.type).toBe('Paragraph');
    expect(noteText.props.variant).toBe('note');
    expect(noteText.props.children).toBe('Note text');
    
    const quoteText = ast.elements[2];
    expect(quoteText.type).toBe('Paragraph');
    expect(quoteText.props.variant).toBe('quote');
    expect(quoteText.props.children).toBe('Quote text');
  });

  test('should parse image elements', () => {
    const input = `@screen Images:
  ![Image Alt Text](https://example.com/image.jpg)
  ![Image Without URL]`;
    
    const cst = parseInput(input);
    expect(parser.errors).toHaveLength(0);
    
    const ast = astBuilder.visit(cst);
    
    // Should have two image elements
    expect(ast.elements).toHaveLength(2);
    
    const image1 = ast.elements[0];
    expect(image1.type).toBe('Image');
    expect(image1.props.src).toBe('https://example.com/image.jpg');
    expect(image1.props.alt).toBe('Image Alt Text');
    
    const image2 = ast.elements[1];
    expect(image2.type).toBe('Image');
    expect(image2.props.src).toBe('');
    expect(image2.props.alt).toBe('Image Without URL');
  });

  test('should handle radio buttons correctly', () => {
    const input = `@screen RadioTest:
  (X) Option 1
  ( ) Option 2
  ( ) Option 3`;
    
    const cst = parseInput(input);
    expect(parser.errors).toHaveLength(0);
    
    const ast = astBuilder.visit(cst);
    
    // Should have a single radio group element
    expect(ast.elements).toHaveLength(1);
    
    const radioGroup = ast.elements[0];
    expect(radioGroup.type).toBe('RadioGroup');
    expect(radioGroup.props.options).toHaveLength(3);
    
    // First option should be selected
    expect(radioGroup.props.options[0].selected).toBe(true);
    expect(radioGroup.props.options[0].label).toBe('Option 1');
    
    // Other options should not be selected
    expect(radioGroup.props.options[1].selected).toBe(false);
    expect(radioGroup.props.options[1].label).toBe('Option 2');
    expect(radioGroup.props.options[2].selected).toBe(false);
    expect(radioGroup.props.options[2].label).toBe('Option 3');
  });
});