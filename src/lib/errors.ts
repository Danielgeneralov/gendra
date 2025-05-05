import { NextResponse } from 'next/server';

/**
 * Returns a standardized JSON error response and logs the event to the server console.
 * Useful for consistent handling in API routes.
 * 
 * @param message - Error message to return to the client
 * @param status - HTTP status code (defaults to 400)
 * @param context - Optional metadata for debugging (IP, industryId, requestId, etc.)
 * @returns NextResponse with consistent error shape
 * 
 * @example
 * return errorResponse("Missing required field", 400, { field: "industryId" });
 */
export function errorResponse(message: string, status = 400, context?: Record<string, unknown>) {
  console.error({
    level: "error",
    message,
    status,
    timestamp: new Date().toISOString(),
    ...(context || {})
  });

  return NextResponse.json({ error: message }, { status });
}

/**
 * Logs an informational event with consistent structure.
 * 
 * @param route - API route path
 * @param event - Event name/type (e.g., "incoming_request")
 * @param meta - Additional metadata relevant to the event
 */
export function logInfo(route: string, event: string, meta: Record<string, unknown>) {
  console.info({
    level: "info",
    event,
    route,
    timestamp: new Date().toISOString(),
    meta
  });
}

/**
 * Logs a warning event with consistent structure.
 * 
 * @param route - API route path
 * @param event - Event name/type
 * @param meta - Additional metadata relevant to the event
 */
export function logWarn(route: string, event: string, meta: Record<string, unknown>) {
  console.warn({
    level: "warn",
    event,
    route,
    timestamp: new Date().toISOString(),
    meta
  });
} 