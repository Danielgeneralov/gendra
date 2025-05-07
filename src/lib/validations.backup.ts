/**
 * validations.ts
 * Centralized validation schemas for various app data structures
 * using Zod for runtime type checking and validation
 */

import { z } from 'zod';
import { VALID_INDUSTRIES } from '@/types/ParsedRFQ';

/**
 * Validation schema for ParsedRFQ
 */
export const ParsedRFQSchema = z.object({
  // Required fields
  material: z.string().min(1, 'Material is required'),
  quantity: z.number().int().positive('Quantity must be a positive number'),
  dimensions: z.object({
    length: z.number().nonnegative('Length must be a non-negative number'),
    width: z.number().nonnegative('Width must be a non-negative number'),
    height: z.number().nonnegative('Height must be a non-negative number'),
  }),
  complexity: z.enum(['low', 'medium', 'high']),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Deadline must be in YYYY-MM-DD format'),
  industry: z.enum(VALID_INDUSTRIES as [string, ...string[]]),
  
  // Optional fields
  finish: z.string().optional(),
  tolerance: z.string().optional(),
  
  // Confidence scores
  material_confidence: z.number().min(0).max(1).optional(),
  industry_confidence: z.number().min(0).max(1).optional(),
  
  // Metadata fields
  modelUsed: z.string().optional(),
  parsing_version: z.string().optional(),
  timestamp: z.string().optional(),
  is_reviewed: z.boolean().optional(),
});

/**
 * Validation schema for RFQ parsing request
 */
export const RFQParseRequestSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters long'),
  filename: z.string().optional(),
  fileType: z.string().optional(),
  preferredIndustry: z.string().optional(),
});

/**
 * Validation schema for updating RFQ draft status
 */
export const UpdateRFQStatusSchema = z.object({
  is_reviewed: z.boolean().optional(),
  is_processed: z.boolean().optional(),
}).refine(
  (data: { is_reviewed?: boolean; is_processed?: boolean }) => 
    data.is_reviewed !== undefined || data.is_processed !== undefined,
  {
    message: 'At least one of is_reviewed or is_processed must be provided',
  }
);

/**
 * Validation schema for normalized RFQ input
 */
export const NormalizedRFQInputSchema = z.object({
  text: z.string().min(1, 'Text content is required'),
  fileContext: z.object({
    filename: z.string().optional(),
    fileType: z.string().optional(),
    sheetName: z.string().optional(),
  }).optional(),
  userContext: z.object({
    userId: z.string().optional(),
    preferredIndustry: z.string().optional(),
  }).optional(),
});

/**
 * Validates data against a schema and returns errors
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validated data or validation errors
 */
export function validate<T>(schema: z.ZodType<T>, data: unknown): { 
  success: true; 
  data: T; 
} | { 
  success: false; 
  errors: z.ZodError['errors'];
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors };
    }
    // Re-throw any other errors
    throw error;
  }
}

/**
 * Formats Zod validation errors into a user-friendly format
 * 
 * @param errors - Zod validation errors
 * @returns An object with field keys and error messages
 */
export function formatValidationErrors(errors: z.ZodError['errors']): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  for (const error of errors) {
    const path = error.path.join('.');
    formattedErrors[path || 'root'] = error.message;
  }
  
  return formattedErrors;
} 