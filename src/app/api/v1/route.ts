import { NextRequest, NextResponse } from 'next/server';

// Force dynamic to help with route handlers
export const dynamic = 'force-dynamic';

// This function is no longer needed since we're using the quote-config endpoint
// It's kept for reference but can be removed
async function loadIndustryConfig(industryId: string) {
  try {
    const configModule = await import(`@/app/models/industries/${industryId}.json`);
    return configModule.default || configModule;
  } catch (error) {
    console.error(`Failed to load industry config for ${industryId}:`, error);
    return null;
  }
}

/**
 * Root API handler that provides information about available industries
 * and routes to other endpoints
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get industryId from search params
    const industryId = request.nextUrl.searchParams.get('industryId');

    // If no industry specified, return a list of available industries
    if (!industryId) {
      return NextResponse.json({
        apiVersion: "1.0",
        endpoints: [
          {
            path: "/api/v1/quote-calculate",
            method: "POST",
            description: "Calculate a quote based on industry and specifications",
            params: {
              industryId: "Required - The industry ID for pricing calculations"
            }
          },
          {
            path: "/api/v1/submit-quote",
            method: "POST",
            description: "Submit a finalized quote to be stored in the system"
          },
          {
            path: "/api/v1/quote-config/{industryId}",
            method: "GET",
            description: "Get pricing configuration data for a specific industry"
          }
        ],
        industries: [
          {
            id: "metal_fabrication",
            name: "Metal Fabrication",
            description: "Precision manufacturing of metal parts through cutting, bending, and assembling processes."
          },
          {
            id: "injection_molding",
            name: "Injection Molding",
            description: "Production of plastic parts by injecting molten material into a mold cavity where it cools and hardens."
          }
        ]
      });
    }

    // If industryId was specified, redirect to the industry-specific endpoint
    // Changed to use the new quote-config endpoint to avoid conflicts
    return NextResponse.redirect(
      new URL(`/api/v1/quote-config/${industryId}`, request.url)
    );
  } catch (_error) {
    console.error("API GET error:", _error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
