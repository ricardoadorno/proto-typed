/**
 * Logger utility for the web application
 *
 * Provides structured logging that works both client-side and server-side.
 * Server-side logs appear in the terminal when running `pnpm dev`.
 * Client-side logs appear in the browser console with additional context.
 *
 * Usage:
 * ```ts
 * import { logger } from '@/lib/logger'
 *
 * logger.info('Parsing DSL input', { inputLength: input.length })
 * logger.error('Parse failed', error, { context: 'use-parse hook' })
 * logger.debug('AST generated', { nodeCount: ast.length })
 * ```
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogContext = Record<string, unknown>

interface LoggerConfig {
  /** Minimum log level to display (default: 'debug' in dev, 'info' in prod) */
  minLevel: LogLevel
  /** Enable/disable logging globally (default: true) */
  enabled: boolean
  /** Prefix for all log messages (default: '[proto-typed]') */
  prefix: string
  /** Enable timestamps in logs (default: true) */
  timestamps: boolean
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  enabled: true,
  prefix: '[proto-typed]',
  timestamps: true,
}

class Logger {
  private config: LoggerConfig

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Update logger configuration
   */
  configure(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config }
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel]
  }

  /**
   * Format timestamp for log message
   */
  private getTimestamp(): string {
    if (!this.config.timestamps) return ''
    const now = new Date()
    const time = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    })
    return `[${time}]`
  }

  /**
   * Detect if running in browser or Node.js
   */
  private get isServer(): boolean {
    return typeof window === 'undefined'
  }

  /**
   * Format log message with prefix and timestamp
   */
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = this.getTimestamp()
    const prefix = this.config.prefix
    const levelStr = level.toUpperCase().padEnd(5)
    const location = this.isServer ? '[SERVER]' : '[CLIENT]'

    return `${timestamp} ${prefix} ${location} ${levelStr} ${message}`
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    error?: Error | unknown,
    context?: LogContext
  ) {
    if (!this.shouldLog(level)) return

    const formattedMessage = this.formatMessage(level, message)

    // Choose console method based on level
    const consoleMethod =
      level === 'error'
        ? console.error
        : level === 'warn'
          ? console.warn
          : level === 'debug'
            ? console.debug
            : console.log

    // Log message
    consoleMethod(formattedMessage)

    // Log error if provided
    if (error) {
      if (error instanceof Error) {
        consoleMethod('  Error:', error.message)
        if (error.stack && level === 'error') {
          consoleMethod('  Stack:', error.stack)
        }
      } else {
        consoleMethod('  Error:', error)
      }
    }

    // Log context if provided
    if (context && Object.keys(context).length > 0) {
      consoleMethod('  Context:', context)
    }
  }

  /**
   * Log debug message (lowest priority)
   * Use for detailed debugging information
   */
  debug(message: string, context?: LogContext) {
    this.log('debug', message, undefined, context)
  }

  /**
   * Log info message
   * Use for general information about application flow
   */
  info(message: string, context?: LogContext) {
    this.log('info', message, undefined, context)
  }

  /**
   * Log warning message
   * Use for non-critical issues that should be addressed
   */
  warn(message: string, context?: LogContext) {
    this.log('warn', message, undefined, context)
  }

  /**
   * Log error message (highest priority)
   * Use for errors and exceptions
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    this.log('error', message, error, context)
  }

  /**
   * Create a scoped logger with additional context
   *
   * @example
   * const parseLogger = logger.scope({ component: 'use-parse' })
   * parseLogger.info('Starting parse') // Includes component context
   */
  scope(defaultContext: LogContext): ScopedLogger {
    return new ScopedLogger(this, defaultContext)
  }

  /**
   * Log performance timing
   *
   * @example
   * const endTimer = logger.time('Parse DSL')
   * // ... do work ...
   * endTimer() // Logs: "Parse DSL completed in 123ms"
   */
  time(label: string): () => void {
    const start = performance.now()
    this.debug(`${label} started`)

    return () => {
      const duration = performance.now() - start
      this.info(`${label} completed`, { durationMs: duration.toFixed(2) })
    }
  }

  /**
   * Group related logs together (browser only)
   */
  group(label: string, collapsed = false) {
    if (this.isServer) {
      this.info(`=== ${label} ===`)
      return
    }

    if (collapsed) {
      console.groupCollapsed(this.formatMessage('info', label))
    } else {
      console.group(this.formatMessage('info', label))
    }
  }

  /**
   * End log group (browser only)
   */
  groupEnd() {
    if (!this.isServer) {
      console.groupEnd()
    }
  }
}

/**
 * Scoped logger with default context
 */
class ScopedLogger {
  constructor(
    private parent: Logger,
    private defaultContext: LogContext
  ) {}

  private mergeContext(context?: LogContext): LogContext {
    return { ...this.defaultContext, ...context }
  }

  debug(message: string, context?: LogContext) {
    this.parent.debug(message, this.mergeContext(context))
  }

  info(message: string, context?: LogContext) {
    this.parent.info(message, this.mergeContext(context))
  }

  warn(message: string, context?: LogContext) {
    this.parent.warn(message, this.mergeContext(context))
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    this.parent.error(message, error, this.mergeContext(context))
  }

  time(label: string) {
    return this.parent.time(label)
  }

  group(label: string, collapsed = false) {
    this.parent.group(label, collapsed)
  }

  groupEnd() {
    this.parent.groupEnd()
  }
}

/**
 * Global logger instance
 *
 * @example
 * import { logger } from '@/lib/logger'
 *
 * logger.info('Application started')
 * logger.error('Failed to fetch data', error)
 * logger.debug('State updated', { newState })
 *
 * // Create scoped logger
 * const parseLogger = logger.scope({ hook: 'use-parse' })
 * parseLogger.info('Starting parse')
 */
export const logger = new Logger()

/**
 * Export types for external use
 */
export type { LogLevel, LogContext, LoggerConfig }
export { Logger, ScopedLogger }
