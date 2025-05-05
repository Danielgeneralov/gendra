import type { ParsedRFQ } from '@/lib/groqParser';
import { getSupabaseAdmin, createSuccessResult, createErrorResult, DbOperationResult } from './client';

/**
 * Saves a parsed RFQ and its source text to the Supabase database
 * 
 * @param parsed - The structured RFQ data parsed from the source text
 * @param sourceText - The original raw text that was parsed
 * @returns A standardized result object
 * @throws Error if the database operation fails
 */
export async function saveParsedRFQ(
  parsed: ParsedRFQ, 
  sourceText: string
): Promise<DbOperationResult<void>> {
  try {
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
      return createErrorResult(
        `Failed to save parsed RFQ: ${error.message}`,
        { code: error.code, details: error.details }
      ) as DbOperationResult<void>;
    }
    
    return createSuccessResult<void>();
  } catch (error) {
    console.error('Unexpected error saving parsed RFQ:', error);
    return createErrorResult(
      'An unexpected error occurred while saving the parsed RFQ',
      error instanceof Error ? error.message : String(error)
    ) as DbOperationResult<void>;
  }
} 