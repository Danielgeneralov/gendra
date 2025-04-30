import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Quote request schema (TypeScript equivalent of Pydantic model)
interface QuoteRequest {
  email: string;
  industry: string;
  material: string;
  quantity: number;
  complexity: string;
  surface_finish: string;
  lead_time_preference: string;
  custom_fields?: Record<string, any>;
  full_quote_shown: boolean;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Create a simple mock quote calculation function
const calculateQuote = (
  material: string,
  quantity: number,
  complexity: string
): { minAmount: number; maxAmount: number } => {
  // Base rates by material (very simplified)
  const materialRates: Record<string, number> = {
    "Aluminum": 15,
    "Steel": 10,
    "Stainless Steel": 25,
    "Titanium": 50,
    "Plastic": 5,
    "default": 20
  };

  // Complexity multipliers
  const complexityMultipliers: Record<string, number> = {
    "Low": 0.8,
    "Medium": 1.0,
    "High": 1.5,
    "default": 1.0
  };

  // Get base rate for material or use default
  const baseRate = materialRates[material] || materialRates.default;
  
  // Get complexity multiplier or use default
  const multiplier = complexityMultipliers[complexity] || complexityMultipliers.default;
  
  // Calculate base quote
  const baseQuote = baseRate * quantity * multiplier;
  
  // Add random variation for quote range (±10%)
  const minAmount = Math.round(baseQuote * 0.9);
  const maxAmount = Math.round(baseQuote * 1.1);
  
  return { minAmount, maxAmount };
};

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const data: QuoteRequest = await request.json();
    
    // Validate required fields
    if (!data.email || !data.industry || !data.material || !data.quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Calculate quote range
    const quoteRange = calculateQuote(
      data.material,
      data.quantity,
      data.complexity
    );
    
    // Average for quote amount to store
    const quoteAmount = Math.round((quoteRange.minAmount + quoteRange.maxAmount) / 2);
    
    // Prepare data for Supabase insert
    const quoteData = {
      email: data.email,
      industry: data.industry,
      material: data.material, 
      quantity: data.quantity,
      complexity: data.complexity,
      surface_finish: data.surface_finish,
      lead_time_preference: data.lead_time_preference,
      custom_fields: data.custom_fields || {},
      full_quote_shown: data.full_quote_shown,
      quote_amount: quoteAmount,
      created_at: new Date().toISOString(),
      is_contacted: false,
      notes: `Quote for ${data.industry}, ${data.material}, qty: ${data.quantity}`
    };
    
    // Insert data into Supabase
    const { error } = await supabase
      .from("quote_leads")
      .insert(quoteData);
    
    if (error) {
      console.error("Error inserting quote lead:", error);
      return NextResponse.json(
        { error: "Failed to save quote" },
        { status: 500 }
      );
    }
    
    // Return success response with quote range
    return NextResponse.json({
      success: true,
      message: "Quote submitted successfully",
      quote_range: quoteRange,
      lead_time_estimate: data.lead_time_preference === "Rush" 
        ? "5-7 business days" 
        : "10-14 business days"
    });
    
  } catch (error) {
    console.error("Error processing quote submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 