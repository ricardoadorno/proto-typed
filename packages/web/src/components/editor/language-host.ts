import {
  parseAndBuildAst,
  ErrorBus,
  ERROR_CODES,
  sanitizeErrorMessage,
  type AstWithErrors,
  type ProtoError,
} from '@proto-typed/core'
import type { LanguageHost } from '@proto-typed/core/language'

interface LanguageHostIntegration {
  host: LanguageHost
  clear: (uri: string) => void
  dispose: () => void
}

export function createLanguageHost(): LanguageHostIntegration {
  const bus = ErrorBus.get()
  const errorCache = new Map<string, ProtoError[]>()

  const host: LanguageHost = {
    parse(text, uri) {
      let errors: ProtoError[] = []
      let ast: unknown = null

      try {
        const parsed = parseAndBuildAst(text)
        const astWithErrors = parsed as AstWithErrors
        if (
          '__errors' in astWithErrors &&
          Array.isArray(astWithErrors.__errors)
        ) {
          errors = [...(astWithErrors.__errors as ProtoError[])]
          delete (astWithErrors as Partial<AstWithErrors>).__errors
        }
        ast = parsed
      } catch (error) {
        errors = [
          {
            stage: 'editor',
            severity: 'fatal',
            code: ERROR_CODES.EDIT_FATAL_ERROR,
            message: sanitizeErrorMessage(error),
          },
        ]
        ast = null
      }

      errorCache.set(uri, errors)
      rebuildErrorBus(bus, errorCache)
      return { ast, errors }
    },

    onErrors(uri, cb) {
      return bus.subscribe(() => {
        cb(errorCache.get(uri) ?? [])
      })
    },
  }

  return {
    host,
    clear(uri: string) {
      errorCache.delete(uri)
      rebuildErrorBus(bus, errorCache)
    },
    dispose() {
      errorCache.clear()
      bus.clear()
    },
  }
}

function rebuildErrorBus(
  bus: ErrorBus,
  cache: Map<string, ProtoError[]>
): void {
  bus.clear()
  for (const errors of cache.values()) {
    if (errors.length) {
      bus.bulk(errors)
    }
  }
}
