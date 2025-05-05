import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Define proper param context type for route handlers
type RouteContext = {
  params: {
    industryId: string;
  };
};

// -- config objects omitted for brevity, keep as-is --
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

const calculateLeadTime = (complexity: string, quantity: number): string => {
  const baseTime =
    complexity === "high" ? 21 : complexity === "medium" ? 14 : 7;

  let multiplier = 1;
  if (quantity > 1000) multiplier = 2.5;
  else if (quantity > 500) multiplier = 2;
  else if (quantity > 100) multiplier = 1.5;
  else if (quantity > 50) multiplier = 1.2;

  const days = Math.ceil(baseTime * multiplier);
  return `${days} business days`;
};

const calculateQuantityDiscount = (quantity: number): number => {
  if (quantity > 1000) return 0.25;
  if (quantity > 500) return 0.2;
  if (quantity > 100) return 0.15;
  if (quantity > 50) return 0.1;
  if (quantity > 10) return 0.05;
  return 0;
};

interface QuoteFormData {
  material?: string;
  quantity?: number | string;
  complexity?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  [key: string]: unknown;
}

export async function POST(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { industryId } = context.params;

    const formData: QuoteFormData = await request.json();

    const material = (formData.material as string)?.toLowerCase() || "default";
    const quantity = Number(formData.quantity) || 1;
    const complexity =
      (formData.complexity as string)?.toLowerCase() || "medium";

    const dimensions = formData.dimensions || {};
    const length = Number(dimensions.length) || 10;
    const width = Number(dimensions.width) || 10;
    const height = Number(dimensions.height) || 10;

    const volume = length * width * height;
    const sizeFactor = Math.max(0.5, Math.min(3, Math.pow(volume / 1000, 0.3)));

    const basePrice =
      industryBasePricing[industryId] || industryBasePricing.default;

    const materialCostPerUnit =
      materialCosts[material] || materialCosts.default;
    const materialCost = materialCostPerUnit * quantity * sizeFactor;

    const complexityFactor =
      complexityLevels[complexity]?.factor || complexityLevels.medium.factor;

    const quantityDiscount = calculateQuantityDiscount(quantity);

    const subtotal = (basePrice + materialCost) * complexityFactor;
    const discount = subtotal * quantityDiscount;
    const totalQuote = Math.round(subtotal - discount);

    const leadTime = calculateLeadTime(complexity, quantity);

    return NextResponse.json({
      quote: totalQuote,
      basePrice,
      materialCost,
      complexityFactor,
      quantityDiscount,
      leadTime,
      complexity: complexityLevels[complexity]?.name || "Medium",
    });
  } catch (_error) {
    console.error("Error calculating quote:", _error);
    return NextResponse.json(
      { error: "Failed to calculate quote" },
      { status: 500 }
    );
  }
}
