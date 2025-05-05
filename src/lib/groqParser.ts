/**
 * groqParser.ts
 * Utility for parsing manufacturing RFQs using Groq's API
 */

/**
 * Represents the structured data extracted from an RFQ text
 */
export type ParsedRFQ = {
  material: string;
  quantity: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  complexity: 'low' | 'medium' | 'high';
  deadline: string; // ISO date string
  industry: string; // The manufacturing industry category
};

/**
 * Default values for a ParsedRFQ when extraction fails
 */
const DEFAULT_RFQ: ParsedRFQ = {
  material: '',
  quantity: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  complexity: 'low',
  deadline: '',
  industry: '',
};

/**
 * Error thrown when the GROQ_API_KEY is missing
 */
export class MissingAPIKeyError extends Error {
  constructor() {
    super('GROQ_API_KEY is missing in environment variables');
    this.name = 'MissingAPIKeyError';
  }
}

/**
 * Parses raw text into structured RFQ data using Groq's API
 *
 * @param input - The raw text containing RFQ information
 * @param overrideApiKey - Optional API key to use instead of environment variable
 * @returns A promise that resolves to the parsed RFQ data
 * @throws {MissingAPIKeyError} If the GROQ_API_KEY is missing
 */
export async function parseRFQ(input: string, overrideApiKey?: string): Promise<ParsedRFQ> {
  // Check if the API key is available
  const apiKey = overrideApiKey || process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new MissingAPIKeyError();
  }

  // Instructions for the model - now part of the user message
  const instructionsPrefix = `
    I need you to extract manufacturing RFQ (Request for Quote) information from the text I'll provide.
    Extract the following fields:
    - material (string): The material needed for manufacturing
    - quantity (number): The number of units requested
    - dimensions (object): An object with length, width, and height in inches
    - complexity (string): The manufacturing complexity level (low, medium, or high)
    - deadline (string): The deadline date in ISO format (YYYY-MM-DD)
    - industry (string): The manufacturing industry category (e.g., metal fabrication, injection molding, cnc machining, sheet metal, electronics assembly)
    
    Respond with ONLY a valid JSON object containing these fields and no other text.
    
    Here is the RFQ text to analyze:
  `;

  try {
    // Set up the request to Groq API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

    console.log("Sending request to Groq API...");
    
    // Try with a model that's known to work with Groq's reasoning capabilities
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // Using a model explicitly mentioned in the docs as supported
        model: 'llama3-8b-8192', // Fallback to previous model if needed
        messages: [
          // Per docs: avoid system prompts - include all instructions in user message
          { 
            role: 'user', 
            content: `${instructionsPrefix}\n\n${input}` 
          }
        ],
        temperature: 0.6, // Recommended in the docs (0.5-0.7)
        max_completion_tokens: 1024,
        top_p: 0.95, // Recommended in the docs
        // Add response_format for JSON to ensure proper formatting
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Add more detailed error logging
    if (!response.ok) {
      console.error('Groq API error status:', response.status);
      console.error('Groq API error statusText:', response.statusText);
      
      try {
        const errorData = await response.json();
        console.error('Groq API error details:', JSON.stringify(errorData, null, 2));
        
        // If there's a specific error about the model, try the alternative model
        if (errorData?.error?.code === 'model_not_found' && response.status === 404) {
          console.log('Attempting with alternative model...');
          return attemptWithAlternativeModel(input, apiKey, instructionsPrefix, controller);
        }
      } catch (jsonError) {
        console.error('Groq API error (could not parse JSON response):', await response.text().catch(() => 'No text response'));
      }
      
      return { ...DEFAULT_RFQ };
    }

    const data = await response.json();
    
    // Extract the content from the response
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('Invalid response from Groq API:', data);
      return { ...DEFAULT_RFQ };
    }

    // Temporary logging for development/debugging
    try {
      console.log("Groq raw output:", content);
    } catch (logError) {
      console.error("Error logging Groq output:", logError);
      // Continue with parsing even if logging fails
    }

    // Try to parse the JSON response
    try {
      // Extract JSON from the content (in case model returns extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      
      const parsedData = JSON.parse(jsonString);
      
      // Validate and normalize the parsed data
      const result: ParsedRFQ = {
        material: typeof parsedData.material === 'string' ? parsedData.material : DEFAULT_RFQ.material,
        quantity: typeof parsedData.quantity === 'number' ? parsedData.quantity : 
                 (parseInt(parsedData.quantity) || DEFAULT_RFQ.quantity),
        dimensions: {
          length: typeof parsedData.dimensions?.length === 'number' ? parsedData.dimensions.length : 
                 (parseFloat(parsedData.dimensions?.length) || DEFAULT_RFQ.dimensions.length),
          width: typeof parsedData.dimensions?.width === 'number' ? parsedData.dimensions.width : 
                (parseFloat(parsedData.dimensions?.width) || DEFAULT_RFQ.dimensions.width),
          height: typeof parsedData.dimensions?.height === 'number' ? parsedData.dimensions.height : 
                 (parseFloat(parsedData.dimensions?.height) || DEFAULT_RFQ.dimensions.height),
        },
        complexity: ['low', 'medium', 'high'].includes(parsedData.complexity?.toLowerCase?.()) 
                   ? parsedData.complexity.toLowerCase() as 'low' | 'medium' | 'high' 
                   : DEFAULT_RFQ.complexity,
        deadline: typeof parsedData.deadline === 'string' && /^\d{4}-\d{2}-\d{2}/.test(parsedData.deadline) 
                 ? parsedData.deadline 
                 : DEFAULT_RFQ.deadline,
        industry: typeof parsedData.industry === 'string' ? parsedData.industry.toLowerCase() : DEFAULT_RFQ.industry,
      };
      
      return result;
    } catch (error) {
      console.error('Failed to parse Groq API response:', error);
      return { ...DEFAULT_RFQ };
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request to Groq API timed out');
    } else {
      console.error('Error calling Groq API:', error);
    }
    return { ...DEFAULT_RFQ };
  }
}

/**
 * Fallback function that attempts to use an alternative model if the first one fails
 */
async function attemptWithAlternativeModel(
  input: string, 
  apiKey: string, 
  instructionsPrefix: string,
  controller: AbortController
): Promise<ParsedRFQ> {
  try {
    // Try with a different model from the docs
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-r1-distill-llama-70b', // Try with one of the models mentioned in the docs
        messages: [
          { 
            role: 'user', 
            content: `${instructionsPrefix}\n\n${input}` 
          }
        ],
        temperature: 0.6,
        max_completion_tokens: 1024,
        top_p: 0.95,
        response_format: { type: "json_object" },
        reasoning_format: "parsed" // Using reasoning format as suggested in docs
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error('Alternative model also failed:', response.status, response.statusText);
      return { ...DEFAULT_RFQ };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('Invalid response from alternative model:', data);
      return { ...DEFAULT_RFQ };
    }

    console.log("Alternative model raw output:", content);

    // Parse and process the response as before
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    
    try {
      const parsedData = JSON.parse(jsonString);
      
      const result: ParsedRFQ = {
        material: typeof parsedData.material === 'string' ? parsedData.material : DEFAULT_RFQ.material,
        quantity: typeof parsedData.quantity === 'number' ? parsedData.quantity : 
                 (parseInt(parsedData.quantity) || DEFAULT_RFQ.quantity),
        dimensions: {
          length: typeof parsedData.dimensions?.length === 'number' ? parsedData.dimensions.length : 
                 (parseFloat(parsedData.dimensions?.length) || DEFAULT_RFQ.dimensions.length),
          width: typeof parsedData.dimensions?.width === 'number' ? parsedData.dimensions.width : 
                (parseFloat(parsedData.dimensions?.width) || DEFAULT_RFQ.dimensions.width),
          height: typeof parsedData.dimensions?.height === 'number' ? parsedData.dimensions.height : 
                 (parseFloat(parsedData.dimensions?.height) || DEFAULT_RFQ.dimensions.height),
        },
        complexity: ['low', 'medium', 'high'].includes(parsedData.complexity?.toLowerCase?.()) 
                   ? parsedData.complexity.toLowerCase() as 'low' | 'medium' | 'high' 
                   : DEFAULT_RFQ.complexity,
        deadline: typeof parsedData.deadline === 'string' && /^\d{4}-\d{2}-\d{2}/.test(parsedData.deadline) 
                 ? parsedData.deadline 
                 : DEFAULT_RFQ.deadline,
        industry: typeof parsedData.industry === 'string' ? parsedData.industry.toLowerCase() : DEFAULT_RFQ.industry,
      };
      
      return result;
    } catch (error) {
      console.error('Failed to parse alternative model response:', error);
      return { ...DEFAULT_RFQ };
    }
  } catch (error) {
    console.error('Error with alternative model:', error);
    return { ...DEFAULT_RFQ };
  }
} 