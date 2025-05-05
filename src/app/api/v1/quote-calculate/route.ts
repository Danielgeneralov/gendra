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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get industryId from search params
    const industryId = request.nextUrl.searchParams.get('industryId');
    
    if (!industryId) {
      return NextResponse.json(
        { error: "Missing required 'industryId' parameter" },
        { status: 400 }
      );
    }
    
    const requestData: Record<string, unknown> = await request.json();
    
    const config = await loadIndustryConfig(industryId);

    let basePrice = 100;
    let complexityFactor = 1.0;
    let materialCost = 50;
    let quantityDiscount = 0;
    let complexity = "Medium";

    if (config) {
      basePrice = config.basePriceCoefficient || 100;

      interface FormField {
        id: string;
        options?: Array<{
          value: string;
          label?: string;
          factor?: number;
          costFactor?: number;
        }>;
      }

      const complexityField = config.formFields?.find((f: FormField) => f.id === 'complexity');
      const complexityOption = complexityField?.options?.find(
        (o: { value: string }) => o.value === requestData.complexity
      );
      if (complexityOption) {
        complexityFactor = complexityOption.factor || 1.0;
        complexity = complexityOption.label || "Medium";
      }

      const materialField = config.formFields?.find((f: FormField) => f.id === 'material');
      const materialOption = materialField?.options?.find(
        (o: { value: string }) => o.value === requestData.material
      );
      if (materialOption) {
        materialCost = basePrice * (materialOption.costFactor || 1.0);
      }
    }

    // Use Number() for better parsing of strings to numbers
    const quantity = Number(requestData.quantity) || 1;
    if (quantity > 100) quantityDiscount = 0.15;
    else if (quantity > 50) quantityDiscount = 0.10;
    else if (quantity > 20) quantityDiscount = 0.05;

    let quote = basePrice + materialCost;
    quote *= complexityFactor;
    quote *= quantity;
    quote *= (1 - quantityDiscount);

    let leadTimeDays = 7;
    if (complexityFactor > 1.3) leadTimeDays += 7;
    if (quantity > 50) leadTimeDays += 5;

    return NextResponse.json({
      quote: Math.round(quote * 100) / 100,
      leadTime: `${leadTimeDays} days`,
      complexity,
      basePrice,
      materialCost,
      complexityFactor,
      quantityDiscount
    });
  } catch (_error) {
    console.error("API POST error:", _error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 