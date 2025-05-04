import { describe, it, expect } from 'vitest';
import { nodeToHtml } from '../../core/renderer/nodeRenderer';
import { AstNode } from '../../types/astNode';

describe('NodeRenderer', () => {
  it('should render a heading node', () => {
    const node: AstNode = {
      type: 'Heading',
      props: {
        level: 1,
        children: 'Hello World'
      }
    };
    
    const html = nodeToHtml(node);
    
    expect(html).toContain('<h1>');
    expect(html).toContain('Hello World');
    expect(html).toContain('</h1>');
  });
  
  it('should render a paragraph node with different variants', () => {
    const textNode: AstNode = {
      type: 'Paragraph',
      props: {
        variant: 'text',
        children: 'Regular text'
      }
    };
    
    const noteNode: AstNode = {
      type: 'Paragraph',
      props: {
        variant: 'note',
        children: 'Note text'
      }
    };
    
    const quoteNode: AstNode = {
      type: 'Paragraph',
      props: {
        variant: 'quote',
        children: 'Quote text'
      }
    };
    
    const textHtml = nodeToHtml(textNode);
    const noteHtml = nodeToHtml(noteNode);
    const quoteHtml = nodeToHtml(quoteNode);
    
    expect(textHtml).toContain('<p class="text">Regular text</p>');
    expect(noteHtml).toContain('<p class="note">Note text</p>');
    expect(quoteHtml).toContain('<p class="quote">Quote text</p>');
  });
  
  it('should render a button node', () => {
    const node: AstNode = {
      type: 'Button',
      props: {
        children: 'Click Me',
        href: 'action'
      }
    };
    
    const html = nodeToHtml(node);
    
    expect(html).toContain('<button');
    expect(html).toContain('Click Me');
    expect(html).toContain('</button>');
  });
  
  it('should render a link node correctly for internal links', () => {
    const node: AstNode = {
      type: 'Link',
      props: {
        children: 'Go to Login',
        href: 'Login'
      }
    };
    
    const html = nodeToHtml(node);
    
    expect(html).toContain('<a href="#Login"');
    expect(html).toContain('data-screen-link="Login"');
    expect(html).toContain('>Go to Login</a>');
  });
  
  it('should render a link node correctly for external links', () => {
    const node: AstNode = {
      type: 'Link',
      props: {
        children: 'Visit Website',
        href: 'https://example.com'
      }
    };
    
    const html = nodeToHtml(node);
    
    expect(html).toContain('<a href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('>Visit Website</a>');
  });
  
  it('should render an input node', () => {
    const node: AstNode = {
      type: 'Input',
      props: {
        type: 'text',
        placeholder: 'Enter your name'
      }
    };
    
    const html = nodeToHtml(node);
    
    expect(html).toContain('<input');
    expect(html).toContain('type="text"');
    expect(html).toContain('placeholder="Enter your name"');
  });
  
  it('should render a card node with content', () => {
    const node: AstNode = {
      type: 'Card',
      props: {
        className: 'card'
      },
      elements: [[
        {
          type: 'Heading',
          props: {
            level: 2,
            children: 'Card Title'
          }
        },
        {
          type: 'Paragraph',
          props: {
            variant: 'text',
            children: 'Card content'
          }
        }
      ]]
    };
    
    const html = nodeToHtml(node);
    
    expect(html).toContain('<article class="card">');
    expect(html).toContain('<h2>Card Title</h2>');
    expect(html).toContain('<p class="text">Card content</p>');
    expect(html).toContain('</article>');
  });
  
  it('should render a row with columns', () => {
    const node: AstNode = {
      type: 'Row',
      elements: [[
        {
          type: 'Col',
          elements: [[
            {
              type: 'Heading',
              props: {
                level: 3,
                children: 'Column 1'
              }
            }
          ]]
        },
        {
          type: 'Col',
          elements: [[
            {
              type: 'Heading',
              props: {
                level: 3,
                children: 'Column 2'
              }
            }
          ]]
        }
      ]]
    };
    
    const html = nodeToHtml(node);
    
    expect(html).toContain('<div class="grid">');
    expect(html).toContain('<div>');
    expect(html).toContain('<h3>Column 1</h3>');
    expect(html).toContain('<h3>Column 2</h3>');
  });
  
  it('should handle invalid nodes gracefully', () => {
    const invalidNode = null as unknown as AstNode;
    const emptyNode = {} as AstNode;
    const unknownTypeNode = { type: 'Unknown' } as AstNode;
    
    expect(nodeToHtml(invalidNode)).toBe('');
    expect(nodeToHtml(emptyNode)).toBe('');
    expect(nodeToHtml(unknownTypeNode)).toBe('');
  });
});