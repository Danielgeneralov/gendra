import { createClient } from '@supabase/supabase-js';
import type { ParsedRFQ } from '@/lib/groqParser';

/**
 * Supabase client configuration
 * Uses service role key for admin-level access to insert data
 */
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase configuration');
  }
  
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

/**
 * Saves a parsed RFQ and its source text to the Supabase database
 * 
 * @param parsed - The structured RFQ data parsed from the source text
 * @param sourceText - The original raw text that was parsed
 * @returns A promise that resolves when the data has been saved
 * @throws Error if the database operation fails
 */
export async function saveParsedRFQ(parsed: ParsedRFQ, sourceText: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  
  // Prepare the data for insertion
  const insertData = {
    material: parsed.material,
    quantity: parsed.quantity,
    length: parsed.dimensions.length,
    width: parsed.dimensions.width,
    height: parsed.dimensions.height,
    complexity: parsed.complexity,
    deadline: parsed.deadline,
    raw_text: sourceText,
    created_at: new Date().toISOString(),
  };
  
  // Insert the data into the parsed_rfq_drafts table
  const { error } = await supabase
    .from('parsed_rfq_drafts')
    .insert(insertData);
  
  // Handle errors
  if (error) {
    console.error('Error saving parsed RFQ to Supabase:', error.message);
    throw new Error(`Failed to save parsed RFQ: ${error.message}`);
  }
} 