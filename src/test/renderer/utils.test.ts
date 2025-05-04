import { describe, it, expect } from 'vitest';
import { escapeHtml, attributesToHtml } from '../../core/renderer/utils';

describe('Renderer Utils', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<div class="test">Hello & world</div>';
      const expected = '&lt;div class=&quot;test&quot;&gt;Hello &amp; world&lt;/div&gt;';
      
      expect(escapeHtml(input)).toBe(expected);
    });
    
    it('should handle strings with no special characters', () => {
      const input = 'Hello world';
      
      expect(escapeHtml(input)).toBe(input);
    });
    
    it('should handle all special characters', () => {
      expect(escapeHtml('<')).toBe('&lt;');
      expect(escapeHtml('>')).toBe('&gt;');
      expect(escapeHtml('&')).toBe('&amp;');
      expect(escapeHtml('"')).toBe('&quot;');
      expect(escapeHtml('\'')).toBe('&#039;');
    });
  });
  
  describe('attributesToHtml', () => {
    it('should convert object to HTML attributes', () => {
      const props = {
        id: 'test-id',
        class: 'test-class',
        disabled: true,
        'data-test': 'value'
      };
      
      const html = attributesToHtml(props);
      
      expect(html).toContain('id="test-id"');
      expect(html).toContain('class="test-class"');
      expect(html).toContain('disabled');
      expect(html).toContain('data-test="value"');
    });
    
    it('should skip the children prop', () => {
      const props = {
        id: 'test-id',
        children: 'Content that should be skipped'
      };
      
      const html = attributesToHtml(props);
      
      expect(html).toContain('id="test-id"');
      expect(html).not.toContain('children');
      expect(html).not.toContain('Content that should be skipped');
    });
    
    it('should handle empty props', () => {
      const html = attributesToHtml({});
      
      expect(html).toBe('');
    });
    
    it('should handle null/undefined props', () => {
      expect(attributesToHtml(null as any)).toBe('');
      expect(attributesToHtml(undefined as any)).toBe('');
    });
    
    it('should handle boolean values correctly', () => {
      const props = {
        checked: true,
        disabled: false
      };
      
      const html = attributesToHtml(props);
      
      expect(html).toContain('checked');
      expect(html).not.toContain('disabled');
    });
    
    it('should handle numeric values', () => {
      const props = {
        width: 100,
        height: 200
      };
      
      const html = attributesToHtml(props);
      
      expect(html).toContain('width="100"');
      expect(html).toContain('height="200"');
    });
  });
});