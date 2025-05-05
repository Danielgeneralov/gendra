import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Quote calculator
const calculateQuote = (
  material: string,
  quantity: number,
  complexity: string
): { minAmount: number; maxAmount: number } => {
  const materialRates: Record<string, number> = {
    Aluminum: 15,
    Steel: 10,
    "Stainless Steel": 25,
    Titanium: 50,
    Plastic: 5,
    default: 20
  };

  const complexityMultipliers: Record<string, number> = {
    Low: 0.8,
    Medium: 1.0,
    High: 1.5,
    default: 1.0
  };

  const baseRate = materialRates[material] ?? materialRates.default;
  const multiplier = complexityMultipliers[complexity] ?? complexityMultipliers.default;
  const baseQuote = baseRate * quantity * multiplier;

  return {
    minAmount: Math.round(baseQuote * 0.9),
    maxAmount: Math.round(baseQuote * 1.1)
  };
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase environment variables are missing.");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const data: QuoteRequest = await request.json();

    const { email, industry, material, quantity } = data;
    if (!email || !industry || !material || !quantity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const quoteRange = calculateQuote(material, quantity, data.complexity);
    const quoteAmount = Math.round((quoteRange.minAmount + quoteRange.maxAmount) / 2);

    const quoteData = {
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
      created_at: new Date().toISOString(),
      is_contacted: false,
      notes: `Quote for ${industry}, ${material}, qty: ${quantity}`
    };

    const { error } = await supabase.from("quote_leads").insert(quoteData);

    if (error) {
      console.error("Error inserting quote lead:", error);
      return NextResponse.json({ error: "Failed to save quote" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Quote submitted successfully",
      quote_range: quoteRange,
      lead_time_estimate:
        data.lead_time_preference === "Rush"
          ? "5–7 business days"
          : "10–14 business days"
    });
  } catch (_error) {
    console.error("Error processing quote submission:", _error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
