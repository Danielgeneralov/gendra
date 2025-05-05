import { createClient } from '@supabase/supabase-js';

/**
 * Returns a Supabase client with admin privileges using the service role key
 * This client has full access to the database and should only be used in server contexts
 * 
 * @throws Error if the required environment variables are missing
 * @returns A configured Supabase client with admin privileges
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase configuration. NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined.');
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

/**
 * Returns a Supabase client with public (anon) access
 * This client has limited access based on Row Level Security policies
 * 
 * @throws Error if the required environment variables are missing
 * @returns A configured Supabase client with public access
 */
export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined.');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
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
    /** Original error object or details */
    details?: unknown;
  };
}

/**
 * Create a standardized successful result
 * 
 * @param data - The data to include in the result
 * @returns A successful operation result
 */
export function createSuccessResult<T>(data?: T): DbOperationResult<T> {
  return { success: true, data };
}

/**
 * Create a standardized error result
 * 
 * @param message - The error message
 * @param details - Additional error details
 * @returns An error operation result
 */
export function createErrorResult(message: string, details?: unknown): DbOperationResult {
  return { 
    success: false, 
    error: { 
      message, 
      details 
    } 
  };
} 