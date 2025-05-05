import { NextRequest, NextResponse } from 'next/server';

// Force dynamic to help with route handlers
export const dynamic = 'force-dynamic';

async function loadIndustryConfig(industryId: string) {
  try {
    const configModule = await import(`@/app/models/industries/${industryId}.json`);
    return configModule.default || configModule;
  } catch (error) {
    console.error(`Failed to load industry config for ${industryId}:`, error);
    return null;
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get industryId from search params instead of path params
    const industryId = request.nextUrl.searchParams.get('industryId');

    if (!industryId) {
      return NextResponse.json({
        industries: [
          {
            id: "metal_fabrication",
            name: "Metal Fabrication",
            description: "Precision manufacturing of metal parts through cutting, bending, and assembling processes.",
            icon: "<svg class='w-4 h-4' ...></svg>"
          },
          {
            id: "injection_molding",
            name: "Injection Molding",
            description: "Production of plastic parts by injecting molten material into a mold cavity where it cools and hardens.",
            icon: "<svg class='w-4 h-4' ...></svg>"
          }
        ]
      });
    }

    const config = await loadIndustryConfig(industryId);

    if (!config) {
      return NextResponse.json(
        { error: `Industry '${industryId}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(config);
  } catch (_error) {
    console.error("API GET error:", _error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
