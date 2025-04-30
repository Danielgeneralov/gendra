import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Initialize Supabase client if environment variables are available
 */
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

/**
 * Creates a new Supabase client with our project credentials
 * This should only be used when you need to create a new connection
 * Most use cases should use the default exported supabase client
 */
export const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials not found in environment variables');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

/**
 * Saves lead information to Supabase
 * @param email User's email
 * @param quoteAmount Quote amount
 * @param formData Additional form data
 * @returns Boolean indicating success
 */
export const saveLeadToSupabase = async (
  email: string, 
  quoteAmount: number, 
  formData: {
    partType?: string;
    material?: string;
    quantity?: number;
    complexity?: string;
    deadline?: string;
    [key: string]: string | number | undefined;
  }
) => {
  try {
    // Check if credentials are available
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return false;
    }
    
    // Use the existing client or create a new one
    const client = supabase || createSupabaseClient();
    
    if (!client) {
      return false;
    }
    
    const notes = formData.partType 
      ? `Quote for ${formData.partType}, ${formData.material}, qty: ${formData.quantity}`
      : 'General quote request';
    
    const { error } = await client
      .from('quote_leads')
      .insert({
        email,
        quote_amount: quoteAmount,
        created_at: new Date().toISOString(),
        is_contacted: false,
        notes
      });
    
    if (error) {
      console.error("Error saving lead:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception during lead save:", err);
    return false;
  }
};

export default supabase; 