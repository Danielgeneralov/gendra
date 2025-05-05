import { NextRequest, NextResponse } from "next/server";
import { getIndustryConfig, getFrontendConfig } from "@/lib/industryRegistry";
import { errorResponse, logInfo } from "@/lib/errors";

export const dynamic = "force-dynamic";

// Route path constant for logging
const ROUTE_PATH = '/api/v1/quote-config/[industryId]';

/**
 * GET handler for industry-specific pricing information and configuration data
 * This endpoint only serves static configuration data and does NOT perform quote calculations
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown-ip';
    
    // Extract industryId from the URL path segments
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const industryId = pathSegments[pathSegments.length - 1];
    
    // Log incoming request with structured metadata
    logInfo(ROUTE_PATH, 'incoming_request', {
      ip: clientIp,
      method: request.method,
      industryId,
      path: url.pathname
    });
    
    // Validate the industry
    if (!industryId || industryId === '[industryId]') {
      return errorResponse("Invalid industry identifier", 400, {
        route: ROUTE_PATH,
        ip: clientIp
      });
    }
    
    // Get the industry configuration from the registry
    const industryConfig = getIndustryConfig(industryId);
    
    if (!industryConfig) {
      return errorResponse(`Industry '${industryId}' not found`, 404, {
        route: ROUTE_PATH,
        ip: clientIp,
        industryId
      });
    }
    
    // By default, return the frontend-safe version of the config
    // This filters out any fields marked as backendOnly
    const config = getFrontendConfig(industryConfig);
    
    logInfo(ROUTE_PATH, 'config_retrieved', {
      ip: clientIp,
      industryId,
      configFieldsCount: Object.keys(config).length
    });
    
    // Return the config
    return NextResponse.json({
      ...config,
      message: "Use the /api/v1/quote-calculate endpoint with POST for actual quote calculations"
    });
  } catch (error) {
    return errorResponse("Failed to retrieve industry pricing data", 500, {
      route: ROUTE_PATH,
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: error instanceof Error ? error.message : String(error)
    });
  }
} 