/**
 * Fallback Quote Calculation Utility
 * 
 * This module provides a centralized implementation of the fallback quote calculation
 * that can be used when the Python backend service is unavailable.
 * 
 * @module fallbackQuote
 */

/**
 * Input parameters for the fallback quote calculation
 */
export interface FallbackQuoteInput {
  /** The industry identifier */
  industryId: string;
  /** The material type */
  material: string;
  /** The quantity of items */
  quantity: number;
  /** The complexity level (low, medium, high) */
  complexity: string;
  /** Any additional parameters */
  [key: string]: unknown;
}

/**
 * The result of a fallback quote calculation
 */
export interface FallbackQuoteResult {
  /** The total quote amount */
  quote: number;
  /** The base price before adjustments */
  basePrice: number;
  /** The material cost component */
  materialCost: number;
  /** The complexity factor (multiplier) */
  complexityFactor: number;
  /** The quantity discount (percentage as decimal) */
  quantityDiscount: number;
  /** The estimated lead time as a string */
  leadTime: string;
  /** The complexity level as a string with proper capitalization */
  complexity: string;
  /** Indicator that this was calculated by the fallback system */
  calculatedBy: "fallback";
  /** Warning message for client */
  warning?: string;
}

/**
 * Simplified fallback quote calculation
 * 
 * This implementation provides a reasonable approximation of quote pricing
 * when the backend service is unavailable. It uses basic industry-specific
 * pricing factors, material rates, and quantity discounts.
 * 
 * @param input - The calculation input parameters
 * @returns A quote result containing pricing and lead time information
 * 
 * @example
 * ```ts
 * const result = await calculateFallbackQuote({
 *   industryId: 'metal-fabrication',
 *   material: 'aluminum',
 *   quantity: 10,
 *   complexity: 'medium'
 * });
 * ```
 */
export async function calculateFallbackQuote(
  input: FallbackQuoteInput
): Promise<FallbackQuoteResult> {
  const { industryId, quantity: rawQuantity, complexity: rawComplexity, material: rawMaterial } = input;
  
  // Normalize input values
  const quantity = Number(rawQuantity) || 1;
  const complexity = (typeof rawComplexity === 'string' ? rawComplexity : 'medium').toLowerCase();
  const material = (typeof rawMaterial === 'string' ? rawMaterial : 'default').toLowerCase();
  
  // Industry-specific base pricing
  const industryBasePricing: Record<string, number> = {
    'aerospace': 1200,
    'medical': 900,
    'automotive': 500,
    'consumer-electronics': 300,
    'metal-fabrication': 450,
    'injection-molding': 350,
    'cnc-machining': 550,
    'sheet-metal': 400,
    '3d-printing': 250,
    'electronics-assembly': 600,
    'default': 400
  };
  
  // Complexity factors
  const complexityFactors: Record<string, number> = {
    'low': 0.8,
    'medium': 1.0,
    'high': 1.5,
    'default': 1.0
  };
  
  // Material rates per unit
  const materialRates: Record<string, number> = {
    'aluminum': 3.2,
    'steel': 2.5,
    'plastic': 1.8,
    'titanium': 15.0,
    'brass': 6.0,
    'copper': 7.2,
    'stainless-steel': 5.5,
    'carbon-fiber': 25.0,
    'pla': 1.5,
    'abs': 2.0,
    'default': 5.0
  };
  
  // Calculate base price from industry
  const basePrice = industryBasePricing[industryId] || industryBasePricing.default;
  
  // Get complexity factor
  const complexityFactor = complexityFactors[complexity] || complexityFactors.default;
  
  // Get material rate
  const materialRate = materialRates[material] || materialRates.default;
  
  // Calculate material cost based on quantity
  const materialCost = materialRate * quantity;
  
  // Calculate quantity discount
  const quantityDiscount = quantity >= 1000 ? 0.25 :
                           quantity >= 500 ? 0.2 :
                           quantity >= 100 ? 0.15 :
                           quantity >= 50 ? 0.1 :
                           quantity >= 10 ? 0.05 : 0;
  
  // Calculate total
  const subtotal = (basePrice + materialCost) * complexityFactor;
  const totalQuote = Math.round(subtotal * (1 - quantityDiscount));
  
  // Determine lead time
  const baseDays = complexity === 'high' ? 21 :
                  complexity === 'medium' ? 14 : 7;
  const leadTime = `${baseDays} business days`;
  
  // Format complexity for display
  const displayComplexity = complexity.charAt(0).toUpperCase() + complexity.slice(1);
  
  // Return the complete result
  return {
    quote: totalQuote,
    basePrice,
    materialCost,
    complexityFactor,
    quantityDiscount,
    leadTime,
    complexity: displayComplexity,
    calculatedBy: "fallback",
    warning: "Backend calculation service unavailable. Using fallback calculation."
  };
}

/**
 * Simple fallback quote calculation that returns only the quote amount
 * 
 * This is a simplified version of the fallback calculation for use in contexts
 * where only the final quote amount is needed (e.g., quote submission).
 * 
 * @param material - The material type
 * @param quantity - The quantity of items
 * @param complexity - The complexity level
 * @param industryId - Optional industry identifier (default: 'default')
 * @returns The calculated quote amount
 * 
 * @example
 * ```ts
 * const amount = await calculateFallbackQuoteAmount('aluminum', 10, 'medium');
 * ```
 */
export async function calculateFallbackQuoteAmount(
  material: string,
  quantity: number,
  complexity: string,
  industryId: string = 'default'
): Promise<number> {
  const result = await calculateFallbackQuote({
    industryId,
    material,
    quantity,
    complexity
  });
  
  return result.quote;
} 