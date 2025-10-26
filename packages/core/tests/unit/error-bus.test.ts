import { describe, it, expect, beforeEach } from 'vitest'
import { ErrorBus } from '../../src/error-bus'
import { ProtoError } from '../../src/types/errors'

describe('ErrorBus - Pub/Sub System', () => {
  let errorBus: ErrorBus

  beforeEach(() => {
    // Get fresh instance and clear all errors
    errorBus = ErrorBus.get()
    errorBus.clear()
  })

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ErrorBus.get()
      const instance2 = ErrorBus.get()

      expect(instance1).toBe(instance2)
    })
  })

  describe('Emit and Collection', () => {
    it('should emit a single error', () => {
      const error: ProtoError = {
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Test error',
        line: 1,
        column: 1,
      }

      errorBus.emit(error)

      const errors = errorBus.getAll()
      expect(errors).toHaveLength(1)
      expect(errors[0]).toEqual(error)
    })

    it('should bulk emit multiple errors', () => {
      const errors: ProtoError[] = [
        {
          stage: 'lexer',
          severity: 'error',
          code: 'LEX001',
          message: 'Error 1',
          line: 1,
          column: 1,
        },
        {
          stage: 'parser',
          severity: 'warning',
          code: 'PARSE001',
          message: 'Error 2',
          line: 2,
          column: 1,
        },
      ]

      errorBus.bulk(errors)

      const allErrors = errorBus.getAll()
      expect(allErrors).toHaveLength(2)
    })

    it('should not add duplicate errors', () => {
      const error: ProtoError = {
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Test error duplicate',
        line: 1,
        column: 1,
      }

      errorBus.emit(error)
      errorBus.emit(error) // Try to add duplicate
      errorBus.emit(error) // Try again

      const errors = errorBus.getAll()
      expect(errors).toHaveLength(1)
    })

    it('should allow errors with different properties', () => {
      const error1: ProtoError = {
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Error at line 1',
        line: 1,
        column: 1,
      }

      const error2: ProtoError = {
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Error at line 2', // Different message
        line: 2, // Different line
        column: 1,
      }

      errorBus.emit(error1)
      errorBus.emit(error2)

      const errors = errorBus.getAll()
      expect(errors).toHaveLength(2)
    })
  })

  describe('Clear Errors', () => {
    beforeEach(() => {
      errorBus.bulk([
        {
          stage: 'lexer',
          severity: 'error',
          code: 'LEX001',
          message: 'Lexer error',
          line: 1,
          column: 1,
        },
        {
          stage: 'parser',
          severity: 'error',
          code: 'PARSE001',
          message: 'Parser error',
          line: 2,
          column: 1,
        },
        {
          stage: 'builder',
          severity: 'warning',
          code: 'BUILD001',
          message: 'Builder warning',
          line: 3,
          column: 1,
        },
      ])
    })

    it('should clear all errors', () => {
      errorBus.clear()

      expect(errorBus.count()).toBe(0)
      expect(errorBus.getAll()).toHaveLength(0)
    })

    it('should clear errors by stage', () => {
      errorBus.clear('lexer')

      const errors = errorBus.getAll()
      expect(errors).toHaveLength(2)
      expect(errors.every((e) => e.stage !== 'lexer')).toBe(true)
    })

    it('should preserve errors from other stages when clearing by stage', () => {
      errorBus.clear('parser')

      const errors = errorBus.getAll()
      expect(errors).toHaveLength(2)
      expect(
        errors.some((e) => e.stage === 'lexer' || e.stage === 'builder')
      ).toBe(true)
    })
  })

  describe('Query Methods', () => {
    beforeEach(() => {
      errorBus.bulk([
        {
          stage: 'lexer',
          severity: 'error',
          code: 'LEX001',
          message: 'Lexer error 1',
          line: 1,
          column: 1,
        },
        {
          stage: 'lexer',
          severity: 'warning',
          code: 'LEX002',
          message: 'Lexer warning',
          line: 2,
          column: 1,
        },
        {
          stage: 'parser',
          severity: 'error',
          code: 'PARSE001',
          message: 'Parser error',
          line: 3,
          column: 1,
        },
        {
          stage: 'builder',
          severity: 'fatal',
          code: 'BUILD001',
          message: 'Builder fatal error',
          line: 4,
          column: 1,
        },
      ])
    })

    it('should count total errors', () => {
      expect(errorBus.count()).toBe(4)
    })

    it('should get errors by stage', () => {
      const lexerErrors = errorBus.getByStage('lexer')
      expect(lexerErrors).toHaveLength(2)
      expect(lexerErrors.every((e) => e.stage === 'lexer')).toBe(true)
    })

    it('should detect fatal errors', () => {
      expect(errorBus.hasFatalErrors()).toBe(true)
    })

    it('should not detect fatal errors when none exist', () => {
      errorBus.clear()
      errorBus.emit({
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Non-fatal error',
        line: 1,
        column: 1,
      })

      expect(errorBus.hasFatalErrors()).toBe(false)
    })

    it('should return empty array for stage with no errors', () => {
      const editorErrors = errorBus.getByStage('editor')
      expect(editorErrors).toHaveLength(0)
    })
  })

  describe('Subscribe and Notify', () => {
    it('should notify subscriber immediately with current errors', () => {
      const error: ProtoError = {
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Existing error',
        line: 1,
        column: 1,
      }

      errorBus.emit(error)

      let receivedErrors: ProtoError[] = []
      errorBus.subscribe((errors) => {
        receivedErrors = errors
      })

      expect(receivedErrors).toHaveLength(1)
      expect(receivedErrors[0]).toEqual(error)
    })

    it('should notify subscriber on new error', () => {
      let callCount = 0
      let lastErrors: ProtoError[] = []

      errorBus.subscribe((errors) => {
        callCount++
        lastErrors = errors
      })

      const error: ProtoError = {
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'New error',
        line: 1,
        column: 1,
      }

      errorBus.emit(error)

      expect(callCount).toBe(2) // Initial + after emit
      expect(lastErrors).toHaveLength(1)
    })

    it('should notify all subscribers', () => {
      let subscriber1Called = false
      let subscriber2Called = false

      errorBus.subscribe(() => {
        subscriber1Called = true
      })
      errorBus.subscribe(() => {
        subscriber2Called = true
      })

      errorBus.emit({
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Test',
        line: 1,
        column: 1,
      })

      expect(subscriber1Called).toBe(true)
      expect(subscriber2Called).toBe(true)
    })

    it('should allow unsubscribing', () => {
      let callCount = 0

      const unsubscribe = errorBus.subscribe(() => {
        callCount++
      })

      errorBus.emit({
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Before unsubscribe',
        line: 1,
        column: 1,
      })

      const countBeforeUnsub = callCount

      unsubscribe()

      errorBus.emit({
        stage: 'lexer',
        severity: 'error',
        code: 'LEX002',
        message: 'After unsubscribe',
        line: 2,
        column: 1,
      })

      // Count should not increase after unsubscribe
      expect(callCount).toBe(countBeforeUnsub)
    })

    it('should notify on clear', () => {
      errorBus.emit({
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Error to clear',
        line: 1,
        column: 1,
      })

      let lastErrors: ProtoError[] = []
      errorBus.subscribe((errors) => {
        lastErrors = errors
      })

      errorBus.clear()

      expect(lastErrors).toHaveLength(0)
    })

    it('should provide immutable snapshot to subscribers', () => {
      let receivedErrors: ProtoError[] = []

      errorBus.subscribe((errors) => {
        receivedErrors = errors
      })

      errorBus.emit({
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Test',
        line: 1,
        column: 1,
      })

      // Try to modify received errors
      receivedErrors.push({
        stage: 'parser',
        severity: 'error',
        code: 'PARSE001',
        message: 'Should not affect bus',
        line: 2,
        column: 1,
      })

      // Bus should still have only 1 error
      expect(errorBus.count()).toBe(1)
    })
  })

  describe('Error Deduplication', () => {
    it('should deduplicate errors with same key', () => {
      const error1: ProtoError = {
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Duplicate test error message',
        line: 1,
        column: 5,
      }

      const error2: ProtoError = {
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Duplicate test error message with more text',
        line: 1,
        column: 5,
      }

      errorBus.emit(error1)
      errorBus.emit(error2)

      // Should only have one error (same stage, line, column, code, and first 16 chars of message)
      expect(errorBus.count()).toBe(1)
    })

    it('should not deduplicate errors with different codes', () => {
      const error1: ProtoError = {
        stage: 'lexer',
        severity: 'error',
        code: 'LEX001',
        message: 'Test error',
        line: 1,
        column: 1,
      }

      const error2: ProtoError = {
        stage: 'lexer',
        severity: 'error',
        code: 'LEX002', // Different code
        message: 'Test error',
        line: 1,
        column: 1,
      }

      errorBus.emit(error1)
      errorBus.emit(error2)

      expect(errorBus.count()).toBe(2)
    })
  })
})
