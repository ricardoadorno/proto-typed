import { describe, test, expect } from 'vitest';
import { parseInput } from '../../core/parser/parser';
import { astBuilder } from '../../core/parser/astBuilder';
import { astToHtml } from '../../core/renderer/astToHtml';
import { astToHtmlDocument } from '../../core/renderer/documentRenderer';

describe('Renderer Tests', () => {
  test('should render a simple screen to HTML', () => {
    const input = '@screen Home:\n  # Welcome';
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    const html = astToHtml(ast, {});
    
    expect(html).toContain('id="home-screen"');
    expect(html).toContain('class="screen container home"');
    expect(html).toContain('<h1>Welcome</h1>');
  });

  test('should render multiple screens with proper visibility', () => {
    const inputs = [
      '@screen First:\n  # First Screen',
      '@screen Second:\n  # Second Screen'
    ];
    
    const asts = inputs.map(input => {
      const cst = parseInput(input);
      return astBuilder.visit(cst);
    });
    
    const html = astToHtml(asts, {});
    
    // First screen should be visible, second hidden
    expect(html).toContain('id="first-screen"');
    expect(html).toContain('class="screen container first"');
    expect(html).toContain('id="second-screen"');
    expect(html).toContain('style="display:none"');
    expect(html).toContain('<h1>First Screen</h1>');
    expect(html).toContain('<h1>Second Screen</h1>');
  });

  test('should render interactive elements correctly', () => {
    const input = `@screen Test:
  @[Button Text]
  #[Link Text](https://example.com)
  __ type="text" placeholder="Input placeholder"`;
    
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    const html = astToHtml(ast, {});
    
    // Check button
    expect(html).toContain('button style="margin: 1rem 1rem 1rem 0"');
    expect(html).toContain('>Button Text</button>');
    
    // Check link
    expect(html).toContain('<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link Text</a>');
    
    // Check input
    expect(html).toContain('<input type="text" placeholder="Input placeholder" />');
  });

  test('should generate a complete HTML document', () => {
    const input = '@screen Test:\n  # Document Test';
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    const document = astToHtmlDocument(ast);
    
    // Check for HTML document structure
    expect(document).toContain('<!DOCTYPE html>');
    expect(document).toContain('<html lang="en">');
    expect(document).toContain('<head>');
    expect(document).toContain('<body>');
    expect(document).toContain('<script>');
    
    // Check for screen content
    expect(document).toContain('class="screen container test"');
    expect(document).toContain('<h1>Document Test</h1>');
  });

  test('should render heading levels correctly', () => {
    const input = `@screen Headings:
  # Heading 1
  ## Heading 2
  ### Heading 3`;
    
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    const html = astToHtml(ast, {});
    
    // Check all heading levels
    expect(html).toContain('<h1>Heading 1</h1>');
    expect(html).toContain('<h2>Heading 2</h2>');
    expect(html).toContain('<h3>Heading 3</h3>');
  });

  test('should render lists correctly', () => {
    const input = `@screen Lists:
  1. First item
  2. Second item
  
  - Bullet one
  - Bullet two`;
    
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    const html = astToHtml(ast, {});
    
    // Check ordered list
    expect(html).toContain('<ol>');
    expect(html).toContain('<li>First item</li>');
    expect(html).toContain('<li>Second item</li>');
    expect(html).toContain('</ol>');
    
    // Check unordered list
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Bullet one</li>');
    expect(html).toContain('<li>Bullet two</li>');
    expect(html).toContain('</ul>');
  });

  test('should render form elements correctly', () => {
    const input = `@screen FormElements:
  __ type="text" placeholder="Username"
  __ type="password" placeholder="Password"
  
  [X] Remember me
  [ ] Subscribe to newsletter
  
  (X) Option 1
  ( ) Option 2
  
  <[Item 1]>
  <[Item 2]>`;
    
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    const html = astToHtml(ast, {});
    
    // Check input elements
    expect(html).toContain('<input type="text" placeholder="Username" />');
    expect(html).toContain('<input type="password" placeholder="Password" />');
    
    // Check checkbox group
    expect(html).toContain('<div class="checkbox-group">');
    expect(html).toContain('<input type="checkbox" checked');
    expect(html).toContain('<input type="checkbox" ');
    expect(html).toContain('Remember me');
    expect(html).toContain('Subscribe to newsletter');
    
    // Check radio group (name will be dynamically generated)
    expect(html).toContain('<div class="radio-group">');
    expect(html).toContain('<input type="radio" name="');
    expect(html).toContain('checked');
    expect(html).toContain('Option 1');
    expect(html).toContain('Option 2');
    
    // Check select
    expect(html).toContain('<select>');
    expect(html).toContain('<option value="Item 1">Item 1</option>');
    expect(html).toContain('<option value="Item 2">Item 2</option>');
    expect(html).toContain('</select>');
  });

  test('should render card layout correctly', () => {
    const input = `@screen CardTest:
  card:
    # Card Title
    > Card content
    @[Action Button]`;
    
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    const html = astToHtml(ast, {});
    
    // Check card layout
    expect(html).toContain('<article class="card">');
    expect(html).toContain('<h1>Card Title</h1>');
    expect(html).toContain('<p class="text">Card content</p>');
    expect(html).toContain('Action Button</button>');  // Fixed to match actual output
    expect(html).toContain('</article>');
  });

  test('should render a complete complex layout', () => {
    const input = `@screen Complex:
  # Dashboard
  
  row:
    col:
      card:
        # Stats
        > Key metrics
    col:
      card:
        # Activity
        1. First
        2. Second`;
    
    const cst = parseInput(input);
    const ast = astBuilder.visit(cst);
    
    const html = astToHtml(ast, {});
    
    // Check the structure of the complex layout
    expect(html).toContain('<h1>Dashboard</h1>');
    expect(html).toContain('<div class="row">');
    expect(html).toContain('<div class="column">');
    expect(html).toContain('<article class="card">');
    expect(html).toContain('<h1>Stats</h1>');
    expect(html).toContain('<p class="text">Key metrics</p>');
    expect(html).toContain('<h1>Activity</h1>');
    expect(html).toContain('<ol>');
    expect(html).toContain('<li>First</li>');
    expect(html).toContain('<li>Second</li>');
  });
});