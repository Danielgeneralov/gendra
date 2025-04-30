import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Log Supabase initialization status (helpful for debugging)
console.warn(`Initializing Supabase client with:`, {
  url: supabaseUrl ? supabaseUrl.substring(0, 10) + '...' : 'undefined',
  key: supabaseAnonKey ? '***' : 'undefined'
});

// Create a Supabase client instance with better error handling
export const supabase = (() => {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      // Return null to indicate Supabase is not available
      return null;
    }
    
    const client = createClient(supabaseUrl, supabaseAnonKey);
    console.warn('Supabase client initialized successfully');
    return client;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return null;
  }
})();


