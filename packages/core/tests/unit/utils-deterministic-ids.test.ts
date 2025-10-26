import { describe, it, expect } from 'vitest'
import {
  generateDeterministicIds,
  validateAstIds,
  getAllIds,
} from '../../src/utils/deterministic-ids'
import { AstNode } from '../../src/types/ast-node'

describe('Utils - Deterministic IDs', () => {
  describe('Basic ID Generation', () => {
    it('should generate IDs for simple AST', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: '',
        props: { name: 'MainScreen' },
        children: [],
      }

      const result = generateDeterministicIds(ast) as AstNode

      expect(result.id).toBeTruthy()
      expect(result.id).toMatch(/^screen_/)
    })

    it('should generate IDs for nested elements', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: '',
        props: { name: 'MainScreen' },
        children: [
          {
            type: 'Button',
            id: '',
            props: { text: 'Click me' },
            children: [],
          },
          {
            type: 'Text',
            id: '',
            props: { content: 'Hello' },
            children: [],
          },
        ],
      }

      const result = generateDeterministicIds(ast) as AstNode

      expect(result.id).toBeTruthy()
      expect(result.children[0].id).toBeTruthy()
      expect(result.children[1].id).toBeTruthy()
      expect(result.children[0].id).toMatch(/^button_/)
      expect(result.children[1].id).toMatch(/^text_/)
    })

    it('should generate different IDs for different node types', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: '',
        props: {},
        children: [
          {
            type: 'Button',
            id: '',
            props: { text: 'Button' },
            children: [],
          },
          {
            type: 'Text',
            id: '',
            props: { content: 'Text' },
            children: [],
          },
        ],
      }

      const result = generateDeterministicIds(ast) as AstNode

      expect(result.children[0].id).not.toBe(result.children[1].id)
    })

    it('should handle array of AST nodes', () => {
      const astArray: AstNode[] = [
        {
          type: 'Screen',
          id: '',
          props: { name: 'Screen1' },
          children: [],
        },
        {
          type: 'Screen',
          id: '',
          props: { name: 'Screen2' },
          children: [],
        },
      ]

      const result = generateDeterministicIds(astArray) as AstNode[]

      expect(result[0].id).toBeTruthy()
      expect(result[1].id).toBeTruthy()
      expect(result[0].id).not.toBe(result[1].id)
    })
  })

  describe('Deterministic Behavior', () => {
    it('should generate same IDs for same input', () => {
      const ast: AstNode = {
        type: 'Button',
        id: '',
        props: { text: 'Click me', action: 'submit' },
        children: [],
      }

      const result1 = generateDeterministicIds(
        JSON.parse(JSON.stringify(ast))
      ) as AstNode
      const result2 = generateDeterministicIds(
        JSON.parse(JSON.stringify(ast))
      ) as AstNode

      expect(result1.id).toBe(result2.id)
    })

    it('should generate same IDs for semantically identical nodes', () => {
      const ast1: AstNode = {
        type: 'Button',
        id: '',
        props: { text: 'Submit', action: 'submit' },
        children: [],
      }

      const ast2: AstNode = {
        type: 'Button',
        id: '',
        props: { text: 'Submit', action: 'submit' },
        children: [],
      }

      const result1 = generateDeterministicIds(ast1) as AstNode
      const result2 = generateDeterministicIds(ast2) as AstNode

      expect(result1.id).toBe(result2.id)
    })

    it('should generate different IDs for nodes with different props', () => {
      const ast1: AstNode = {
        type: 'Button',
        id: '',
        props: { text: 'Submit' },
        children: [],
      }

      const ast2: AstNode = {
        type: 'Button',
        id: '',
        props: { text: 'Cancel' },
        children: [],
      }

      const result1 = generateDeterministicIds(ast1) as AstNode
      const result2 = generateDeterministicIds(ast2) as AstNode

      expect(result1.id).not.toBe(result2.id)
    })
  })

  describe('Duplicate Handling', () => {
    it('should handle duplicate siblings with ordinal suffixes', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: '',
        props: {},
        children: [
          {
            type: 'Button',
            id: '',
            props: { text: 'Button' },
            children: [],
          },
          {
            type: 'Button',
            id: '',
            props: { text: 'Button' }, // Same props
            children: [],
          },
          {
            type: 'Button',
            id: '',
            props: { text: 'Button' }, // Same props
            children: [],
          },
        ],
      }

      const result = generateDeterministicIds(ast) as AstNode

      const ids = result.children.map((c) => c.id)
      expect(ids[0]).not.toContain('~')
      expect(ids[1]).toContain('~2')
      expect(ids[2]).toContain('~3')
    })

    it('should not add ordinal suffix to unique siblings', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: '',
        props: {},
        children: [
          {
            type: 'Button',
            id: '',
            props: { text: 'Button 1' },
            children: [],
          },
          {
            type: 'Button',
            id: '',
            props: { text: 'Button 2' },
            children: [],
          },
        ],
      }

      const result = generateDeterministicIds(ast) as AstNode

      expect(result.children[0].id).not.toContain('~')
      expect(result.children[1].id).not.toContain('~')
    })
  })

  describe('ID Reuse', () => {
    it('should reuse IDs from previous AST when nodes match', () => {
      const previousAst: AstNode = {
        type: 'Button',
        id: 'button_abc123',
        props: { text: 'Click me' },
        children: [],
      }

      const newAst: AstNode = {
        type: 'Button',
        id: '',
        props: { text: 'Click me' }, // Same props
        children: [],
      }

      const result = generateDeterministicIds(newAst, previousAst) as AstNode

      expect(result.id).toBe('button_abc123')
    })

    it('should generate new ID when node changes', () => {
      const previousAst: AstNode = {
        type: 'Button',
        id: 'button_abc123',
        props: { text: 'Click me' },
        children: [],
      }

      const newAst: AstNode = {
        type: 'Button',
        id: '',
        props: { text: 'Different text' }, // Changed props
        children: [],
      }

      const result = generateDeterministicIds(newAst, previousAst) as AstNode

      expect(result.id).not.toBe('button_abc123')
    })

    it('should reuse IDs for nested children', () => {
      const previousAst: AstNode = {
        type: 'Screen',
        id: 'screen_xyz789',
        props: { name: 'Main' },
        children: [
          {
            type: 'Button',
            id: 'button_abc123',
            props: { text: 'Click' },
            children: [],
          },
        ],
      }

      const newAst: AstNode = {
        type: 'Screen',
        id: '',
        props: { name: 'Main' },
        children: [
          {
            type: 'Button',
            id: '',
            props: { text: 'Click' },
            children: [],
          },
        ],
      }

      const result = generateDeterministicIds(newAst, previousAst) as AstNode

      expect(result.id).toBe('screen_xyz789')
      expect(result.children[0].id).toBe('button_abc123')
    })
  })

  describe('Validation', () => {
    it('should validate AST with all IDs present', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: 'screen_123',
        props: {},
        children: [
          {
            type: 'Button',
            id: 'button_456',
            props: {},
            children: [],
          },
        ],
      }

      expect(validateAstIds(ast)).toBe(true)
    })

    it('should detect missing IDs', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: 'screen_123',
        props: {},
        children: [
          {
            type: 'Button',
            id: '', // Missing ID
            props: {},
            children: [],
          },
        ],
      }

      expect(validateAstIds(ast)).toBe(false)
    })

    it('should validate array of AST nodes', () => {
      const astArray: AstNode[] = [
        {
          type: 'Screen',
          id: 'screen_1',
          props: {},
          children: [],
        },
        {
          type: 'Screen',
          id: 'screen_2',
          props: {},
          children: [],
        },
      ]

      expect(validateAstIds(astArray)).toBe(true)
    })
  })

  describe('Utility Functions', () => {
    it('should get all IDs from AST', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: 'screen_123',
        props: {},
        children: [
          {
            type: 'Button',
            id: 'button_456',
            props: {},
            children: [],
          },
          {
            type: 'Text',
            id: 'text_789',
            props: {},
            children: [],
          },
        ],
      }

      const ids = getAllIds(ast)

      expect(ids).toHaveLength(3)
      expect(ids).toContain('screen_123')
      expect(ids).toContain('button_456')
      expect(ids).toContain('text_789')
    })

    it('should get all IDs from array of AST nodes', () => {
      const astArray: AstNode[] = [
        {
          type: 'Screen',
          id: 'screen_1',
          props: {},
          children: [],
        },
        {
          type: 'Modal',
          id: 'modal_1',
          props: {},
          children: [],
        },
      ]

      const ids = getAllIds(astArray)

      expect(ids).toHaveLength(2)
      expect(ids).toContain('screen_1')
      expect(ids).toContain('modal_1')
    })

    it('should handle deeply nested structures', () => {
      const ast: AstNode = {
        type: 'Screen',
        id: 'screen_1',
        props: {},
        children: [
          {
            type: 'Layout',
            id: 'layout_1',
            props: {},
            children: [
              {
                type: 'Layout',
                id: 'layout_2',
                props: {},
                children: [
                  {
                    type: 'Button',
                    id: 'button_1',
                    props: {},
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      }

      const ids = getAllIds(ast)

      expect(ids).toHaveLength(4)
      expect(ids).toContain('screen_1')
      expect(ids).toContain('layout_1')
      expect(ids).toContain('layout_2')
      expect(ids).toContain('button_1')
    })
  })

  describe('Stable Props Extraction', () => {
    it('should generate different IDs based on name prop', () => {
      const ast1: AstNode = {
        type: 'Screen',
        id: '',
        props: { name: 'Screen1' },
        children: [],
      }

      const ast2: AstNode = {
        type: 'Screen',
        id: '',
        props: { name: 'Screen2' },
        children: [],
      }

      const result1 = generateDeterministicIds(ast1) as AstNode
      const result2 = generateDeterministicIds(ast2) as AstNode

      expect(result1.id).not.toBe(result2.id)
    })

    it('should use label for fingerprinting', () => {
      const ast1: AstNode = {
        type: 'Button',
        id: '',
        props: { label: 'Submit' },
        children: [],
      }

      const ast2: AstNode = {
        type: 'Button',
        id: '',
        props: { label: 'Cancel' },
        children: [],
      }

      const result1 = generateDeterministicIds(ast1) as AstNode
      const result2 = generateDeterministicIds(ast2) as AstNode

      expect(result1.id).not.toBe(result2.id)
    })

    it('should use text content for fingerprinting', () => {
      const ast1: AstNode = {
        type: 'Text',
        id: '',
        props: { text: 'Hello' },
        children: [],
      }

      const ast2: AstNode = {
        type: 'Text',
        id: '',
        props: { text: 'World' },
        children: [],
      }

      const result1 = generateDeterministicIds(ast1) as AstNode
      const result2 = generateDeterministicIds(ast2) as AstNode

      expect(result1.id).not.toBe(result2.id)
    })
  })
})
