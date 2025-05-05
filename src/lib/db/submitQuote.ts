import { getSupabaseAdmin, DbOperationResult, createSuccessResult, createErrorResult } from './client';

/**
 * Quote data to be submitted to the database
 */
export interface QuoteData {
  /** User's email address */
  email: string;
  /** Industry category */
  industry: string;
  /** Material type */
  material: string;
  /** Quantity requested */
  quantity: number;
  /** Complexity level (low, medium, high) */
  complexity: string;
  /** Surface finish type */
  surface_finish: string;
  /** Lead time preference */
  lead_time_preference: string;
  /** Additional custom fields specific to industry */
  custom_fields?: Record<string, unknown>;
  /** Whether the full quote was shown to the user */
  full_quote_shown: boolean;
  /** The calculated quote amount */
  quote_amount: number;
  /** Method used to calculate the quote (backend or fallback) */
  calculation_method: string;
  /** Optional notes about the quote */
  notes?: string;
}

/**
 * Submits a quote to the database
 * 
 * This function saves the quote data to the quote_leads table in Supabase.
 * It handles error checking and returns a standardized result.
 * 
 * @param quoteData - The quote data to submit
 * @returns A result object indicating success or failure
 * 
 * @example
 * ```ts
 * const result = await submitQuoteToDB({
 *   email: 'user@example.com',
 *   industry: 'metal-fabrication',
 *   material: 'aluminum',
 *   quantity: 10,
 *   complexity: 'medium',
 *   // ... other fields
 * });
 * 
 * if (result.success) {
 *   console.log('Quote submitted successfully');
 * } else {
 *   console.error('Failed to submit quote:', result.error?.message);
 * }
 * ```
 */
export async function submitQuoteToDB(quoteData: QuoteData): Promise<DbOperationResult<void>> {
  try {
    // Get Supabase admin client
    const supabase = getSupabaseAdmin();
    
    // Validate required fields
    const { email, industry, material, quantity } = quoteData;
    if (!email || !industry || !material || !quantity) {
      return createErrorResult('Missing required fields: email, industry, material, and quantity must be provided') as DbOperationResult<void>;
    }
    
    // Prepare data for insertion with timestamp
    const insertData = {
      ...quoteData,
      created_at: new Date().toISOString(),
      is_contacted: false
    };
    
    // Insert data into the quote_leads table
    const { error } = await supabase.from('quote_leads').insert(insertData);
    
    // Handle database errors
    if (error) {
      console.error('Error inserting quote lead:', error);
      return createErrorResult(
        'Failed to save quote to database', 
        { 
          code: error.code, 
          message: error.message,
          details: error.details
        }
      ) as DbOperationResult<void>;
    }
    
    // Return success
    return createSuccessResult<void>();
    
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error submitting quote to DB:', error);
    return createErrorResult(
      'An unexpected error occurred while saving the quote', 
      error instanceof Error ? error.message : String(error)
    ) as DbOperationResult<void>;
  }
} 