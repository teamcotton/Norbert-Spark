const LogMethod = {
  TRACE: 'trace',
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
} as const

type LogMethodType = (typeof LogMethod)[keyof typeof LogMethod]

/**
 * Configuration options for the UnifiedLogger.
 */
export interface LoggerOptions {
  /**
   * The minimum log level to output. Messages below this level will be filtered out.
   * Hierarchy: TRACE < DEBUG < INFO < WARN < ERROR
   * @default 'debug'
   */
  method?: LogMethodType
  /**
   * An optional prefix to prepend to all log messages.
   * Useful for identifying the source of log messages (e.g., component name, module name).
   * @example '[AuthService]', '[UserAPI]'
   */
  prefix?: string
  /**
   * The numeric log level for compatibility purposes.
   */
  level?: number
}

/**
 * Represents a formatted log message with metadata.
 */
export interface FormattedLogMessage {
  /**
   * ISO 8601 timestamp when the log message was created.
   */
  timestamp: string
  /**
   * The prefix string for the logger instance, if configured.
   */
  prefix: string
  /**
   * The log method/level in uppercase (e.g., 'DEBUG', 'INFO', 'WARN', 'ERROR').
   */
  method: string
  /**
   * The actual log message content.
   */
  message: string
  /**
   * Optional numeric log level, included only if configured in LoggerOptions.
   */
  level?: number
}

/**
 * A unified logging service that provides consistent formatting and level-based filtering
 * across the application. Supports debug, info, warn, and error levels with automatic
 * timestamp and prefix formatting.
 *
 * @example
 * ```typescript
 * // Create a logger with default settings (INFO level)
 * const logger = new UnifiedLogger()
 * logger.info('Application started')
 *
 * // Create a logger with custom options
 * const logger = new UnifiedLogger({ level: 'debug', prefix: 'MyComponent' })
 * logger.debug('Debug information', { userId: 123 })
 * logger.error('An error occurred', error)
 * ```
 */
export class UnifiedLogger {
  private static readonly METHOD_LEVELS = [
    LogMethod.TRACE,
    LogMethod.DEBUG,
    LogMethod.INFO,
    LogMethod.WARN,
    LogMethod.ERROR,
  ]

  private method: LogMethodType
  private readonly prefix: string
  private level?: number

  constructor(options: LoggerOptions = {}) {
    this.level = options.level
    this.method = options.method || LogMethod.DEBUG
    this.prefix = options.prefix || ''
  }

  private shouldLog(method: LogMethodType): boolean {
    return (
      UnifiedLogger.METHOD_LEVELS.indexOf(method) >=
      UnifiedLogger.METHOD_LEVELS.indexOf(this.method)
    )
  }

  private formatMessage(
    level: LogMethodType,
    message: string,
    ..._args: unknown[]
  ): FormattedLogMessage {
    const timestamp = new Date().toISOString()
    const prefixPart = this.prefix ? `[${this.prefix}] ` : ''
    const result: FormattedLogMessage = {
      timestamp: timestamp,
      prefix: prefixPart,
      method: level.toUpperCase(),
      message,
    }

    if (this.level !== undefined) {
      result.level = this.level
    }

    return result
  }

  trace(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogMethod.TRACE) && process.env.NODE_ENV !== 'production') {
      console.trace(this.formatMessage(LogMethod.DEBUG, message), ...args)
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogMethod.DEBUG) && process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage(LogMethod.DEBUG, message), ...args)
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogMethod.INFO) && process.env.NODE_ENV !== 'production') {
      console.info(this.formatMessage(LogMethod.INFO, message), ...args)
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogMethod.WARN)) {
      console.warn(this.formatMessage(LogMethod.WARN, message), ...args)
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog(LogMethod.ERROR)) {
      console.error(this.formatMessage(LogMethod.ERROR, message), ...args)
    }
  }

  setMethod(method: LogMethodType): void {
    this.method = method
  }

  getMethod(): LogMethodType {
    return this.method
  }

  setLevel(level: number): void {
    this.level = level
  }

  getLevel(): number | undefined {
    return this.level
  }
}

export function createLogger(options?: LoggerOptions): UnifiedLogger {
  return new UnifiedLogger(options)
}
