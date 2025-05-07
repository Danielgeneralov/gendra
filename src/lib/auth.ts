/**
 * auth.ts
 * Authentication utilities for the application
 */

import { cookies } from 'next/headers';
import { getSupabaseClient } from './db/client';
import logger from './logger';

// Component name for logging
const COMPONENT = 'auth';

/**
 * Placeholder user ID for anonymous usage
 * Will be replaced with real authentication in future
 */
export const ANONYMOUS_USER_ID = 'anonymous-user';

/**
 * Gets the current user ID from cookies or session
 * This is a placeholder function that will be replaced with
 * real authentication in the future using Supabase Auth
 * 
 * @returns The current user ID or ANONYMOUS_USER_ID if not logged in
 */
export function getCurrentUserId(): string | null {
  // This will be replaced with real authentication logic
  try {
    // Check for user session cookie - cookies() returns synchronously
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('gendra-user-id');
    
    if (sessionCookie?.value) {
      logger.debug(COMPONENT, 'Found session cookie', { 
        userId: sessionCookie.value 
      });
      return sessionCookie.value;
    }
    
    // Fallback to anonymous user ID
    return ANONYMOUS_USER_ID;
  } catch (error) {
    logger.warn(COMPONENT, 'Error getting current user ID', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return ANONYMOUS_USER_ID;
  }
}

/**
 * User information object
 */
export interface User {
  id: string;
  email?: string;
  name?: string;
  organization?: string;
  preferences?: {
    preferredIndustry?: string;
    theme?: 'light' | 'dark' | 'system';
  };
}

/**
 * Gets the current user object from session data
 * This is a placeholder function that will be replaced
 * with real authentication in the future
 * 
 * @returns User object or null if not logged in
 */
export async function getCurrentUser(): Promise<User | null> {
  const userId = getCurrentUserId();
  
  if (!userId || userId === ANONYMOUS_USER_ID) {
    return null;
  }
  
  // In a real implementation, this would fetch user data from Supabase
  try {
    // Placeholder implementation that will be replaced
    return {
      id: userId,
      name: 'Test User',
      email: 'user@example.com',
      preferences: {
        preferredIndustry: 'cnc machining',
        theme: 'system'
      }
    };
  } catch (error) {
    logger.error(COMPONENT, 'Error getting current user', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return null;
  }
}

/**
 * Creates a placeholder session for development
 * This will be removed when real authentication is implemented
 * 
 * @param userId - The user ID to set in the session
 * @returns A promise resolving to a boolean indicating success
 */
export async function createDevSession(userId: string): Promise<boolean> {
  // Only available in development mode
  if (process.env.NODE_ENV !== 'development') {
    logger.warn(COMPONENT, 'Attempted to create dev session in non-development environment');
    return false;
  }
  
  try {
    // Set the user ID cookie - cookies() returns synchronously
    const cookieStore = cookies();
    cookieStore.set('gendra-user-id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Secure in non-dev environments
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax'
    });
    
    logger.info(COMPONENT, 'Created development session', { userId });
    return true;
  } catch (error) {
    logger.error(COMPONENT, 'Failed to create development session', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return false;
  }
}

/**
 * Checks if the current user has a specific permission
 * This is a placeholder implementation that will be replaced with
 * proper role-based access control in the future
 * 
 * @param permission - The permission to check for
 * @returns Boolean indicating if the user has the permission
 */
export function hasPermission(permission: string): boolean {
  // This is just a placeholder - all permissions granted in dev
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // In a real implementation, this would check against Supabase RLS
  // For now, just check if the user is authenticated
  return getCurrentUserId() !== null;
}

/**
 * Signs out the current user by clearing the session
 * 
 * @returns A promise resolving to a boolean indicating success
 */
export async function signOut(): Promise<boolean> {
  try {
    // Clear the session cookie - cookies() returns synchronously
    const cookieStore = cookies();
    cookieStore.delete('gendra-user-id');
    
    logger.info(COMPONENT, 'User signed out');
    return true;
  } catch (error) {
    logger.error(COMPONENT, 'Error signing out', { 
      error: error instanceof Error ? error.message : String(error) 
    });
    return false;
  }
} 