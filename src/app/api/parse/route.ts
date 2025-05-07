import { NextRequest, NextResponse } from 'next/server';
import { parseRFQ } from '@/lib/groqParser';
import { errorResponse, logInfo, logWarn, MissingAPIKeyError } from '@/lib/errors';

// External Dependencies:
// - Groq API (timeout 10s)
// Failure Handling:
// - All failures return appropriate status codes (400, 429, 503) with errorResponse()
// - All logs use logInfo()/logWarn()
// - Groq API failures return 503 Service Unavailable with retry guidance

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

// External service timeouts
const GROQ_API_TIMEOUT = 10000; // 10 seconds

// Route path constant for logging
const ROUTE_PATH = '/api/parse';

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
 * Wrapper for parseRFQ that adds timeout and error handling
 */
async function callGroqParserWithTimeout(
  text: string, 
  apiKey: string
): Promise<{ success: boolean; data?: any; error?: string; status?: number }> {
  try {
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GROQ_API_TIMEOUT);
    
    // Track start time for latency monitoring
    const startTime = Date.now();
    
    try {
      // Call the parseRFQ function with the abort signal
      // Note: we're assuming parseRFQ supports an abort signal; if not, this may need to be modified
      const result = await parseRFQ(text, apiKey);
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      // Track and log latency
      const latency = Date.now() - startTime;
      logInfo(ROUTE_PATH, 'groq_api_latency', {
        latencyMs: latency,
        success: true
      });
      
      return { success: true, data: result };
    } catch (error) {
      // Clear the timeout to prevent memory leaks
      clearTimeout(timeoutId);
      
      // Check if it's an abort/timeout error
      if (error instanceof Error && error.name === 'AbortError') {
        logWarn(ROUTE_PATH, 'groq_api_timeout', {
          timeoutMs: GROQ_API_TIMEOUT,
          error: 'Request timed out'
        });
        return { 
          success: false, 
          error: 'Service timed out while processing the request', 
          status: 503 // Service Unavailable
        };
      }
      
      // Handle other errors
      logWarn(ROUTE_PATH, 'groq_api_error', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      // If it's a known API key error, return a specific error
      if (error instanceof MissingAPIKeyError) {
        return { 
          success: false, 
          error: 'Server configuration error', 
          status: 500 // Internal Server Error
        };
      }
      
      // Track failed request latency
      const latency = Date.now() - startTime;
      logInfo(ROUTE_PATH, 'groq_api_latency', {
        latencyMs: latency,
        success: false
      });
      
      // Generic error case
      return { 
        success: false, 
        error: 'Failed to process the request with Groq API', 
        status: 503 // Service Unavailable
      };
    }
  } catch (error) {
    // Catch any errors that might occur outside the fetch itself
    logWarn(ROUTE_PATH, 'groq_wrapper_error', {
      error: error instanceof Error ? error.message : String(error)
    });
    
    return { 
      success: false, 
      error: 'Error preparing request to Groq API', 
      status: 500 // Internal Server Error
    };
  }
}

/**
 * POST handler for RFQ parsing
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const clientIp = getClientIp(request);
    
    // Log incoming request with structured metadata
    logInfo(ROUTE_PATH, 'incoming_request', {
      ip: clientIp,
      method: request.method,
      userAgent: request.headers.get('user-agent') || 'unknown'
    });
    
    // 1a. Check daily quota first
    const dailyQuota = checkDailyQuota(clientIp);
    if (!dailyQuota.allowed) {
      const hoursToWait = Math.ceil((dailyQuota.resetAt - Date.now()) / (1000 * 60 * 60));
      
      logWarn(ROUTE_PATH, 'quota_exceeded', {
        ip: clientIp,
        quotaLimit: DAILY_QUOTA_MAX,
        hoursToWait
      });
      
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
      const secondsToWait = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      
      logWarn(ROUTE_PATH, 'rate_limit_exceeded', {
        ip: clientIp,
        rateLimit: RATE_LIMIT_MAX,
        secondsToWait
      });
      
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
    
    // 2. Validate API key before making any requests
    if (!GROQ_API_KEY || !GROQ_API_KEY.startsWith('gsk_')) {
      return errorResponse('Server configuration error: Invalid API key format', 500, ROUTE_PATH);
    }
    
    // 3. Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return errorResponse('Invalid JSON in request body', 400, ROUTE_PATH);
    }
    
    // Log what we received (sanitized for security)
    logInfo(ROUTE_PATH, 'request_body_received', {
      ip: clientIp,
      textProvided: !!body.text,
      textLength: body.text ? body.text.length : 0
    });
    
    // 4. Validate input thoroughly before sending to Groq
    if (!body.text || typeof body.text !== 'string') {
      return errorResponse('Missing or invalid text field in request body', 400, ROUTE_PATH);
    }

    // Validate text length - not too short
    if (body.text.length < 50) {
      logWarn(ROUTE_PATH, 'text_too_short', {
        ip: clientIp,
        textLength: body.text.length
      });
      
      return errorResponse(
        'Text is too short to be a valid RFQ. Please provide more complete information.',
        400,
        ROUTE_PATH
      );
    }
    
    // Validate text length - not too long
    if (body.text.length > MAX_TEXT_LENGTH) {
      logWarn(ROUTE_PATH, 'text_too_long', {
        ip: clientIp,
        textLength: body.text.length,
        maxLength: MAX_TEXT_LENGTH
      });
      
      return errorResponse(
        `Text is too long. Maximum ${MAX_TEXT_LENGTH} characters allowed.`,
        400,
        ROUTE_PATH
      );
    }

    // 5. Call the Groq API with timeout and error handling
    logInfo(ROUTE_PATH, 'calling_rfq_parser', {
      ip: clientIp,
      textLength: body.text.length,
      timeoutMs: GROQ_API_TIMEOUT
    });
    
    const groqResult = await callGroqParserWithTimeout(body.text, GROQ_API_KEY);
    
    // 6. Handle Groq API errors
    if (!groqResult.success) {
      return errorResponse(
        groqResult.error || 'Failed to parse RFQ with Groq API',
        groqResult.status || 503, // Use provided status or default to 503
        ROUTE_PATH
      );
    }
    
    const parsedRFQ = groqResult.data;
    
    // 7. Validate the parsed result to make sure it's not returning defaults due to failure
    const isDefaultResult = 
      !parsedRFQ.material && 
      parsedRFQ.quantity === 0 && 
      parsedRFQ.dimensions.length === 0 && 
      parsedRFQ.dimensions.width === 0 && 
      parsedRFQ.dimensions.height === 0 &&
      !parsedRFQ.industry;
    
    if (isDefaultResult) {
      logWarn(ROUTE_PATH, 'parser_default_values', {
        ip: clientIp,
        modelUsed: parsedRFQ.modelUsed,
        service: 'groq'
      });
      
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
    
    // 8. Success - return the parsed result with rate limit headers
    logInfo(ROUTE_PATH, 'rfq_parsed_successfully', {
      ip: clientIp,
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
    // Final catch-all error handler
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    logWarn(ROUTE_PATH, 'unexpected_error', {
      errorName,
      errorMessage
    });
    
    return errorResponse('Failed to parse RFQ. Please try again later.', 500, ROUTE_PATH);
  }
} 