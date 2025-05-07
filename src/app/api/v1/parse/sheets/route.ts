/**
 * API route handler for selecting a specific sheet from Excel files
 * 
 * Allows the client to select which sheet should be used for parsing
 * POST /api/v1/parse/sheets
 */

import { NextRequest } from 'next/server';
import { extractTextFromFile, ExtractedFileContent } from '@/lib/fileParser';
import { getCurrentUserId } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse, FileParsingError } from '@/lib/errors';
import logger from '@/lib/logger';

// Component name for logging
const COMPONENT = 'api/v1/parse/sheets';

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * POST handler to extract sheets from an Excel file
 */
export async function POST(request: NextRequest) {
  logger.info(COMPONENT, 'Received request to extract Excel sheets');
  
  try {
    // Get the user ID
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
    
    // Validate file type - must be Excel
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isExcel = 
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      fileType === 'application/vnd.ms-excel' ||
      fileName.endsWith('.xlsx') || 
      fileName.endsWith('.xls');
    
    if (!isExcel) {
      return createErrorResponse('File must be an Excel file (.xlsx or .xls)', 400, COMPONENT);
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
    logger.info(COMPONENT, 'Processing Excel file', {
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size,
    });
    
    try {
      // Extract text from the file to get all sheets
      const extractedContent = await extractTextFromFile(file);
      
      // If there are no sheets, return an error
      if (!extractedContent.sheets || extractedContent.sheets.length === 0) {
        return createErrorResponse('No sheets found in the Excel file', 400, COMPONENT);
      }
      
      // Return sheet information
      return createSuccessResponse({
        fileName: file.name,
        fileType: file.type,
        sheets: extractedContent.sheets.map(sheet => ({
          name: sheet.name,
          rowCount: sheet.rowCount,
          isEmpty: sheet.isEmpty,
          preview: sheet.text.substring(0, 200) + (sheet.text.length > 200 ? '...' : '')
        })),
        selectedSheet: extractedContent.metadata.selectedSheet,
        fileMetadata: {
          size: file.size,
          sheetCount: extractedContent.sheets.length,
        }
      });
    } catch (error) {
      // Handle file parsing errors
      if (error instanceof FileParsingError) {
        return createErrorResponse(error, 400, COMPONENT);
      }
      
      // Handle other errors
      logger.error(COMPONENT, 'Error processing Excel file', {
        error: error instanceof Error ? error.message : String(error),
        fileName: file.name,
      });
      
      return createErrorResponse(
        'Failed to process the Excel file', 
        500, 
        COMPONENT
      );
    }
  } catch (error) {
    // Handle unexpected errors
    logger.error(COMPONENT, 'Unexpected error in sheets route', {
      error: error instanceof Error ? error.message : String(error)
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