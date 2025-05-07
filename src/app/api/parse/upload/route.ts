import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile, FileParsingError } from '@/lib/fileParser';
import { parseRFQ, MissingAPIKeyError } from '@/lib/groqParser';
import { saveParsedRFQ } from '@/lib/db/saveParsedRFQ';
import { errorResponse, logInfo, logWarn } from '@/lib/errors';

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ROUTE_PATH = '/api/parse/upload';

/**
 * POST handler for file uploads
 * Extracts text from uploaded files and passes it to the Groq API for parsing
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Start request processing
    logInfo(ROUTE_PATH, 'incoming_file_upload', {
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });
    
    // Verify that the request is multipart/form-data
    if (!request.headers.get('content-type')?.includes('multipart/form-data')) {
      return errorResponse('Request must be multipart/form-data', 400);
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Validate file
    if (!file) {
      return errorResponse('No file provided', 400);
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      logWarn(ROUTE_PATH, 'file_size_exceeded', {
        size: file.size,
        maxSize: MAX_FILE_SIZE
      });
      return errorResponse(`File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`, 400);
    }
    
    // Log file information
    logInfo(ROUTE_PATH, 'file_metadata', {
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size
    });
    
    try {
      // Extract text from the file
      const extractedText = await extractTextFromFile(file);
      
      if (!extractedText || extractedText.trim().length === 0) {
        logWarn(ROUTE_PATH, 'empty_file_content', {
          fileType: file.type,
          fileName: file.name
        });
        return errorResponse('No text content could be extracted from the file', 400);
      }
      
      // Log extracted text length
      logInfo(ROUTE_PATH, 'extracted_text', {
        length: extractedText.length,
        fileName: file.name
      });
      
      // Parse the extracted text using Groq API
      const parsedRFQ = await parseRFQ(extractedText);
      
      // Save to database if parsing was successful
      if (parsedRFQ && parsedRFQ.material) {
        const saveResult = await saveParsedRFQ(parsedRFQ, extractedText);
        
        if (!saveResult.success) {
          logWarn(ROUTE_PATH, 'db_save_failed', {
            error: saveResult.error?.message
          });
          // Continue anyway since we already have the parsed data
        }
      }
      
      // Return the parsed data
      return NextResponse.json(parsedRFQ);
    } catch (error) {
      // Handle specific known errors
      if (error instanceof FileParsingError) {
        logWarn(ROUTE_PATH, 'file_parsing_error', {
          fileType: error.fileType,
          error: error.message
        });
        return errorResponse(`Failed to parse file: ${error.message}`, 400);
      }
      
      if (error instanceof MissingAPIKeyError) {
        logWarn(ROUTE_PATH, 'missing_api_key', {
          error: error.message
        });
        return errorResponse('Server configuration error (API key missing)', 500);
      }
      
      // Handle other errors
      logWarn(ROUTE_PATH, 'processing_error', {
        error: error instanceof Error ? error.message : String(error)
      });
      return errorResponse('Failed to process the file', 500);
    }
  } catch (error) {
    // Handle unexpected errors
    logWarn(ROUTE_PATH, 'unexpected_error', {
      error: error instanceof Error ? error.message : String(error)
    });
    return errorResponse('An unexpected error occurred', 500);
  }
} 