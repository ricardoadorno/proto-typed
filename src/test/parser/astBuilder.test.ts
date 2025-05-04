import { describe, it, expect } from 'vitest';
import { parseInput } from '../../core/parser/parser';
import { astBuilder } from '../../core/parser/astBuilder';

describe('AstBuilder', () => {
  it('should build an AST from a simple screen', () => {
    const input = '@screen Login:';
    const cst = parseInput(input);
    
    const ast = astBuilder.visit(cst);
    
    expect(ast).toBeDefined();
    expect(Array.isArray(ast)).toBe(true);
    expect(ast.length).toBe(1);
    expect(ast[0].type).toBe('Screen');
    expect(ast[0].name).toBe('Login');
    expect(ast[0].elements).toEqual([]);
  });

  it('should build AST nodes for text elements', () => {
    const input = `@screen TextElements:
  # Heading 1
  ## Heading 2
  > Regular paragraph
  *> Note text
  "> Quote text`;
    
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    expect(ast.length).toBe(1);
    
    const elements = ast[0].elements;
    expect(elements.length).toBe(5);
    
    // Check heading node
    const heading1 = elements[0];
    expect(heading1.type).toBe('Heading');
    expect(heading1.props.level).toBe(1);
    
    // Check heading 2 node
    const heading2 = elements[1];
    expect(heading2.type).toBe('Heading');
    expect(heading2.props.level).toBe(2);
    
    // Check paragraph node
    const paragraph = elements[2];
    expect(paragraph.type).toBe('Paragraph');
    expect(paragraph.props.variant).toBe('text');
    
    // Check note node
    const note = elements[3];
    expect(note.type).toBe('Paragraph');
    expect(note.props.variant).toBe('note');
    
    // Check quote node
    const quote = elements[4];
    expect(quote.type).toBe('Paragraph');
    expect(quote.props.variant).toBe('quote');
  });

  it('should build AST nodes for interactive elements', () => {
    const input = `@screen Interactive:
  @[Submit](action)
  #[Learn more](help)
  ![Image](https://example.com/img.jpg)`;
    
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    const elements = ast[0].elements;
    expect(elements.length).toBe(3);
    
    // Check button node
    const button = elements[0];
    expect(button.type).toBe('Button');
    expect(button.props.children).toBe('Submit');
    expect(button.props.href).toBe('action');
    
    // Check link node
    const link = elements[1];
    expect(link.type).toBe('Link');
    expect(link.props.children).toBe('Learn more');
    expect(link.props.href).toBe('help');
    
    // Check image node
    const image = elements[2];
    expect(image.type).toBe('Image');
    expect(image.props.alt).toBe('Image');
    expect(image.props.src).toBe('https://example.com/img.jpg');
  });

  it('should build AST nodes for form elements', () => {
    const inputText = `@screen Form:
  __ type="text" placeholder="Username"
  [X] Remember me
  ( ) Option A
  (X) Option B
  <[Item 1]>
  <[Item 2]>`;
    
    const cst = parseInput(inputText);
    const ast = astBuilder.visit(cst);
    
    const elements = ast[0].elements;
    
    // Check input node
    const inputElement = elements[0];
    expect(inputElement.type).toBe('Input');
    expect(inputElement.props.type).toBe('text');
    expect(inputElement.props.placeholder).toBe('Username');
    
    // Check checkbox node
    const checkbox = elements[1];
    expect(checkbox.type).toBe('Checkbox');
    expect(checkbox.props.checked).toBe(true);
    expect(checkbox.props.label).toBe('Remember me');
    
    // Check radio group (will be parsed as two separate radio options)
    const radioOptions = elements.filter(el => el.type === 'RadioGroup');
    expect(radioOptions[0].props.options.some((opt: any) => 
      opt.selected === false && opt.label === 'Option A'
    )).toBe(true);
    expect(radioOptions[0].props.options.some((opt: any) => 
      opt.selected === true && opt.label === 'Option B'
    )).toBe(true);
    
    // Check select node
    const select = elements.find(el => el.type === 'Select');
    expect(select.props.options).toContain('Item 1');
    expect(select.props.options).toContain('Item 2');
  });

  it('should build AST nodes for layout elements', () => {
    const input = `@screen Layout:
  card:
    # Card Title
    @[Action]
  
  row:
    col:
      # Column 1
    col:
      # Column 2
  
  ---`;
    
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    const elements = ast[0].elements;
    
    // Check card node
    const card = elements[0];
    expect(card.type).toBe('Card');
    expect(card.elements).toBeDefined();
    expect(card.elements.flat()[0].type).toBe('Heading');
    
    // Check row node
    const row = elements[1];
    expect(row.type).toBe('Row');
    expect(row.elements).toBeDefined();
    
    // Check separator node
    const separator = elements[2];
    expect(separator.type).toBe('Separator');
  });
});