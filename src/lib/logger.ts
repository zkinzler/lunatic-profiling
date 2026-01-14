// ============================================
// Structured Logging Utility
// ============================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  path?: string;
  method?: string;
  duration?: number;
  statusCode?: number;
  [key: string]: unknown;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// Fields to redact from logs
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'api_key',
  'authorization',
  'cookie',
  'email',
];

/**
 * Redact sensitive data from objects
 */
function redactSensitive(obj: unknown, depth: number = 0): unknown {
  if (depth > 5) return '[MAX_DEPTH]';

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitive(item, depth + 1));
  }

  if (typeof obj === 'object') {
    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (SENSITIVE_FIELDS.some((f) => key.toLowerCase().includes(f))) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactSensitive(value, depth + 1);
      }
    }
    return redacted;
  }

  return obj;
}

/**
 * Format error for logging
 */
function formatError(error: unknown): LogEntry['error'] | undefined {
  if (!error) return undefined;

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    };
  }

  return {
    name: 'UnknownError',
    message: String(error),
  };
}

/**
 * Create a log entry
 */
function createLogEntry(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: unknown
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: context ? (redactSensitive(context) as LogContext) : undefined,
    error: formatError(error),
  };
}

/**
 * Output log entry
 */
function output(entry: LogEntry): void {
  const logStr = JSON.stringify(entry);

  switch (entry.level) {
    case 'debug':
      if (process.env.NODE_ENV !== 'production') {
        console.debug(logStr);
      }
      break;
    case 'info':
      console.log(logStr);
      break;
    case 'warn':
      console.warn(logStr);
      break;
    case 'error':
      console.error(logStr);
      break;
  }
}

// ============================================
// Logger Class
// ============================================

class Logger {
  private defaultContext: LogContext;

  constructor(defaultContext: LogContext = {}) {
    this.defaultContext = defaultContext;
  }

  /**
   * Create a child logger with additional context
   */
  child(context: LogContext): Logger {
    return new Logger({ ...this.defaultContext, ...context });
  }

  /**
   * Log at debug level (only in development)
   */
  debug(message: string, context?: LogContext): void {
    const entry = createLogEntry('debug', message, {
      ...this.defaultContext,
      ...context,
    });
    output(entry);
  }

  /**
   * Log at info level
   */
  info(message: string, context?: LogContext): void {
    const entry = createLogEntry('info', message, {
      ...this.defaultContext,
      ...context,
    });
    output(entry);
  }

  /**
   * Log at warn level
   */
  warn(message: string, context?: LogContext): void {
    const entry = createLogEntry('warn', message, {
      ...this.defaultContext,
      ...context,
    });
    output(entry);
  }

  /**
   * Log at error level
   */
  error(message: string, error?: unknown, context?: LogContext): void {
    const entry = createLogEntry(
      'error',
      message,
      { ...this.defaultContext, ...context },
      error
    );
    output(entry);
  }

  /**
   * Log API request start
   */
  requestStart(requestId: string, method: string, path: string): void {
    this.info('Request started', { requestId, method, path });
  }

  /**
   * Log API request completion
   */
  requestEnd(
    requestId: string,
    statusCode: number,
    duration: number
  ): void {
    this.info('Request completed', { requestId, statusCode, duration });
  }
}

// ============================================
// Exported Logger Instance
// ============================================

export const logger = new Logger();

export default logger;
