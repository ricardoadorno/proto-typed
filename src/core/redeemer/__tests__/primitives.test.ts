import { describe, test, expect } from '@jest/globals';
import { redeemButton, redeemLink, redeemHeading, redeemText, redeemParagraph } from '../nodes/primitives.redeemer';
import { ImportManager } from '../infrastructure/import-manager';
import { AstNode } from '../../../types/ast-node';

describe('Primitives Redeemer', () => {
  describe('redeemButton', () => {
    test('should convert simple button', () => {
      const importManager = new ImportManager();
      const node: AstNode = {
        type: 'Button',
        id: 'btn-1',
        props: { text: 'Click me', variant: 'primary' },
        children: []
      };

      const result = redeemButton(node, importManager);

      expect(result).toContain('<Button');
      expect(result).toContain('Click me');
      expect(importManager.generateImports()).toContain('Button');
    });

    test('should handle button with icon', () => {
      const importManager = new ImportManager();
      const node: AstNode = {
        type: 'Button',
        id: 'btn-2',
        props: { text: 'Delete', variant: 'danger', icon: 'trash' },
        children: []
      };

      const result = redeemButton(node, importManager);

      expect(result).toContain('variant="destructive"');
      expect(result).toContain('Trash');
      expect(importManager.generateImports()).toContain('Trash');
    });

    test('should handle button with action', () => {
      const importManager = new ImportManager();
      const node: AstNode = {
        type: 'Button',
        id: 'btn-3',
        props: { text: 'Navigate', action: '@dashboard' },
        children: []
      };

      const result = redeemButton(node, importManager);

      expect(result).toContain('onClick');
      expect(result).toContain('navigateTo');
    });
  });

  describe('redeemLink', () => {
    test('should convert internal link', () => {
      const importManager = new ImportManager();
      const node: AstNode = {
        type: 'Link',
        id: 'link-1',
        props: { text: 'Home', destination: '/home' },
        children: []
      };

      const result = redeemLink(node, importManager);

      expect(result).toContain('<Link');
      expect(result).toContain('/home');
      expect(result).toContain('Home');
      expect(importManager.generateImports()).toContain('Link');
    });

    test('should convert external link', () => {
      const importManager = new ImportManager();
      const node: AstNode = {
        type: 'Link',
        id: 'link-2',
        props: { text: 'Google', destination: 'https://google.com' },
        children: []
      };

      const result = redeemLink(node, importManager);

      expect(result).toContain('<a');
      expect(result).toContain('target="_blank"');
      expect(result).toContain('https://google.com');
    });
  });

  describe('redeemHeading', () => {
    test('should convert heading with correct level', () => {
      const node: AstNode = {
        type: 'Heading',
        id: 'h-1',
        props: { level: 2, content: 'Welcome' },
        children: []
      };

      const result = redeemHeading(node);

      expect(result).toContain('<h2');
      expect(result).toContain('Welcome');
      expect(result).toContain('text-3xl');
    });
  });

  describe('redeemText', () => {
    test('should convert normal text', () => {
      const node: AstNode = {
        type: 'Text',
        id: 'text-1',
        props: { content: 'Hello world' },
        children: []
      };

      const result = redeemText(node);

      expect(result).toContain('<span');
      expect(result).toContain('Hello world');
    });

    test('should convert muted text', () => {
      const node: AstNode = {
        type: 'MutedText',
        id: 'text-2',
        props: { content: 'Subtle text' },
        children: []
      };

      const result = redeemText(node);

      expect(result).toContain('text-muted-foreground');
      expect(result).toContain('Subtle text');
    });
  });

  describe('redeemParagraph', () => {
    test('should convert paragraph', () => {
      const node: AstNode = {
        type: 'Paragraph',
        id: 'p-1',
        props: { content: 'This is a paragraph' },
        children: []
      };

      const result = redeemParagraph(node);

      expect(result).toContain('<p');
      expect(result).toContain('This is a paragraph');
    });
  });
});
