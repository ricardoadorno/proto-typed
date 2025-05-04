import { describe, it, expect } from 'vitest';
import { astToHtml, astToHtmlDocument } from '../../core/renderer/astToHtml';
import { parseInput } from '../../core/parser/parser';
import { astBuilder } from '../../core/parser/astBuilder';

describe('HTML Renderer', () => {
  describe('astToHtml', () => {
    it('should render a single screen correctly', () => {
      const input = `@screen Test:
  # Hello World`;
      
      const cst = parseInput(input);
      const ast = astBuilder.visit(cst);
      
      const html = astToHtml(ast);
      
      expect(html).toContain('<div id="test-screen" class="screen container test"');
      expect(html).toContain('<h1>Hello World</h1>');
    });
    
    it('should render multiple screens with the first one visible', () => {
      const input = `@screen First:
  # First Screen
  
@screen Second:
  # Second Screen`;
      
      const cst = parseInput(input);
      const ast = astBuilder.visit(cst);
      
      const html = astToHtml(ast);
      
      // First screen should be visible
      expect(html).toContain('<div id="first-screen" class="screen container first"');
      expect(html).not.toContain('<div id="first-screen" class="screen container first" style="display:none">');
      
      // Second screen should be hidden
      expect(html).toContain('<div id="second-screen" class="screen container second" style="display:none">');
    });
    
    it('should respect the currentScreen option', () => {
      const input = `@screen First:
  # First Screen
  
@screen Second:
  # Second Screen`;
      
      const cst = parseInput(input);
      const ast = astBuilder.visit(cst);
      
      const html = astToHtml(ast, { currentScreen: 'second' });
      
      // First screen should be hidden
      expect(html).toContain('<div id="first-screen" class="screen container first" style="display:none">');
      
      // Second screen should be visible
      expect(html).toContain('<div id="second-screen" class="screen container second"');
      expect(html).not.toContain('<div id="second-screen" class="screen container second" style="display:none">');
    });
    
    it('should handle empty screens array', () => {
      const html = astToHtml([]);
      expect(html).toBe('');
    });
    
    it('should filter out non-screen nodes', () => {
      const invalidAst = [
        { type: 'NotAScreen', name: 'Invalid' },
        { type: 'Screen', name: 'Valid', elements: [] }
      ];
      
      const html = astToHtml(invalidAst as any);
      
      expect(html).not.toContain('invalid');
      expect(html).toContain('valid');
    });
  });
  
  describe('astToHtmlDocument', () => {
    it('should generate a complete HTML document', () => {
      const input = `@screen Test:
  # Hello World`;
      
      const cst = parseInput(input);
      const ast = astBuilder.visit(cst);
      
      const html = astToHtmlDocument(ast);
      
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html lang="en">');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('<div class="screen container test"');
      expect(html).toContain('<h1>Hello World</h1>');
      expect(html).toContain('<script>');
      expect(html).toContain('function showScreen(screenName)');
    });
    
    it('should include navigation script in the document', () => {
      const input = `@screen First:
  #[Go to Second](Second)
  
@screen Second:
  #[Go to First](First)`;
      
      const cst = parseInput(input);
      const ast = astBuilder.visit(cst);
      
      const html = astToHtmlDocument(ast);
      
      // Check for navigation links
      expect(html).toContain('<a href="#Second" data-screen-link="Second">Go to Second</a>');
      expect(html).toContain('<a href="#First" data-screen-link="First">Go to First</a>');
      
      // Check for navigation script
      expect(html).toContain('document.addEventListener(\'click\'');
      expect(html).toContain('showScreen(screenName)');
    });
  });
});