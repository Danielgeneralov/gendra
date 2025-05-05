import { NextRequest, NextResponse } from 'next/server';
import { calculateFallbackQuote } from '@/lib/fallbackQuote';

// Force dynamic to help with route handlers
export const dynamic = 'force-dynamic';

/**
 * Load industry-specific configuration file if available
 * This is used to enrich the request with industry-specific configurations
 */
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
 * POST handler for quote calculations
 * Forwards the calculation request to the Python backend service
 * Falls back to simple calculation if the backend is unavailable
 */
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
    
    // Parse request data
    const requestData = await request.json();
    
    // Try to load industry-specific configuration
    const config = await loadIndustryConfig(industryId);

    // Prepare data for backend calculation
    const calculationData = {
      industryId,
      ...requestData,
      // Add any industry-specific config data that might be useful
      industryConfig: config ? {
        basePrice: config.basePriceCoefficient,
        formFields: config.formFields
      } : undefined
    };
    
    try {
      // Send to Python backend for calculation
      // Use a timeout to avoid hanging if backend is unresponsive
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const backendResponse = await fetch('http://localhost:8000/calculate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calculationData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!backendResponse.ok) {
        throw new Error(`Backend service responded with status: ${backendResponse.status}`);
      }
      
      const result = await backendResponse.json();
      
      // Add a flag to indicate this was calculated by the backend service
      result.calculatedBy = "backend";
      
      return NextResponse.json(result);
      
    } catch (backendError) {
      // Log the backend error
      console.error("Backend calculation error:", backendError);
      console.warn("Falling back to local calculation");
      
      // Use the centralized fallback calculation utility
      const fallbackResult = await calculateFallbackQuote({
        industryId,
        material: requestData.material,
        quantity: requestData.quantity,
        complexity: requestData.complexity,
        dimensions: requestData.dimensions
      });
      
      // Return result
      return NextResponse.json(fallbackResult);
    }
  } catch (_error) {
    console.error("API POST error:", _error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 