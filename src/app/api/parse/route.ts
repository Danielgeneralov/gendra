import { NextResponse } from 'next/server';
import { parseRFQ, MissingAPIKeyError } from '@/lib/groqParser';

// Hardcoded API key for Groq - consider moving this to an environment variable
// This is a sample key format, replace with your actual key
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    console.log("API route: Received request to parse RFQ");
    
    // Check API key validity (at least format-wise)
    if (!GROQ_API_KEY || !GROQ_API_KEY.startsWith('gsk_')) {
      console.error("API route: Invalid API key format");
      return NextResponse.json(
        { error: 'Invalid API key format' },
        { status: 500 }
      );
    }
    
    console.log("API route: Using configured GROQ_API_KEY");
    
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

    if (body.text.length < 50) {
      console.warn("API route: Text is too short, might not contain enough information", body.text);
      return NextResponse.json(
        { error: 'Text is too short to be a valid RFQ. Please provide more complete information.' },
        { status: 400 }
      );
    }

    // Call the RFQ parser with the configured API key
    console.log("API route: Calling parseRFQ function with provided API key");
    console.log("API route: First 100 chars of text:", body.text.substring(0, 100) + "...");
    
    const parsedRFQ = await parseRFQ(body.text, GROQ_API_KEY);
    
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
      console.warn("API route: Model used:", parsedRFQ.modelUsed);
      
      // Return a more meaningful error instead of empty defaults
      return NextResponse.json(
        { 
          error: 'The parser failed to extract meaningful data from the provided text',
          details: 'Please check if the text contains the required RFQ information in a readable format',
          modelUsed: parsedRFQ.modelUsed
        },
        { status: 422 } // Unprocessable Entity
      );
    }
    
    // Success - return the parsed result
    console.log("API route: Successfully parsed RFQ", {
      hasMaterial: !!parsedRFQ.material,
      hasQuantity: parsedRFQ.quantity > 0,
      hasDimensions: parsedRFQ.dimensions.length > 0 || parsedRFQ.dimensions.width > 0 || parsedRFQ.dimensions.height > 0,
      hasIndustry: !!parsedRFQ.industry,
      modelUsed: parsedRFQ.modelUsed
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