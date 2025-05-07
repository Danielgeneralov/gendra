/**
 * client.ts
 * Supabase client configuration and database operation utilities
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import logger from '../logger';

// Component name for logging
const COMPONENT = 'supabase';

/**
 * Cached Supabase clients to avoid creating new clients for each request
 */
let adminClientCache: SupabaseClient | null = null;
let publicClientCache: SupabaseClient | null = null;

/**
 * Returns a Supabase client with admin privileges using the service role key
 * This client has full access to the database and should only be used in server contexts
 * 
 * @throws Error if the required environment variables are missing
 * @returns A configured Supabase client with admin privileges
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClientCache) {
    return adminClientCache;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    const error = new Error('Missing Supabase configuration. NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined.');
    logger.error(COMPONENT, 'Missing Supabase admin configuration', error);
    throw error;
  }
  
  logger.debug(COMPONENT, 'Creating new admin Supabase client');
  adminClientCache = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
  
  return adminClientCache;
}

/**
 * Returns a Supabase client with public (anon) access
 * This client has limited access based on Row Level Security policies
 * 
 * @throws Error if the required environment variables are missing
 * @returns A configured Supabase client with public access
 */
export function getSupabaseClient(): SupabaseClient {
  if (publicClientCache) {
    return publicClientCache;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    const error = new Error('Missing Supabase configuration. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined.');
    logger.error(COMPONENT, 'Missing Supabase public configuration', error);
    throw error;
  }
  
  logger.debug(COMPONENT, 'Creating new public Supabase client');
  publicClientCache = createClient(supabaseUrl, supabaseAnonKey);
  
  return publicClientCache;
}

/**
 * Standardized response structure for database operations
 */
export interface DbOperationResult<T = unknown> {
  /** Indicates if the operation was successful */
  success: boolean;
  /** Data returned by the operation, if any */
  data?: T;
  /** Error information if the operation failed */
  error?: {
    /** Error message */
    message: string;
    /** Error code if available */
    code?: string;
    /** Original error object or details */
    details?: unknown;
  };
  /** Metadata about the operation */
  metadata?: {
    /** Time the operation took in milliseconds */
    executionTime?: number;
    /** Number of rows affected (for write operations) */
    affectedRows?: number;
    /** Any other operation-specific metadata */
    [key: string]: any;
  };
}

/**
 * Create a standardized successful result
 * 
 * @param data - The data to include in the result
 * @param metadata - Optional metadata about the operation
 * @returns A successful operation result
 */
export function createSuccessResult<T>(
  data?: T, 
  metadata?: DbOperationResult['metadata']
): DbOperationResult<T> {
  return { 
    success: true, 
    data,
    metadata
  };
}

/**
 * Create a standardized error result
 * 
 * @param message - The error message
 * @param details - Additional error details
 * @param code - Error code if available
 * @returns An error operation result
 */
export function createErrorResult<T = unknown>(
  message: string, 
  details?: unknown,
  code?: string
): DbOperationResult<T> {
  // Log the error
  logger.error(COMPONENT, `Database operation error: ${message}`, null, { 
    details, 
    code 
  });
  
  return { 
    success: false, 
    error: { 
      message, 
      details,
      code 
    } 
  };
}

/**
 * Executes a database operation with standardized error handling
 * 
 * @param operation - A function that performs a database operation
 * @param errorMessage - The error message to use if the operation fails
 * @returns A promise resolving to a standardized result object
 */
export async function executeDbOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string
): Promise<DbOperationResult<T>> {
  const startTime = Date.now();
  
  try {
    const result = await operation();
    
    return createSuccessResult<T>(result, {
      executionTime: Date.now() - startTime
    });
  } catch (error) {
    // Extract Supabase error details if available
    let code: string | undefined;
    let details: unknown = error;
    
    if (error && typeof error === 'object' && 'code' in error) {
      code = String(error.code);
    }
    
    return createErrorResult<T>(
      errorMessage,
      details,
      code
    );
  }
} 