/**
 * API route handler for retrieving RFQ drafts
 * 
 * Lists RFQ drafts for the current user or a specified user
 * GET /api/v1/drafts
 */

import { NextRequest } from 'next/server';
import { getRecentParsedRFQDrafts } from '@/lib/db/rfqStorage';
import { getCurrentUserId } from '@/lib/auth';
import { createSuccessResponse, createErrorResponse } from '@/lib/errors';
import logger from '@/lib/logger';

// Component name for logging
const COMPONENT = 'api/v1/drafts';

/**
 * GET handler to retrieve parsed RFQ drafts
 */
export async function GET(request: NextRequest) {
  logger.info(COMPONENT, 'Received request to get RFQ drafts');
  
  try {
    // Get the current user ID
    const userId = getCurrentUserId() || 'anonymous-user';
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    
    // Parse limit parameter, default to 10
    let limit = 10;
    const limitParam = searchParams.get('limit');
    if (limitParam && !isNaN(Number(limitParam))) {
      limit = Math.min(Math.max(1, parseInt(limitParam, 10)), 100); // Between 1 and 100
    }
    
    // Get drafts
    const result = await getRecentParsedRFQDrafts(userId, limit);
    
    if (!result.success) {
      logger.error(COMPONENT, 'Failed to retrieve RFQ drafts', {
        error: result.error?.message,
        userId
      });
      
      return createErrorResponse(
        result.error?.message || 'Failed to retrieve RFQ drafts',
        500,
        COMPONENT
      );
    }
    
    // Return the drafts
    return createSuccessResponse({
      drafts: result.data?.map(draft => ({
        id: draft.id,
        material: draft.material,
        quantity: draft.quantity,
        dimensions: draft.dimensions,
        complexity: draft.complexity,
        deadline: draft.deadline,
        industry: draft.industry,
        created_at: draft.created_at,
        original_filename: draft.original_filename,
        file_type: draft.file_type,
        is_reviewed: draft.is_reviewed,
        is_processed: draft.is_processed,
        material_confidence: draft.material_confidence,
        industry_confidence: draft.industry_confidence,
      })) || [],
      count: result.data?.length || 0,
      limit
    });
  } catch (error) {
    // Handle unexpected errors
    logger.error(COMPONENT, 'Unexpected error in drafts route', {
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    status: 204,
  });
} 