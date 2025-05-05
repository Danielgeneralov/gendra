import { NextRequest, NextResponse } from "next/server";
import { calculateFallbackQuoteAmount } from "@/lib/fallbackQuote";
import { submitQuoteToDB, QuoteData } from "@/lib/db/submitQuote";
import { errorResponse, logInfo, logWarn } from "@/lib/errors";

// External Dependencies:
// - Python Backend (timeout 5s)
// - Supabase (timeout via submitQuoteToDB)
// Failure Handling:
// - All failures return appropriate status codes (400, 503) with errorResponse()
// - All logs use logInfo()/logWarn()
// - Python backend failures fall back to local calculation
// - Supabase failures return 503 Service Unavailable

// Force dynamic to ensure latest data
export const dynamic = 'force-dynamic';

// Route path constant for logging
const ROUTE_PATH = '/api/v1/submit-quote';

// External service timeouts
const PYTHON_BACKEND_TIMEOUT = 5000; // 5 seconds

// Python backend URL
const PYTHON_BACKEND_URL = 'http://localhost:8000/calculate-quote';

// Quote request schema
interface QuoteRequest {
  email: string;
  industry: string;
  material: string;
  quantity: number;
  complexity: string;
  surface_finish: string;
  lead_time_preference: string;
  custom_fields?: Record<string, unknown>;
  full_quote_shown: boolean;
}

/**
 * Convert a quote amount to a range format for frontend display
 */
const convertToRangeFormat = (quote: number): { minAmount: number; maxAmount: number } => {
  return {
    minAmount: Math.round(quote * 0.9),
    maxAmount: Math.round(quote * 1.1)
  };
};

/**
 * Call the Python backend with timeout and error handling
 */
async function callPythonBackendWithTimeout(
  calculationData: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), PYTHON_BACKEND_TIMEOUT);
    
    // Track start time for latency monitoring
    const startTime = Date.now();
    
    try {
      // Make the request to the Python backend
      const response = await fetch(PYTHON_BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(calculationData),
        signal: controller.signal
      });
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      // Track and log latency
      const latency = Date.now() - startTime;
      logInfo(ROUTE_PATH, 'python_backend_latency', {
        latencyMs: latency,
        status: response.status,
        success: response.ok
      });
      
      // Handle non-200 responses
      if (!response.ok) {
        let errorDetail;
        try {
          // Try to get error details from the response
          const errorBody = await response.text();
          errorDetail = errorBody;
        } catch (parseError) {
          errorDetail = 'Could not parse error response';
        }
        
        logWarn(ROUTE_PATH, 'python_backend_error_response', {
          status: response.status,
          statusText: response.statusText,
          errorDetail
        });
        
        return {
          success: false,
          error: `Backend service error: ${response.status} ${response.statusText}`
        };
      }
      
      // Parse the JSON response
      try {
        const result = await response.json();
        return { success: true, data: result };
      } catch (jsonError) {
        logWarn(ROUTE_PATH, 'python_backend_invalid_json', {
          error: jsonError instanceof Error ? jsonError.message : String(jsonError)
        });
        
        return {
          success: false,
          error: 'Backend returned invalid JSON response'
        };
      }
    } catch (error) {
      // Clear the timeout to prevent memory leaks
      clearTimeout(timeoutId);
      
      // Check if it's an abort/timeout error
      if (error instanceof Error && error.name === 'AbortError') {
        logWarn(ROUTE_PATH, 'python_backend_timeout', {
          timeoutMs: PYTHON_BACKEND_TIMEOUT,
          error: 'Request timed out'
        });
        
        return {
          success: false,
          error: 'Backend service timed out'
        };
      }
      
      // Handle other errors (network issues, etc.)
      logWarn(ROUTE_PATH, 'python_backend_request_error', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: 'Failed to connect to backend service'
      };
    }
  } catch (error) {
    // Catch any errors that might occur outside the fetch itself
    logWarn(ROUTE_PATH, 'python_backend_wrapper_error', {
      error: error instanceof Error ? error.message : String(error)
    });
    
    return {
      success: false,
      error: 'Error preparing request to backend service'
    };
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown-ip';
    
    // Log incoming request with structured metadata
    logInfo(ROUTE_PATH, 'incoming_request', {
      ip: clientIp,
      method: request.method,
      userAgent: request.headers.get('user-agent') || 'unknown'
    });
    
    // 1. Parse and validate request body
    let data: QuoteRequest;
    try {
      data = await request.json();
    } catch (error) {
      return errorResponse("Invalid JSON in request body", 400, {
        route: ROUTE_PATH,
        ip: clientIp,
        error: 'Request body is not valid JSON'
      });
    }

    // 2. Validate required fields
    const { email, industry, material, quantity, complexity, surface_finish, lead_time_preference } = data;
    if (!email || !industry || !material || !quantity) {
      return errorResponse("Missing required fields", 400, {
        route: ROUTE_PATH,
        ip: clientIp,
        providedFields: Object.keys(data),
        requiredFields: ['email', 'industry', 'material', 'quantity']
      });
    }
    
    // 3. Validate field formats
    if (!email.includes('@') || email.length < 5) {
      return errorResponse("Invalid email format", 400, {
        route: ROUTE_PATH,
        ip: clientIp,
        field: 'email'
      });
    }
    
    if (typeof quantity !== 'number' || quantity <= 0) {
      return errorResponse("Quantity must be a positive number", 400, {
        route: ROUTE_PATH,
        ip: clientIp,
        field: 'quantity',
        providedValue: quantity
      });
    }
    
    // 4. Log sanitized request data
    logInfo(ROUTE_PATH, 'processing_quote_submission', {
      ip: clientIp,
      industry,
      emailDomain: email.split('@')[1],
      hasComplexity: !!complexity
    });

    // 5. Try to calculate quote using Python backend
    let quoteAmount = 0;
    let calculatedBy = "fallback";
    
    logInfo(ROUTE_PATH, 'calling_backend_service', {
      ip: clientIp,
      industry,
      timeoutMs: PYTHON_BACKEND_TIMEOUT
    });
    
    const backendResult = await callPythonBackendWithTimeout({
      industryId: industry,
      material,
      quantity,
      complexity: complexity
    });
    
    // 6. Handle backend result or fall back to local calculation
    if (backendResult.success && backendResult.data) {
      quoteAmount = backendResult.data.quote;
      calculatedBy = "backend";
      
      logInfo(ROUTE_PATH, 'quote_calculated_by_backend', {
        ip: clientIp,
        industry,
        status: 'success'
      });
    } else {
      // Log the backend error
      logWarn(ROUTE_PATH, 'backend_calculation_failed', {
        ip: clientIp,
        industry,
        error: backendResult.error || 'Unknown backend error',
        fallback: true
      });
      
      // Use the centralized fallback calculation utility
      try {
        quoteAmount = await calculateFallbackQuoteAmount(
          material,
          quantity,
          complexity,
          industry
        );
        
        logInfo(ROUTE_PATH, 'quote_calculated_by_fallback', {
          ip: clientIp,
          industry,
          status: 'success'
        });
      } catch (fallbackError) {
        return errorResponse(
          "Failed to calculate quote. Our systems are experiencing issues.",
          500,
          {
            route: ROUTE_PATH,
            ip: clientIp,
            service: 'fallback-calculation',
            error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
          }
        );
      }
    }
    
    // 7. Create data to be stored in Supabase
    const quoteData: QuoteData = {
      email,
      industry,
      material,
      quantity,
      complexity: complexity,
      surface_finish: surface_finish,
      lead_time_preference: lead_time_preference,
      custom_fields: data.custom_fields ?? {},
      full_quote_shown: data.full_quote_shown,
      quote_amount: quoteAmount,
      calculation_method: calculatedBy,
      notes: `Quote for ${industry}, ${material}, qty: ${quantity}`
    };

    // 8. Submit the quote to the database with error handling
    logInfo(ROUTE_PATH, 'submitting_to_database', {
      ip: clientIp,
      industry,
      calculationMethod: calculatedBy
    });
    
    const dbResult = await submitQuoteToDB(quoteData);
    
    // 9. Handle database errors
    if (!dbResult.success) {
      // Safely extract error details
      const errorMessage = dbResult.error?.message || 'Unknown database error';
      const errorDetails = dbResult.error?.details as { code?: string } | undefined;
      const errorCode = errorDetails?.code;
      
      logWarn(ROUTE_PATH, 'database_operation_failed', {
        ip: clientIp,
        industry,
        error: errorMessage,
        code: errorCode
      });
      
      return errorResponse(
        "Failed to save quote. Our database service is experiencing issues.",
        503,
        {
          route: ROUTE_PATH,
          ip: clientIp,
          service: 'supabase',
          errorCode: errorCode
        }
      );
    }

    // 10. All operations successful - return the result
    logInfo(ROUTE_PATH, 'quote_submitted_successfully', {
      ip: clientIp,
      industry,
      calculationMethod: calculatedBy
    });
    
    // Calculate the quote range for the response
    const quoteRange = convertToRangeFormat(quoteAmount);
    
    // Return success response with the quote range and lead time
    return NextResponse.json({
      success: true,
      message: "Quote submitted successfully",
      quote_range: quoteRange,
      lead_time_estimate:
        lead_time_preference === "Rush"
          ? "5–7 business days"
          : "10–14 business days",
      calculation_method: calculatedBy
    });
  } catch (error) {
    // Final catch-all error handler
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    
    logWarn(ROUTE_PATH, 'unexpected_error', {
      errorName,
      errorMessage
    });
    
    return errorResponse("Failed to process quote submission. Please try again later.", 500, {
      route: ROUTE_PATH,
      errorName,
      errorMessage
    });
  }
}
