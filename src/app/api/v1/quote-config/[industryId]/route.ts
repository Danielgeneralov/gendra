import { NextRequest, NextResponse } from "next/server";
import { getIndustryConfig, getFrontendConfig } from "@/lib/industryRegistry";

export const dynamic = "force-dynamic";

/**
 * GET handler for industry-specific pricing information and configuration data
 * This endpoint only serves static configuration data and does NOT perform quote calculations
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract industryId from the URL path segments
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    const industryId = pathSegments[pathSegments.length - 1];
    
    // Validate the industry
    if (!industryId || industryId === '[industryId]') {
      return NextResponse.json(
        { error: "Invalid industry identifier" },
        { status: 400 }
      );
    }
    
    // Get the industry configuration from the registry
    const industryConfig = getIndustryConfig(industryId);
    
    if (!industryConfig) {
      return NextResponse.json(
        { error: `Industry '${industryId}' not found` },
        { status: 404 }
      );
    }
    
    // By default, return the frontend-safe version of the config
    // This filters out any fields marked as backendOnly
    const config = getFrontendConfig(industryConfig);
    
    // Return the config
    return NextResponse.json({
      ...config,
      message: "Use the /api/v1/quote-calculate endpoint with POST for actual quote calculations"
    });
  } catch (error) {
    console.error("Error retrieving industry pricing data:", error);
    return NextResponse.json(
      { error: "Failed to retrieve industry pricing data" },
      { status: 500 }
    );
  }
} 