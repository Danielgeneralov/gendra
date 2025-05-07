/**
 * validations.ts
 * Simple validation utilities
 */

import { z } from 'zod';

// Valid industries supported by the application
const VALID_INDUSTRIES = [
  'metal fabrication',
  'injection molding',
  'cnc machining',
  'sheet metal',
  'electronics assembly'
];

/**
 * Basic validation schema for RFQ parsing request
 */
export const RFQParseRequestSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters long'),
  filename: z.string().optional(),
  fileType: z.string().optional(),
  preferredIndustry: z.string().optional(),
});

/**
 * Simple validate function that returns either data or null
 */
export function validate<T>(schema: z.ZodType<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Validation error:', error);
    return null;
  }
} 