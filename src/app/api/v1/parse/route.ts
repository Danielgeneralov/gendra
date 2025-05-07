/**
 * API route handler for parsing RFQ text
 * 
 * Parses raw text using Groq API and returns structured data
 * POST /api/v1/parse
 */

import { NextRequest } from 'next/server';
import { parseRFQ } from '@/lib/groqClient';
import { saveParsedRFQ, logParsingError } from '@/lib/db/rfqStorage';
import { getCurrentUserId } from '@/lib/auth';
import { NormalizedRFQInput } from '@/types/ParsedRFQ';
import { createSuccessResponse, createErrorResponse } from '@/lib/errors';
import { MissingAPIKeyError, GroqParsingError, LowConfidenceError } from '@/lib/errors';
import logger from '@/lib/logger';

// Component name for logging
const COMPONENT = 'api/v1/parse';

// Maximum text length allowed (100KB)
const MAX_TEXT_LENGTH = 100 * 1024;

/**
 * Handles POST requests to parse RFQ text
 * 
 * @param request - The HTTP request
 * @returns A formatted response with parsed RFQ data or error
 */
export async function POST(request: NextRequest) {
  logger.info(COMPONENT, 'Received text parsing request');
  
  try {
    // Get the user ID (placeholder for now)
    const userId = getCurrentUserId() || 'anonymous-user';
    
    // Parse and validate the request body
    const body = await request.json().catch(() => ({}));
    
    // Validate text is provided
    if (!body.text || typeof body.text !== 'string' || body.text.trim().length < 10) {
      return createErrorResponse(
        'Text is required and must be at least 10 characters',
        400,
        COMPONENT
      );
    }
    
    // Truncate if text is too long (100KB limit)
    const text = body.text.length > MAX_TEXT_LENGTH ? 
      body.text.substring(0, MAX_TEXT_LENGTH) + '\n[Content truncated due to size limits]' : 
      body.text;
    
    // Create normalized input with any metadata provided
    const normalizedInput: NormalizedRFQInput = {
      text,
      fileContext: body.fileContext || {
        filename: body.filename || undefined,
        fileType: body.fileType || undefined,
      },
      userContext: {
        userId,
        preferredIndustry: body.preferredIndustry,
      }
    };
    
    try {
      // Parse the text using Groq
      const parsedRFQ = await parseRFQ(normalizedInput, {
        useModelFallback: true,
      });
      
      // Save to database
      const saveResult = await saveParsedRFQ(
        parsedRFQ, 
        text,
        {
          userId,
          filename: normalizedInput.fileContext?.filename,
          fileType: normalizedInput.fileContext?.fileType,
        }
      );
      
      if (!saveResult.success) {
        logger.warn(COMPONENT, 'Failed to save parsed RFQ to database', {
          error: saveResult.error?.message
        });
        // Continue anyway since we have the parsed data
      }
      
      // Return the parsed RFQ
      return createSuccessResponse({
        success: true,
        data: parsedRFQ,
        saved: saveResult.success,
        draftId: saveResult.success ? saveResult.data?.id : undefined
      });
    } catch (error) {
      // Handle specific errors
      if (error instanceof MissingAPIKeyError) {
        await logParsingError({
          errorType: 'missing_api_key',
          errorMessage: error.message,
          userId,
          textSample: text.substring(0, 200)
        });
        
        return createErrorResponse(error, 500, COMPONENT);
      }
      
      if (error instanceof LowConfidenceError) {
        // Log low confidence for analysis
        await logParsingError({
          errorType: 'low_confidence',
          errorMessage: 'Confidence scores below threshold',
          userId,
          textSample: text.substring(0, 200),
          metadata: {
            parsedData: error.parsedData
          }
        });
        
        // Return the parsed data with a warning - using status 400 to indicate issue
        return createSuccessResponse({
          success: false,
          warning: 'Confidence scores below threshold',
          data: error.parsedData,
        }, 400);
      }
      
      if (error instanceof GroqParsingError) {
        await logParsingError({
          errorType: 'groq_parsing_error',
          errorMessage: error.message,
          userId,
          textSample: text.substring(0, 200)
        });
        
        return createErrorResponse(error, 400, COMPONENT);
      }
      
      // Generic error handling
      logger.error(COMPONENT, 'Error parsing RFQ', error);
      
      await logParsingError({
        errorType: 'unexpected_error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        userId,
        textSample: text.substring(0, 200)
      });
      
      return createErrorResponse(
        error instanceof Error ? error : 'An unexpected error occurred while parsing the RFQ',
        500,
        COMPONENT
      );
    }
  } catch (error) {
    logger.error(COMPONENT, 'Unhandled error in parse route', error);
    
    return createErrorResponse(
      'An unexpected error occurred',
      500,
      COMPONENT
    );
  }
}

/**
 * Handles OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    status: 204,
  });
} 