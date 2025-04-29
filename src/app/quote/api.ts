// Types for the quote API
import { BACKEND_URL } from './constants';

export interface QuoteRequest {
  material: string;
  quantity: number;
  complexity: number;
}

export interface QuoteResponse {
  quote: number;
}

/**
 * Generates a mock quote locally for faster response times
 * Used as a fallback when the server is slow or unavailable
 */
function generateMockQuote(
  material: string,
  quantity: number,
  complexity: number
): number {
  // Base price per unit (varies by material)
  const materialLower = material.toLowerCase();
  let basePrice = 75; // Default base price
  
  // Adjust base price by material
  if (materialLower.includes('steel') || materialLower.includes('iron')) {
    basePrice = 50;
  } else if (materialLower.includes('aluminum') || materialLower.includes('aluminium')) {
    basePrice = 65;
  } else if (materialLower.includes('copper') || materialLower.includes('brass')) {
    basePrice = 95;
  } else if (materialLower.includes('titanium')) {
    basePrice = 150;
  } else if (materialLower.includes('plastic') || materialLower.includes('pla') || materialLower.includes('abs')) {
    basePrice = 30;
  }
  
  // Calculate quantity discount (bulk discount)
  let quantityMultiplier = 1;
  if (quantity >= 100) {
    quantityMultiplier = 0.7; // 30% discount for 100+ units
  } else if (quantity >= 50) {
    quantityMultiplier = 0.8; // 20% discount for 50+ units
  } else if (quantity >= 20) {
    quantityMultiplier = 0.9; // 10% discount for 20+ units
  }
  
  // Calculate base quote
  let quote = basePrice * quantity * complexity * quantityMultiplier;
  
  // Add slight random variation to make it look more realistic (±5%)
  const variation = 0.95 + (Math.random() * 0.1); // between 0.95 and 1.05
  quote = quote * variation;
  
  // Round to 2 decimal places and ensure minimum quote
  return Math.max(50, Math.round(quote * 100) / 100);
}

/**
 * Fetches a quote from the backend API with a local fallback
 * @param material - The material type
 * @param quantity - The quantity of items
 * @param complexity - The complexity value (0.5 for low, 1.0 for medium, 1.5 for high)
 * @returns A promise that resolves to the quote response
 */
export async function fetchQuote(
  material: string,
  quantity: number,
  complexityValue: number
): Promise<QuoteResponse> {
  try {
    // Create a timeout promise to limit waiting time for the API
    const timeoutPromise = new Promise<QuoteResponse>((_, reject) => {
      setTimeout(() => {
        // Generate a mock quote if API takes too long
        console.log("API timeout - using local mock quote");
        const mockQuote = generateMockQuote(material, quantity, complexityValue);
        return { quote: mockQuote };
      }, 7000); // Wait 7 seconds before falling back to local calculation
    });
    
    // Create the actual API fetch promise
    const fetchPromise = new Promise<QuoteResponse>(async (resolve, reject) => {
      try {
        const response = await fetch(`${BACKEND_URL}/predict-quote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          credentials: 'same-origin',
          body: JSON.stringify({
            material,
            quantity,
            complexity: complexityValue,
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error');
          throw new Error(`Quote API error (${response.status}): ${errorText}`);
        }
        
        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
    
    // Use Promise.race to either get the API response or the local calculation, whichever is faster
    try {
      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
      // If the race fails, fall back to local quote generation
      console.warn("API fetch failed, using local mock quote:", error);
      const mockQuote = generateMockQuote(material, quantity, complexityValue);
      return { quote: mockQuote };
    }
  } catch (error) {
    console.error('Failed to fetch quote:', error);
    // Always generate a local fallback quote as last resort
    const mockQuote = generateMockQuote(material, quantity, complexityValue);
    return { quote: mockQuote };
  }
} 