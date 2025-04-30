import { NextRequest, NextResponse } from "next/server";
import type { QuoteFormData } from "../../../../types";

// Define types for our data structures
interface ComplexityLevel {
  factor: number;
  name: string;
};

type MaterialCosts = Record<string, number>;
type IndustryPricing = Record<string, number>;

// Mock data for complexity levels
const complexityLevels: Record<string, ComplexityLevel> = {
  low: { factor: 1.0, name: "Low" },
  medium: { factor: 1.5, name: "Medium" },
  high: { factor: 2.0, name: "High" }
};

// Mock material cost data
const materialCosts: MaterialCosts = {
  "steel": 2.5,
  "aluminum": 3.2,
  "plastic": 1.8,
  "titanium": 15.0,
  "brass": 6.0,
  "copper": 7.2,
  "stainless-steel": 5.5,
  "carbon-fiber": 25.0,
  "wood": 1.2,
  "glass": 4.0,
  "concrete": 0.8,
  "ceramic": 8.5,
  "rubber": 3.0,
  "default": 5.0
};

// Base pricing for different industries
const industryBasePricing: IndustryPricing = {
  "automotive": 500,
  "aerospace": 1200,
  "medical": 900,
  "consumer-electronics": 300,
  "industrial-equipment": 650,
  "construction": 400,
  "energy": 800,
  "default": 500
};

// Calculate lead time based on complexity and quantity
const calculateLeadTime = (complexity: string, quantity: number): string => {
  const baseTime = complexity === "high" ? 21 : complexity === "medium" ? 14 : 7;
  
  let multiplier = 1;
  if (quantity > 1000) multiplier = 2.5;
  else if (quantity > 500) multiplier = 2;
  else if (quantity > 100) multiplier = 1.5;
  else if (quantity > 50) multiplier = 1.2;
  
  const days = Math.ceil(baseTime * multiplier);
  
  return `${days} business days`;
};

// Calculate discount based on quantity
const calculateQuantityDiscount = (quantity: number): number => {
  if (quantity > 1000) return 0.25;
  if (quantity > 500) return 0.2;
  if (quantity > 100) return 0.15;
  if (quantity > 50) return 0.1;
  if (quantity > 10) return 0.05;
  return 0;
};

export async function POST(
  request: NextRequest,
  context: { params: { industryId: string } }
) {
  try {
    // Get industry ID from route params using proper Next.js 14 pattern
    const { industryId } = context.params;
    
    // Get form data from request body
    const formData: QuoteFormData = await request.json();
    
    // Extract relevant data (using defaults if not provided)
    const material = formData.material || "default";
    const quantity = Number(formData.quantity) || 1;
    const complexity = formData.complexity || "medium";
    const dimensions = formData.dimensions || { length: 10, width: 10, height: 10 };
    
    // Calculate size factor based on dimensions (if provided)
    let sizeFactor = 1;
    if (typeof dimensions === "object") {
      const volume = 
        (dimensions.length || 10) * 
        (dimensions.width || 10) * 
        (dimensions.height || 10);
      
      sizeFactor = Math.max(0.5, Math.min(3, Math.pow(volume / 1000, 0.3)));
    }
    
    // Get base price for industry
    const basePrice = industryBasePricing[industryId] || industryBasePricing.default;
    
    // Get material cost per unit
    const materialCostPerUnit = materialCosts[material] || materialCosts.default;
    
    // Calculate material cost
    const materialCost = materialCostPerUnit * quantity * sizeFactor;
    
    // Get complexity factor
    const complexityFactor = complexityLevels[complexity]?.factor || complexityLevels.medium.factor;
    
    // Calculate quantity discount
    const quantityDiscount = calculateQuantityDiscount(quantity);
    
    // Calculate final quote
    const subtotal = (basePrice + materialCost) * complexityFactor;
    const discount = subtotal * quantityDiscount;
    const totalQuote = Math.round(subtotal - discount);
    
    // Calculate lead time
    const leadTime = calculateLeadTime(complexity, quantity);
    
    // Apply cache headers for quote results
    const response = NextResponse.json({
      quote: totalQuote,
      basePrice: basePrice,
      materialCost: materialCost,
      complexityFactor: complexityFactor,
      quantityDiscount: quantityDiscount,
      leadTime: leadTime,
      complexity: complexityLevels[complexity]?.name || "Medium"
    });

    // Add cache-control header (valid for 1 hour)
    response.headers.set('Cache-Control', 'max-age=3600, s-maxage=3600');
    
    return response;
  } catch (error) {
    console.error("Error calculating quote:", error);
    return NextResponse.json(
      { error: "Failed to calculate quote" },
      { status: 500 }
    );
  }
} 