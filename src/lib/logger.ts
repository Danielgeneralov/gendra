/**
 * logger.ts
 * Centralized logging utility with structured JSON logging
 * Can be extended to support external observability tools
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Base log structure that all log entries should follow
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  component: string;
  message: string;
  [key: string]: any; // Allow additional fields
}

/**
 * Formats a log entry as JSON and includes standard fields
 */
function formatLogEntry(
  level: LogLevel,
  component: string,
  message: string,
  data?: Record<string, any>
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    component,
    message,
    ...(data || {}),
    // Add environment context for easier filtering
    env: process.env.NODE_ENV || 'development',
  };
}

/**
 * Log debug level message
 */
export function debug(component: string, message: string, data?: Record<string, any>): void {
  // Only log debug in development
  if (process.env.NODE_ENV !== 'production') {
    const entry = formatLogEntry('debug', component, message, data);
    console.debug(JSON.stringify(entry));
  }
}

/**
 * Log info level message
 */
export function info(component: string, message: string, data?: Record<string, any>): void {
  const entry = formatLogEntry('info', component, message, data);
  console.info(JSON.stringify(entry));
}

/**
 * Log warning level message
 */
export function warn(component: string, message: string, data?: Record<string, any>): void {
  const entry = formatLogEntry('warn', component, message, data);
  console.warn(JSON.stringify(entry));
}

/**
 * Log error level message with optional Error object
 */
export function error(
  component: string,
  message: string,
  err?: Error | unknown,
  data?: Record<string, any>
): void {
  const errorData: Record<string, any> = { ...(data || {}) };
  
  // Extract useful properties from Error objects
  if (err instanceof Error) {
    errorData.errorName = err.name;
    errorData.errorMessage = err.message;
    errorData.stack = err.stack;
    
    // Extract additional properties from custom error types
    const anyErr = err as any;
    if (anyErr.code) errorData.errorCode = anyErr.code;
    if (anyErr.status) errorData.errorStatus = anyErr.status;
  } else if (err !== undefined) {
    // Handle non-Error objects
    errorData.errorObject = String(err);
  }
  
  const entry = formatLogEntry('error', component, message, errorData);
  console.error(JSON.stringify(entry));
}

/**
 * Create a logger instance scoped to a specific component
 * This makes it easier to use consistent component names across logs
 */
export function createLogger(component: string) {
  return {
    debug: (message: string, data?: Record<string, any>) => debug(component, message, data),
    info: (message: string, data?: Record<string, any>) => info(component, message, data),
    warn: (message: string, data?: Record<string, any>) => warn(component, message, data),
    error: (message: string, err?: Error | unknown, data?: Record<string, any>) => 
      error(component, message, err, data),
  };
}

// Default export for convenience
export default {
  debug,
  info,
  warn,
  error,
  createLogger,
}; 