import { NextRequest, NextResponse } from "next/server";
import { calculateFallbackQuoteAmount } from "@/lib/fallbackQuote";
import { submitQuoteToDB, QuoteData } from "@/lib/db/submitQuote";

// Force dynamic to ensure latest data
export const dynamic = 'force-dynamic';

// Quote request schema
interface QuoteRequest {
  email: string;
  industry: string;
  material: string;
  quantity: number;
  complexity: string;
  surface_finish: string;
  lead_time_preference: string;
  custom_fields?: Record<string, unknown>;
  full_quote_shown: boolean;
}

/**
 * Convert a quote amount to a range format for frontend display
 */
const convertToRangeFormat = (quote: number): { minAmount: number; maxAmount: number } => {
  return {
    minAmount: Math.round(quote * 0.9),
    maxAmount: Math.round(quote * 1.1)
  };
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the request data
    const data: QuoteRequest = await request.json();

    // Validate required fields
    const { email, industry, material, quantity } = data;
    if (!email || !industry || !material || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Try to calculate quote using Python backend
    let quoteAmount = 0;
    let calculatedBy = "fallback";
    
    try {
      // Set a timeout to avoid hanging if backend is unresponsive
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const backendResponse = await fetch('http://localhost:8000/calculate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industryId: industry,
          material,
          quantity,
          complexity: data.complexity
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!backendResponse.ok) {
        throw new Error(`Backend service responded with status: ${backendResponse.status}`);
      }
      
      const result = await backendResponse.json();
      quoteAmount = result.quote;
      calculatedBy = "backend";
      
    } catch (backendError) {
      // Log the backend error
      console.error("Backend calculation error:", backendError);
      console.warn("Falling back to local calculation for quote submission");
      
      // Use the centralized fallback calculation utility
      quoteAmount = await calculateFallbackQuoteAmount(
        material,
        quantity,
        data.complexity,
        industry
      );
    }
    
    // Create data to be stored in Supabase
    const quoteData: QuoteData = {
      email,
      industry,
      material,
      quantity,
      complexity: data.complexity,
      surface_finish: data.surface_finish,
      lead_time_preference: data.lead_time_preference,
      custom_fields: data.custom_fields ?? {},
      full_quote_shown: data.full_quote_shown,
      quote_amount: quoteAmount,
      calculation_method: calculatedBy,
      notes: `Quote for ${industry}, ${material}, qty: ${quantity}`
    };

    // Submit the quote to the database using the utility
    const dbResult = await submitQuoteToDB(quoteData);
    
    // Handle database errors
    if (!dbResult.success) {
      console.error("Error saving quote to database:", dbResult.error);
      return NextResponse.json(
        { error: "Failed to save quote" }, 
        { status: 500 }
      );
    }

    // Calculate the quote range for the response
    const quoteRange = convertToRangeFormat(quoteAmount);
    
    // Return success response with the quote range and lead time
    return NextResponse.json({
      success: true,
      message: "Quote submitted successfully",
      quote_range: quoteRange,
      lead_time_estimate:
        data.lead_time_preference === "Rush"
          ? "5–7 business days"
          : "10–14 business days",
      calculation_method: calculatedBy
    });
  } catch (_error) {
    console.error("Error processing quote submission:", _error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
