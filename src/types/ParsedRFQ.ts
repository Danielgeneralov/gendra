/**
 * ParsedRFQ.ts
 * Type definitions for RFQ parsing results
 */

/**
 * Represents the structured data extracted from an RFQ text
 */
export type ParsedRFQ = {
  // Core data fields
  material: string;
  quantity: number;
  dimensions: {
    length: number; // in millimeters
    width: number;  // in millimeters
    height: number; // in millimeters
  };
  complexity: 'low' | 'medium' | 'high';
  deadline: string; // ISO date string (YYYY-MM-DD)
  industry: string; // The manufacturing industry category
  
  // Optional details
  finish?: string;    // Surface finish, e.g. "anodized", "polished"
  tolerance?: string; // Tolerance specifications
  
  // Confidence metrics
  material_confidence?: number; // Confidence score for material (0-1)
  industry_confidence?: number; // Confidence score for industry (0-1)
  
  // Metadata fields
  modelUsed?: string;       // Which model was used for parsing
  parsing_version?: string; // Version of the parsing logic used
  timestamp?: string;       // ISO timestamp of when parsing occurred
  is_reviewed?: boolean;    // Whether a human has reviewed/approved results
};

/**
 * Default values for a ParsedRFQ when extraction fails
 */
export const DEFAULT_RFQ: ParsedRFQ = {
  material: '',
  quantity: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  complexity: 'low',
  deadline: '',
  industry: '',
  finish: '',
  tolerance: '',
  material_confidence: 0,
  industry_confidence: 0,
  is_reviewed: false,
  timestamp: new Date().toISOString(),
};

/**
 * Supabase parsed RFQ draft record
 * Extends ParsedRFQ with additional database-specific fields
 */
export type ParsedRFQDraft = ParsedRFQ & {
  id?: number;
  raw_text: string;
  created_at?: string; 
  user_id?: string;
  original_filename?: string;
  file_type?: string;
  is_processed?: boolean; // Whether it's been routed to a template
};

/**
 * Valid manufacturing industries supported by the application
 */
export const VALID_INDUSTRIES = [
  'metal fabrication',
  'injection molding',
  'cnc machining',
  'sheet metal',
  'electronics assembly'
];

/**
 * Confidence threshold for accepting parsed fields
 */
export const CONFIDENCE_THRESHOLD = 0.6;

/**
 * Schema for normalized data before sending to Groq
 * Helps ensure consistent input format
 */
export type NormalizedRFQInput = {
  text: string;
  fileContext?: {
    filename?: string;
    fileType?: string;
    sheetName?: string;
  };
  userContext?: {
    userId?: string;
    preferredIndustry?: string;
  };
}; 