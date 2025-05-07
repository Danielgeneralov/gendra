/**
 * rfqStorage.ts
 * Functions for saving and retrieving parsed RFQ data from Supabase
 */

import { ParsedRFQ, ParsedRFQDraft } from '@/types/ParsedRFQ';
import { getSupabaseAdmin, createSuccessResult, createErrorResult, DbOperationResult, executeDbOperation } from './client';
import logger from '../logger';

// Component name for logging
const COMPONENT = 'rfqStorage';

/**
 * Saves a parsed RFQ to the Supabase database with enhanced metadata
 * 
 * @param parsed - The structured RFQ data
 * @param sourceText - The original raw text
 * @param metadata - Additional metadata about the file
 * @returns A promise resolving to a standardized result object
 */
export async function saveParsedRFQ(
  parsed: ParsedRFQ,
  sourceText: string,
  metadata: {
    userId?: string;
    filename?: string;
    fileType?: string;
    sheetName?: string;
  } = {}
): Promise<DbOperationResult<ParsedRFQDraft>> {
  logger.info(COMPONENT, 'Saving parsed RFQ', {
    materialLength: parsed.material.length,
    textLength: sourceText.length,
    industry: parsed.industry,
  });
  
  return await executeDbOperation(async () => {
    const supabase = getSupabaseAdmin();
    
    // Prepare the data for insertion
    const insertData = {
      // User information
      user_id: metadata.userId || 'placeholder-user-id',
      
      // File metadata
      original_filename: metadata.filename || 'manual-input',
      file_type: metadata.fileType || 'text/plain',
      sheet_name: metadata.sheetName || null,
      raw_text: sourceText,
      
      // Structured data
      material: parsed.material,
      quantity: parsed.quantity,
      length: parsed.dimensions.length,
      width: parsed.dimensions.width,
      height: parsed.dimensions.height,
      complexity: parsed.complexity,
      deadline: parsed.deadline,
      industry: parsed.industry,
      finish: parsed.finish || null,
      tolerance: parsed.tolerance || null,
      
      // Confidence metrics
      material_confidence: parsed.material_confidence || 0,
      industry_confidence: parsed.industry_confidence || 0,
      
      // Technical metadata
      parsing_version: parsed.parsing_version || '1.0.0',
      model_used: parsed.modelUsed || 'unknown',
      is_reviewed: parsed.is_reviewed || false,
      is_processed: false,
      
      // Timestamps
      created_at: new Date().toISOString(),
      parsed_at: parsed.timestamp || new Date().toISOString(),
    };
    
    // Insert the data into the parsed_rfq_drafts table
    const { data, error } = await supabase
      .from('parsed_rfq_drafts')
      .insert(insertData)
      .select()
      .single();
    
    // Handle errors
    if (error) {
      logger.error(COMPONENT, 'Error saving parsed RFQ to Supabase', error, {
        errorCode: error.code,
        errorDetails: error.details
      });
      
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from insert operation');
    }
    
    // Transform database record to ParsedRFQDraft
    const draft: ParsedRFQDraft = mapDbRecordToDraft(data);
    
    logger.info(COMPONENT, 'Successfully saved parsed RFQ', {
      draftId: draft.id,
      industry: draft.industry
    });
    
    return draft;
  }, 'Failed to save parsed RFQ to database');
}

/**
 * Maps a database record to a ParsedRFQDraft object
 */
function mapDbRecordToDraft(record: any): ParsedRFQDraft {
  return {
    id: record.id,
    material: record.material,
    quantity: record.quantity,
    dimensions: {
      length: record.length,
      width: record.width,
      height: record.height,
    },
    complexity: record.complexity as 'low' | 'medium' | 'high',
    deadline: record.deadline,
    industry: record.industry,
    finish: record.finish || undefined,
    tolerance: record.tolerance || undefined,
    material_confidence: record.material_confidence,
    industry_confidence: record.industry_confidence,
    parsing_version: record.parsing_version,
    modelUsed: record.model_used,
    timestamp: record.parsed_at,
    is_reviewed: record.is_reviewed,
    raw_text: record.raw_text,
    created_at: record.created_at,
    user_id: record.user_id,
    original_filename: record.original_filename,
    file_type: record.file_type,
    is_processed: record.is_processed,
  };
}

/**
 * Retrieves a parsed RFQ draft by ID
 * 
 * @param id - The ID of the parsed RFQ draft
 * @returns A promise resolving to a standardized result object
 */
export async function getParsedRFQDraft(id: number): Promise<DbOperationResult<ParsedRFQDraft>> {
  logger.info(COMPONENT, 'Retrieving parsed RFQ draft', { id });
  
  return await executeDbOperation(async () => {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('parsed_rfq_drafts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error(`Parsed RFQ draft with ID ${id} not found`);
    }
    
    return mapDbRecordToDraft(data);
  }, `Failed to retrieve parsed RFQ draft with ID ${id}`);
}

/**
 * Gets recent parsed RFQ drafts for a user
 * 
 * @param userId - The user ID to filter by (optional)
 * @param limit - The maximum number of drafts to return
 * @returns A promise resolving to a standardized result object
 */
export async function getRecentParsedRFQDrafts(
  userId?: string,
  limit: number = 10
): Promise<DbOperationResult<ParsedRFQDraft[]>> {
  logger.info(COMPONENT, 'Retrieving recent parsed RFQ drafts', { 
    userId: userId || 'all users',
    limit 
  });
  
  return await executeDbOperation(async () => {
    const supabase = getSupabaseAdmin();
    
    let query = supabase
      .from('parsed_rfq_drafts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // Filter by user ID if provided
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Transform database records to ParsedRFQDraft format
    return data.map(mapDbRecordToDraft);
  }, 'Failed to retrieve recent parsed RFQ drafts');
}

/**
 * Updates the review status of a parsed RFQ draft
 * 
 * @param id - The ID of the parsed RFQ draft
 * @param isReviewed - Whether the draft has been reviewed
 * @returns A promise resolving to a standardized result object
 */
export async function updateRFQReviewStatus(
  id: number,
  isReviewed: boolean
): Promise<DbOperationResult<void>> {
  logger.info(COMPONENT, 'Updating RFQ review status', { id, isReviewed });
  
  return await executeDbOperation(async () => {
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('parsed_rfq_drafts')
      .update({ is_reviewed: isReviewed })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  }, `Failed to update review status for parsed RFQ draft with ID ${id}`);
}

/**
 * Updates the processing status of a parsed RFQ draft
 * 
 * @param id - The ID of the parsed RFQ draft
 * @param isProcessed - Whether the draft has been processed (routed to template)
 * @returns A promise resolving to a standardized result object
 */
export async function updateRFQProcessingStatus(
  id: number,
  isProcessed: boolean
): Promise<DbOperationResult<void>> {
  logger.info(COMPONENT, 'Updating RFQ processing status', { id, isProcessed });
  
  return await executeDbOperation(async () => {
    const supabase = getSupabaseAdmin();
    
    const { error } = await supabase
      .from('parsed_rfq_drafts')
      .update({ is_processed: isProcessed })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
  }, `Failed to update processing status for parsed RFQ draft with ID ${id}`);
}

/**
 * Logs a parsing error to the database for analysis
 * 
 * @param errorInfo - Information about the error
 * @returns A promise that resolves when the error is logged
 */
export async function logParsingError(
  errorInfo: {
    errorType: string;
    errorMessage: string;
    userId?: string;
    fileName?: string;
    fileType?: string;
    textSample?: string;
    metadata?: Record<string, any>;
  }
): Promise<DbOperationResult<void>> {
  logger.warn(COMPONENT, 'Logging parsing error', {
    errorType: errorInfo.errorType,
    fileName: errorInfo.fileName || 'N/A',
  });
  
  return await executeDbOperation(async () => {
    const supabase = getSupabaseAdmin();
    
    // Create parsing errors table if needed (only do this in development)
    if (process.env.NODE_ENV === 'development') {
      const { error: tableError } = await supabase.rpc('create_parsing_errors_if_not_exists');
      if (tableError) {
        logger.warn(COMPONENT, 'Could not ensure parsing_errors table exists', tableError);
      }
    }
    
    // Prepare the data for insertion
    const insertData = {
      user_id: errorInfo.userId || 'placeholder-user-id',
      error_type: errorInfo.errorType,
      error_message: errorInfo.errorMessage,
      file_name: errorInfo.fileName || 'unknown',
      file_type: errorInfo.fileType || 'unknown',
      text_sample: errorInfo.textSample ? 
        (errorInfo.textSample.length > 500 ? errorInfo.textSample.substring(0, 500) + '...' : errorInfo.textSample) : 
        null,
      metadata: errorInfo.metadata || {},
      created_at: new Date().toISOString(),
    };
    
    // Insert the error into the parsing_errors table
    const { error } = await supabase
      .from('parsing_errors')
      .insert(insertData);
    
    // Handle errors
    if (error) {
      throw error;
    }
  }, 'Failed to log parsing error to database');
} 