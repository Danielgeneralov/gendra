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
 * Fetches a quote from the backend API
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
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch quote:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Failed to fetch quote from API');
  }
} 