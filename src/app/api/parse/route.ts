import { NextRequest, NextResponse } from 'next/server';
import { parseRFQ, MissingAPIKeyError } from '@/lib/groqParser';

// Hardcoded API key for Groq - consider moving this to an environment variable
// This is a sample key format, replace with your actual key
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const RATE_LIMIT_MAX = 3; // 3 requests per minute
const MAX_TEXT_LENGTH = 5000; // Maximum characters allowed in the request text

// Daily quota configuration
const DAILY_QUOTA_MAX = 10; // 10 requests per day
const DAILY_QUOTA_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// In-memory rate limiting store
// In production, consider using Redis or a database for distributed deployments
type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type DailyQuotaEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
const dailyQuotaStore = new Map<string, DailyQuotaEntry>();

/**
 * Clean up expired rate limit entries (run this periodically)
 */
function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
  
  // Also clean up expired daily quota entries
  for (const [key, entry] of dailyQuotaStore.entries()) {
    if (entry.resetAt < now) {
      dailyQuotaStore.delete(key);
    }
  }
}

/**
 * Extract the client IP address from the request
 * @param request - The Next.js request object
 * @returns The client IP address or fallback string
 */
function getClientIp(request: NextRequest): string {
  // Extract IP from headers (standard approach for Next.js)
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0] || '';
  const realIp = request.headers.get('x-real-ip');
  
  // Return the first available IP or a fallback
  return forwardedFor || realIp || 'unknown-ip';
}

/**
 * Check if a request has exceeded rate limits
 * @param ipAddress - The client's IP address
 * @returns Object containing whether the request is allowed and rate limit info
 */
function checkRateLimit(ipAddress: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  
  // Clean up expired entries occasionally
  if (Math.random() < 0.1) {
    cleanupRateLimitStore();
  }
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(ipAddress);
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + RATE_LIMIT_WINDOW
    };
  }
  
  // Increment count and update the store
  entry.count += 1;
  rateLimitStore.set(ipAddress, entry);
  
  // Check if the rate limit is exceeded
  const remaining = Math.max(0, RATE_LIMIT_MAX - entry.count);
  const allowed = entry.count <= RATE_LIMIT_MAX;
  
  return { allowed, remaining, resetAt: entry.resetAt };
}

/**
 * Check if a request has exceeded daily quota
 * @param ipAddress - The client's IP address
 * @returns Object containing whether the request is allowed and quota info
 */
function checkDailyQuota(ipAddress: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  
  // Get or create daily quota entry
  // Set the reset time to the next day boundary at midnight UTC
  const todayEnd = new Date();
  todayEnd.setUTCHours(23, 59, 59, 999);
  
  let entry = dailyQuotaStore.get(ipAddress);
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: todayEnd.getTime()
    };
  }
  
  // Increment count and update the store
  entry.count += 1;
  dailyQuotaStore.set(ipAddress, entry);
  
  // Check if the daily quota is exceeded
  const remaining = Math.max(0, DAILY_QUOTA_MAX - entry.count);
  const allowed = entry.count <= DAILY_QUOTA_MAX;
  
  return { allowed, remaining, resetAt: entry.resetAt };
}

/**
 * Helper function to create consistent error responses
 */
function createErrorResponse(statusCode: number, message: string, details?: Record<string, unknown>): NextResponse {
  return NextResponse.json(
    { 
      error: message,
      ...(details || {})
    },
    { 
      status: statusCode,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

/**
 * POST handler for RFQ parsing
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log("API route: Received request to parse RFQ");
    
    // 1. Get client IP and apply rate limiting
    const clientIp = getClientIp(request);
    
    // 1a. Check daily quota first
    const dailyQuota = checkDailyQuota(clientIp);
    if (!dailyQuota.allowed) {
      console.warn("API route: Daily quota exceeded", { clientIp });
      // Calculate time until quota resets in hours and minutes
      const hoursToWait = Math.ceil((dailyQuota.resetAt - Date.now()) / (1000 * 60 * 60));
      return NextResponse.json(
        { error: `Daily quota of ${DAILY_QUOTA_MAX} requests exceeded. Try again in ${hoursToWait} hours.` },
        { 
          status: 429, 
          headers: {
            'X-Daily-Quota-Limit': String(DAILY_QUOTA_MAX),
            'X-Daily-Quota-Remaining': '0',
            'X-Daily-Quota-Reset': new Date(dailyQuota.resetAt).toISOString(),
            'Retry-After': String(Math.ceil((dailyQuota.resetAt - Date.now()) / 1000))
          }
        }
      );
    }
    
    // 1b. Check per-minute rate limit
    const rateLimit = checkRateLimit(clientIp);
    
    // Set rate limit headers regardless of whether the request is allowed
    const headers = {
      'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
      'X-RateLimit-Remaining': String(rateLimit.remaining),
      'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
      'X-Daily-Quota-Limit': String(DAILY_QUOTA_MAX),
      'X-Daily-Quota-Remaining': String(dailyQuota.remaining),
      'X-Daily-Quota-Reset': new Date(dailyQuota.resetAt).toISOString()
    };
    
    // Reject if rate limit exceeded
    if (!rateLimit.allowed) {
      console.warn("API route: Rate limit exceeded", { clientIp });
      const secondsToWait = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${secondsToWait} seconds.` },
        { 
          status: 429, 
          headers: {
            ...headers,
            'Retry-After': String(secondsToWait)
          }
        }
      );
    }
    
    // Check API key validity (at least format-wise)
    if (!GROQ_API_KEY || !GROQ_API_KEY.startsWith('gsk_')) {
      console.error("API route: Invalid API key format");
      return createErrorResponse(500, 'Server configuration error');
    }
    
    // 2. Parse the request body and validate input
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("API route: Invalid JSON in request body");
      return createErrorResponse(400, 'Invalid JSON in request body');
    }
    
    // Log what we received (sanitized for security)
    console.log("API route: Request body received", { 
      textProvided: !!body.text,
      textLength: body.text ? body.text.length : 0 
    });
    
    // Validate the incoming request - text field exists
    if (!body.text || typeof body.text !== 'string') {
      console.log("API route: Invalid request - missing or invalid text field");
      return createErrorResponse(400, 'Missing or invalid text field in request body');
    }

    // Validate text length - not too short
    if (body.text.length < 50) {
      console.warn("API route: Text is too short, might not contain enough information");
      return createErrorResponse(
        400, 
        'Text is too short to be a valid RFQ. Please provide more complete information.'
      );
    }
    
    // Validate text length - not too long
    if (body.text.length > MAX_TEXT_LENGTH) {
      console.warn("API route: Text is too long", { textLength: body.text.length });
      return createErrorResponse(
        400,
        `Text is too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.`
      );
    }

    // 3. Call the RFQ parser with the configured API key
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
        { 
          status: 422, // Unprocessable Entity
          headers
        }
      );
    }
    
    // 4. Success - return the parsed result with rate limit headers
    console.log("API route: Successfully parsed RFQ", {
      hasMaterial: !!parsedRFQ.material,
      hasQuantity: parsedRFQ.quantity > 0,
      hasDimensions: parsedRFQ.dimensions.length > 0 || parsedRFQ.dimensions.width > 0 || parsedRFQ.dimensions.height > 0,
      hasIndustry: !!parsedRFQ.industry,
      modelUsed: parsedRFQ.modelUsed
    });
    
    return NextResponse.json(
      parsedRFQ,
      { headers }
    );
  } catch (error) {
    // Handle specific known errors
    if (error instanceof MissingAPIKeyError) {
      console.error('API route: Missing API key error');
      return createErrorResponse(500, 'Server configuration error');
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
    
    // Return a sanitized error response without internal details
    return createErrorResponse(500, 'Failed to parse RFQ. Please try again later.');
  }
} 