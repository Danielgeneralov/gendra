import { NextResponse } from 'next/server';
import { parseRFQ, MissingAPIKeyError } from '@/lib/groqParser';

// Hardcoded API key for Groq
const GROQ_API_KEY = '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';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    console.log("API route: Received request to parse RFQ");
    
    // Use hardcoded API key instead of environment variable
    const apiKey = GROQ_API_KEY;
    console.log("API route: Using hardcoded GROQ_API_KEY");
    
    // Parse the request body
    const body = await request.json();
    
    // Log what we received (sanitized for security)
    console.log("API route: Request body received", { 
      textProvided: !!body.text,
      textLength: body.text ? body.text.length : 0 
    });
    
    // Validate the incoming request
    if (!body.text || typeof body.text !== 'string') {
      console.log("API route: Invalid request - missing or invalid text field");
      return NextResponse.json(
        { error: 'Missing or invalid text field in request body' },
        { status: 400 }
      );
    }

    // Call the RFQ parser with the hardcoded API key
    console.log("API route: Calling parseRFQ function with hardcoded API key");
    const parsedRFQ = await parseRFQ(body.text, apiKey);
    
    // Validate the parsed result to make sure it's not returning defaults due to failure
    const isDefaultResult = 
      !parsedRFQ.material && 
      parsedRFQ.quantity === 0 && 
      parsedRFQ.dimensions.length === 0 && 
      parsedRFQ.dimensions.width === 0 && 
      parsedRFQ.dimensions.height === 0 &&
      !parsedRFQ.industry;
    
    if (isDefaultResult) {
      console.warn("API route: parseRFQ returned default values, indicating a potential failure");
      // Return a more meaningful error instead of empty defaults
      return NextResponse.json(
        { error: 'The parser failed to extract meaningful data from the provided text' },
        { status: 422 } // Unprocessable Entity
      );
    }
    
    // Success - return the parsed result
    console.log("API route: Successfully parsed RFQ", {
      hasMaterial: !!parsedRFQ.material,
      hasQuantity: parsedRFQ.quantity > 0,
      hasDimensions: parsedRFQ.dimensions.length > 0 || parsedRFQ.dimensions.width > 0 || parsedRFQ.dimensions.height > 0,
      hasIndustry: !!parsedRFQ.industry
    });
    
    return NextResponse.json(parsedRFQ);
  } catch (error) {
    // Handle specific known errors
    if (error instanceof MissingAPIKeyError) {
      console.error('API route: Missing API key error');
      return NextResponse.json(
        { error: 'API configuration error - API key issue' },
        { status: 500 }
      );
    }
    
    // Handle generic errors with improved logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('API route: Error processing request:', {
      errorName,
      errorMessage,
      // Only log the first few lines of the stack trace to avoid overwhelming logs
      errorStackPreview: errorStack ? errorStack.split('\n').slice(0, 3).join('\n') : undefined
    });
    
    return NextResponse.json(
      { error: 'Failed to parse RFQ', message: errorMessage },
      { status: 500 }
    );
  }
} 