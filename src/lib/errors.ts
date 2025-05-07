/**
 * errors.ts
 * Standardized error handling utilities for the application
 */

import { NextResponse } from 'next/server';
import logger from './logger';

/**
 * Base error class for application-specific errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Error thrown when validation fails
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details, true);
  }
}

/**
 * Error thrown when user authentication is required
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, undefined, true);
  }
}

/**
 * Error thrown when a requested resource is not found
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id 
      ? `${resource} with ID ${id} not found` 
      : `${resource} not found`;
    super(message, 404, { resource, id }, true);
  }
}

/**
 * Error thrown when an external service like Groq API fails
 */
export class ExternalServiceError extends AppError {
  constructor(serviceName: string, message: string, details?: unknown) {
    super(`${serviceName} error: ${message}`, 503, details, true);
  }
}

/**
 * Error thrown when file parsing fails
 */
export class FileParsingError extends AppError {
  public fileType?: string;
  
  constructor(message: string, fileType?: string, details?: unknown) {
    super(`File parsing error: ${message}`, 400, details, true);
    this.fileType = fileType;
  }
}

/**
 * Error thrown when the Groq API key is missing
 */
export class MissingAPIKeyError extends AppError {
  constructor() {
    super('API key is missing in environment variables', 500, undefined, true);
  }
}

/**
 * Error thrown when Groq's response cannot be parsed
 */
export class GroqParsingError extends AppError {
  constructor(message: string, details?: unknown) {
    super(`Failed to parse Groq response: ${message}`, 500, details, true);
  }
}

/**
 * Error thrown when Groq's confidence scores are below threshold
 */
export class LowConfidenceError extends AppError {
  public parsedData: unknown;
  
  constructor(message: string, parsedData: unknown, confidenceScores?: Record<string, number>) {
    super(
      `Low confidence in parsing results: ${message}`, 
      400, 
      { confidenceScores }, 
      true
    );
    this.parsedData = parsedData;
  }
}

/**
 * Creates a consistent error response for API routes
 * 
 * @param error - Error object or message string
 * @param defaultStatus - Default status code if not provided by the error
 * @param component - Component name for logging context or details object
 * @returns Formatted NextResponse with error details
 */
export function createErrorResponse(
  error: Error | AppError | string,
  defaultStatus = 500,
  component: string | Record<string, any> = 'api'
): NextResponse {
  // Handle string errors
  if (typeof error === 'string') {
    // Handle the component parameter as either a string or a details object
    if (typeof component === 'string') {
      logger.error(component, error);
    } else {
      const componentName = component.route || 'api';
      logger.error(componentName, error, undefined, component);
    }
    
    return NextResponse.json(
      { error: { message: error } },
      { status: defaultStatus }
    );
  }

  // Get status code from AppError or default
  const statusCode = 'statusCode' in error ? error.statusCode : defaultStatus;
  
  // Log the error with appropriate details
  if (typeof component === 'string') {
    logger.error(
      component,
      error.message,
      error,
      'details' in error ? { details: error.details } : undefined
    );
  } else {
    const componentName = component.route || 'api';
    logger.error(
      componentName,
      error.message,
      error,
      {
        ...('details' in error ? { details: error.details } : {}),
        ...component
      }
    );
  }
  
  // Create the response
  return NextResponse.json(
    {
      error: {
        message: error.message,
        type: error.name,
        ...(process.env.NODE_ENV !== 'production' && error.stack 
          ? { stack: error.stack.split('\n') } 
          : {}),
        ...('details' in error && error.details ? { details: error.details } : {})
      }
    },
    { status: statusCode }
  );
}

/**
 * Alias for createErrorResponse for backward compatibility
 * Supports both parameter patterns:
 * - errorResponse(message, status, component)
 * - errorResponse(message, status, detailsObject)
 */
export const errorResponse = createErrorResponse;

/**
 * Creates a success response for API routes
 * 
 * @param data - Response data
 * @param status - HTTP status code
 * @param component - Component name for logging context (optional)
 * @returns Formatted NextResponse with success data
 */
export function createSuccessResponse(
  data: any, 
  status = 200, 
  component?: string
): NextResponse {
  if (component) {
    logger.info(component, 'API success response', { status });
  }
  
  return NextResponse.json(data, { status });
}

/**
 * Log info level message
 * 
 * @param component - The component or route path generating the log
 * @param event - The event name
 * @param data - Additional data to log
 */
export function logInfo(component: string, event: string, data?: Record<string, any>): void {
  console.info({
    timestamp: new Date().toISOString(),
    level: 'info',
    component,
    event,
    ...data
  });
}

/**
 * Log warning level message
 * 
 * @param component - The component or route path generating the log
 * @param event - The event name
 * @param data - Additional data to log
 */
export function logWarn(component: string, event: string, data?: Record<string, any>): void {
  console.warn({
    timestamp: new Date().toISOString(),
    level: 'warn',
    component,
    event,
    ...data
  });
}

/**
 * Log error level message
 * 
 * @param component - The component or route path generating the log
 * @param event - The event name
 * @param error - The error object
 * @param data - Additional data to log
 */
export function logError(
  component: string, 
  event: string, 
  error: Error | string, 
  data?: Record<string, any>
): void {
  console.error({
    timestamp: new Date().toISOString(),
    level: 'error',
    component,
    event,
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    ...data
  });
} 