import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Define the complex types we need
type ComplexityLevel = { factor: number; name: string; };
type MaterialCosts = Record<string, number>;
type IndustryPricing = Record<string, number>;

const complexityLevels: Record<string, ComplexityLevel> = {
  low: { factor: 1.0, name: "Low" },
  medium: { factor: 1.5, name: "Medium" },
  high: { factor: 2.0, name: "High" },
};

const materialCosts: MaterialCosts = {
  steel: 2.5,
  aluminum: 3.2,
  plastic: 1.8,
  titanium: 15.0,
  brass: 6.0,
  copper: 7.2,
  "stainless-steel": 5.5,
  "carbon-fiber": 25.0,
  wood: 1.2,
  glass: 4.0,
  concrete: 0.8,
  ceramic: 8.5,
  rubber: 3.0,
  default: 5.0,
};

const industryBasePricing: IndustryPricing = {
  automotive: 500,
  aerospace: 1200,
  medical: 900,
  "consumer-electronics": 300,
  "industrial-equipment": 650,
  construction: 400,
  energy: 800,
  default: 500,
};

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
    
    // Return industry-specific pricing information and constants
    // This can be used by the frontend to initialize and validate quote calculations
    return NextResponse.json({
      industry: industryId,
      basePrice: industryBasePricing[industryId] || industryBasePricing.default,
      materialCosts: Object.keys(materialCosts).map(material => ({
        id: material,
        name: material.charAt(0).toUpperCase() + material.slice(1).replace('-', ' '),
        rate: materialCosts[material] || materialCosts.default
      })),
      complexityLevels: Object.keys(complexityLevels).map(key => ({
        id: key,
        ...complexityLevels[key]
      })),
      message: "Use the /api/v1/quote-calculate endpoint with POST for actual quote calculations"
    });
  } catch (_error) {
    console.error("Error retrieving industry pricing data:", _error);
    return NextResponse.json(
      { error: "Failed to retrieve industry pricing data" },
      { status: 500 }
    );
  }
} 