/**
 * API route handler for file uploads and parsing
 * 
 * Accepts file uploads, extracts text, and parses using Groq API
 * POST /api/v1/parse/upload
 */

import { NextRequest } from 'next/server';
import { extractTextFromFile, ExtractedFileContent } from '@/lib/fileParser';
import { parseRFQ, normalizeInput } from '@/lib/groqClient';
import { saveParsedRFQ, logParsingError } from '@/lib/db/rfqStorage';
import { getCurrentUserId } from '@/lib/auth';
import { NormalizedRFQInput } from '@/types/ParsedRFQ'; 
import { createSuccessResponse, createErrorResponse } from '@/lib/errors';
import { FileParsingError, MissingAPIKeyError, GroqParsingError, LowConfidenceError } from '@/lib/errors';
import logger from '@/lib/logger';

// Component name for logging
const COMPONENT = 'api/v1/parse/upload';

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TEXT_LENGTH = 100 * 1024; // 100KB

/**
 * POST handler for file uploads
 * Extracts text from uploaded files and passes it to the Groq API for parsing
 */
export async function POST(request: NextRequest) {
  logger.info(COMPONENT, 'Received file upload request');
  
  try {
    // Get the user ID (placeholder for now)
    const userId = getCurrentUserId() || 'anonymous-user';
    
    // Verify that the request is multipart/form-data
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return createErrorResponse('Request must be multipart/form-data', 400, COMPONENT);
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    // Validate file
    if (!file) {
      return createErrorResponse('No file provided', 400, COMPONENT);
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      logger.warn(COMPONENT, 'File size exceeded maximum allowed', {
        size: file.size,
        maxSize: MAX_FILE_SIZE,
        fileName: file.name
      });
      
      return createErrorResponse(
        `File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`, 
        400, 
        COMPONENT
      );
    }
    
    // Log file information
    logger.info(COMPONENT, 'Processing file', {
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size,
    });
    
    try {
      // Extract text from the file
      let extractedContent: ExtractedFileContent;
      
      try {
        extractedContent = await extractTextFromFile(file);
      } catch (error) {
        if (error instanceof FileParsingError) {
          await logParsingError({
            errorType: 'file_parsing_error',
            errorMessage: error.message,
            userId,
            fileName: file.name,
            fileType: file.type
          });
          
          return createErrorResponse(error, 400, COMPONENT);
        }
        
        throw error;
      }
      
      // Check if we have text content
      if (!extractedContent.text || extractedContent.text.trim().length === 0) {
        await logParsingError({
          errorType: 'empty_file_content',
          errorMessage: 'No text content could be extracted from the file',
          userId,
          fileName: file.name,
          fileType: file.type
        });
        
        return createErrorResponse('No text content could be extracted from the file', 400, COMPONENT);
      }
      
      // Truncate if text is too long (100KB limit)
      const text = extractedContent.text.length > MAX_TEXT_LENGTH ? 
        extractedContent.text.substring(0, MAX_TEXT_LENGTH) + '\n[Content truncated due to size limits]' : 
        extractedContent.text;
      
      // Log extracted text information
      logger.info(COMPONENT, 'Text extracted from file', {
        charCount: text.length,
        fileName: file.name,
        processingTime: extractedContent.metadata.processingTime,
      });
      
      // Create normalized input for the parser
      const normalizedInput: NormalizedRFQInput = {
        text,
        fileContext: {
          filename: file.name,
          fileType: file.type,
          sheetName: extractedContent.metadata.selectedSheet,
        },
        userContext: {
          userId,
          preferredIndustry: formData.get('preferredIndustry') as string || undefined,
        }
      };
      
      // Parse the extracted text using Groq API
      let parsedRFQ;
      
      try {
        parsedRFQ = await parseRFQ(normalizedInput, {
          useModelFallback: true,
        });
      } catch (error) {
        if (error instanceof MissingAPIKeyError) {
          await logParsingError({
            errorType: 'missing_api_key',
            errorMessage: error.message,
            userId,
            fileName: file.name,
            fileType: file.type
          });
          
          return createErrorResponse(error, 500, COMPONENT);
        }
        
        if (error instanceof LowConfidenceError) {
          // Log low confidence for analysis
          await logParsingError({
            errorType: 'low_confidence',
            errorMessage: 'Confidence scores below threshold',
            userId,
            fileName: file.name,
            fileType: file.type,
            metadata: {
              parsedData: error.parsedData
            }
          });
          
          // Create response object with the data and status code
          const responseData = {
            success: false,
            warning: 'Confidence scores below threshold',
            data: error.parsedData,
            extractedText: text,
          };
          
          // Return with status 400
          return createSuccessResponse(responseData, 400, COMPONENT);
        }
        
        if (error instanceof GroqParsingError) {
          await logParsingError({
            errorType: 'groq_parsing_error',
            errorMessage: error.message,
            userId,
            fileName: file.name,
            fileType: file.type
          });
          
          return createErrorResponse(error, 400, COMPONENT);
        }
        
        throw error;
      }
      
      // Save to database
      const saveResult = await saveParsedRFQ(
        parsedRFQ, 
        text,
        {
          userId,
          filename: file.name,
          fileType: file.type,
          sheetName: extractedContent.metadata.selectedSheet,
        }
      );
      
      if (!saveResult.success) {
        logger.warn(COMPONENT, 'Failed to save parsed RFQ to database', {
          error: saveResult.error?.message
        });
        // Continue anyway since we already have the parsed data
      }
      
      // Create response with parsed data and metadata
      const responseData = {
        success: true,
        data: parsedRFQ,
        extractedText: text,
        fileMetadata: extractedContent.metadata,
        sheets: extractedContent.sheets,
        saved: saveResult.success,
        draftId: saveResult.success ? saveResult.data?.id : undefined
      };
      
      // Return with status 200
      return createSuccessResponse(responseData, 200, COMPONENT);
    } catch (error) {
      // Handle unexpected errors
      logger.error(COMPONENT, 'Error processing file', error, {
        fileName: file.name,
        fileType: file.type,
      });
      
      await logParsingError({
        errorType: 'processing_error',
        errorMessage: error instanceof Error ? error.message : String(error),
        userId,
        fileName: file.name,
        fileType: file.type
      });
      
      return createErrorResponse(
        error instanceof Error ? error : 'Failed to process the file',
        500, 
        COMPONENT
      );
    }
  } catch (error) {
    // Handle unexpected errors in the outer scope
    logger.error(COMPONENT, 'Unexpected error in upload route', error);
    
    await logParsingError({
      errorType: 'unexpected_error',
      errorMessage: error instanceof Error ? error.message : String(error),
      userId: getCurrentUserId() || 'anonymous-user'
    });
    
    return createErrorResponse('An unexpected error occurred', 500, COMPONENT);
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