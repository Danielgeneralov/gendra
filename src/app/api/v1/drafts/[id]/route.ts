/**
 * API route handler for managing individual RFQ drafts
 * 
 * GET /api/v1/drafts/[id] - Get a specific draft
 * PATCH /api/v1/drafts/[id] - Update a draft's status
 * DELETE /api/v1/drafts/[id] - Delete a draft
 */

import { NextRequest } from 'next/server';
import { 
  getParsedRFQDraft, 
  updateRFQReviewStatus, 
  updateRFQProcessingStatus 
} from '@/lib/db/rfqStorage';
import { createSuccessResponse, createErrorResponse, NotFoundError } from '@/lib/errors';
import { getCurrentUserId } from '@/lib/auth';
import logger from '@/lib/logger';

// Component name for logging
const COMPONENT = 'api/v1/drafts/[id]';

/**
 * Extracts the draft ID from the request URL
 * 
 * @param request - The incoming request
 * @returns The parsed draft ID or null if invalid
 */
function getDraftId(request: NextRequest): number | null {
  try {
    // Extract ID from URL path segments
    const pathSegments = request.nextUrl.pathname.split('/');
    const idStr = pathSegments[pathSegments.length - 1];
    
    // Parse as number
    const id = parseInt(idStr, 10);
    
    // Validate
    if (isNaN(id) || id <= 0) {
      return null;
    }
    
    return id;
  } catch {
    return null;
  }
}

/**
 * GET handler to retrieve a specific RFQ draft
 */
export async function GET(request: NextRequest) {
  const draftId = getDraftId(request);
  
  if (!draftId) {
    return createErrorResponse('Invalid draft ID', 400, COMPONENT);
  }
  
  logger.info(COMPONENT, 'Retrieving RFQ draft', { draftId });
  
  try {
    // Get the draft
    const result = await getParsedRFQDraft(draftId);
    
    if (!result.success) {
      logger.error(COMPONENT, 'Failed to retrieve RFQ draft', {
        error: result.error?.message,
        draftId
      });
      
      if (result.error?.message?.includes('not found')) {
        return createErrorResponse(
          new NotFoundError('RFQ Draft', draftId),
          404,
          COMPONENT
        );
      }
      
      return createErrorResponse(
        result.error?.message || 'Failed to retrieve RFQ draft',
        500,
        COMPONENT
      );
    }
    
    // Return the draft
    return createSuccessResponse({
      draft: {
        id: result.data?.id,
        material: result.data?.material,
        quantity: result.data?.quantity,
        dimensions: result.data?.dimensions,
        complexity: result.data?.complexity,
        deadline: result.data?.deadline,
        industry: result.data?.industry,
        finish: result.data?.finish,
        tolerance: result.data?.tolerance,
        created_at: result.data?.created_at,
        original_filename: result.data?.original_filename,
        file_type: result.data?.file_type,
        is_reviewed: result.data?.is_reviewed,
        is_processed: result.data?.is_processed,
        material_confidence: result.data?.material_confidence,
        industry_confidence: result.data?.industry_confidence,
        parsing_version: result.data?.parsing_version,
        raw_text: result.data?.raw_text,
      }
    });
  } catch (error) {
    logger.error(COMPONENT, 'Unexpected error retrieving RFQ draft', {
      error: error instanceof Error ? error.message : String(error),
      draftId
    });
    
    return createErrorResponse('An unexpected error occurred', 500, COMPONENT);
  }
}

/**
 * PATCH handler to update a draft's status
 */
export async function PATCH(request: NextRequest) {
  const draftId = getDraftId(request);
  
  if (!draftId) {
    return createErrorResponse('Invalid draft ID', 400, COMPONENT);
  }
  
  logger.info(COMPONENT, 'Updating RFQ draft status', { draftId });
  
  try {
    // Get the current user ID (for validation/logging)
    const userId = getCurrentUserId() || 'anonymous-user';
    
    // Parse the request body
    const body = await request.json().catch(() => ({}));
    
    // Validate body
    if (!body || (body.is_reviewed === undefined && body.is_processed === undefined)) {
      return createErrorResponse('Request must include is_reviewed or is_processed field', 400, COMPONENT);
    }
    
    // Determine which fields to update
    let updateResult;
    
    if (body.is_reviewed !== undefined) {
      // Update review status
      updateResult = await updateRFQReviewStatus(draftId, !!body.is_reviewed);
      
      if (!updateResult.success) {
        logger.error(COMPONENT, 'Failed to update RFQ review status', {
          error: updateResult.error?.message,
          draftId,
          userId
        });
        
        if (updateResult.error?.message?.includes('not found')) {
          return createErrorResponse(
            new NotFoundError('RFQ Draft', draftId),
            404,
            COMPONENT
          );
        }
        
        return createErrorResponse(
          updateResult.error?.message || 'Failed to update RFQ review status',
          500,
          COMPONENT
        );
      }
    }
    
    if (body.is_processed !== undefined) {
      // Update processing status
      updateResult = await updateRFQProcessingStatus(draftId, !!body.is_processed);
      
      if (!updateResult.success) {
        logger.error(COMPONENT, 'Failed to update RFQ processing status', {
          error: updateResult.error?.message,
          draftId,
          userId
        });
        
        if (updateResult.error?.message?.includes('not found')) {
          return createErrorResponse(
            new NotFoundError('RFQ Draft', draftId),
            404,
            COMPONENT
          );
        }
        
        return createErrorResponse(
          updateResult.error?.message || 'Failed to update RFQ processing status',
          500,
          COMPONENT
        );
      }
    }
    
    // Return success response
    return createSuccessResponse({
      success: true,
      draftId,
      updated: {
        is_reviewed: body.is_reviewed !== undefined ? !!body.is_reviewed : undefined,
        is_processed: body.is_processed !== undefined ? !!body.is_processed : undefined,
      }
    });
  } catch (error) {
    logger.error(COMPONENT, 'Unexpected error updating RFQ draft', {
      error: error instanceof Error ? error.message : String(error),
      draftId
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
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    status: 204,
  });
} 