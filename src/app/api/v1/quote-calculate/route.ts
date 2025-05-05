import { NextRequest, NextResponse } from 'next/server';
import { calculateFallbackQuote } from '@/lib/fallbackQuote';
import { errorResponse, logInfo, logWarn } from '@/lib/errors';

// External Dependencies:
// - Python Backend (timeout 5s)
// Failure Handling:
// - All failures return appropriate status codes (400, 503) with errorResponse()
// - All logs use logInfo()/logWarn()
// - Python backend failures fall back to local calculation
// - Network errors return 503 Service Unavailable

// Force dynamic to help with route handlers
export const dynamic = 'force-dynamic';

// Route path constant for logging
const ROUTE_PATH = '/api/v1/quote-calculate';

// External service timeouts
const PYTHON_BACKEND_TIMEOUT = 5000; // 5 seconds

// Python backend URL
const PYTHON_BACKEND_URL = 'http://localhost:8000/calculate-quote';

/**
 * Load industry-specific configuration file if available
 * This is used to enrich the request with industry-specific configurations
 */
async function loadIndustryConfig(industryId: string) {
  try {
    const configModule = await import(`@/app/models/industries/${industryId}.json`);
    return configModule.default || configModule;
  } catch (error) {
    logWarn(ROUTE_PATH, 'industry_config_load_failed', {
      industryId,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
    return null;
  }
}

/**
 * Call the Python backend with timeout and error handling
 */
async function callPythonBackendWithTimeout(
  calculationData: Record<string, any>
): Promise<{ success: boolean; data?: any; error?: string; status?: number }> {
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
          error: `Backend service error: ${response.status} ${response.statusText}`,
          status: 503 // Service Unavailable
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
          error: 'Backend returned invalid JSON response',
          status: 503
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
          error: 'Backend service timed out',
          status: 503
        };
      }
      
      // Handle other errors (network issues, etc.)
      logWarn(ROUTE_PATH, 'python_backend_request_error', {
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        success: false,
        error: 'Failed to connect to backend service',
        status: 503
      };
    }
  } catch (error) {
    // Catch any errors that might occur outside the fetch itself
    logWarn(ROUTE_PATH, 'python_backend_wrapper_error', {
      error: error instanceof Error ? error.message : String(error)
    });
    
    return {
      success: false,
      error: 'Error preparing request to backend service',
      status: 500
    };
  }
}

/**
 * POST handler for quote calculations
 * Forwards the calculation request to the Python backend service
 * Falls back to simple calculation if the backend is unavailable
 */
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
    
    // 1. Validate required parameters
    const industryId = request.nextUrl.searchParams.get('industryId');
    
    if (!industryId) {
      return errorResponse("Missing required 'industryId' parameter", 400, {
        route: ROUTE_PATH,
        ip: clientIp
      });
    }
    
    // 2. Parse and validate request body
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      return errorResponse("Invalid JSON in request body", 400, {
        route: ROUTE_PATH,
        ip: clientIp,
        error: 'Request body is not valid JSON'
      });
    }
    
    // 3. Validate required fields in request data
    if (!requestData.material || 
        !requestData.quantity || 
        typeof requestData.quantity !== 'number' || 
        !requestData.complexity) {
      return errorResponse("Missing required fields in request body", 400, {
        route: ROUTE_PATH,
        ip: clientIp,
        providedFields: Object.keys(requestData),
        requiredFields: ['material', 'quantity', 'complexity']
      });
    }
    
    // Log the request data (sanitized)
    logInfo(ROUTE_PATH, 'processing_quote', {
      ip: clientIp,
      industryId,
      hasMaterial: !!requestData.material,
      hasQuantity: !!requestData.quantity,
      hasComplexity: !!requestData.complexity
    });
    
    // 4. Try to load industry-specific configuration
    const config = await loadIndustryConfig(industryId);

    // 5. Prepare data for backend calculation
    const calculationData = {
      industryId,
      ...requestData,
      // Add any industry-specific config data that might be useful
      industryConfig: config ? {
        basePrice: config.basePriceCoefficient,
        formFields: config.formFields
      } : undefined
    };
    
    // 6. Try backend calculation first with proper error handling
    logInfo(ROUTE_PATH, 'calling_backend_service', {
      ip: clientIp,
      industryId,
      timeoutMs: PYTHON_BACKEND_TIMEOUT
    });
    
    const backendResult = await callPythonBackendWithTimeout(calculationData);
    
    // 7. If successful, return the backend result
    if (backendResult.success && backendResult.data) {
      // Add a flag to indicate this was calculated by the backend service
      const result = backendResult.data;
      result.calculatedBy = "backend";
      
      logInfo(ROUTE_PATH, 'quote_calculated_by_backend', {
        ip: clientIp,
        industryId,
        status: 'success'
      });
      
      return NextResponse.json(result);
    }
    
    // 8. If backend failed, log the error and use fallback calculation
    logWarn(ROUTE_PATH, 'backend_calculation_failed', {
      ip: clientIp,
      industryId,
      error: backendResult.error || 'Unknown backend error',
      fallback: true
    });
    
    // 9. Use the centralized fallback calculation utility
    try {
      const fallbackResult = await calculateFallbackQuote({
        industryId,
        material: requestData.material,
        quantity: requestData.quantity,
        complexity: requestData.complexity,
        dimensions: requestData.dimensions
      });
      
      logInfo(ROUTE_PATH, 'quote_calculated_by_fallback', {
        ip: clientIp,
        industryId,
        status: 'success'
      });
      
      // Return result
      return NextResponse.json(fallbackResult);
    } catch (fallbackError) {
      // If even the fallback calculation fails, return an error
      logWarn(ROUTE_PATH, 'fallback_calculation_failed', {
        ip: clientIp,
        industryId,
        error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
      });
      
      return errorResponse(
        "Failed to calculate quote. Our systems are experiencing issues.",
        500,
        {
          route: ROUTE_PATH,
          ip: clientIp,
          service: 'fallback-calculation'
        }
      );
    }
  } catch (error) {
    // Final catch-all error handler
    return errorResponse("Failed to calculate quote. Please try again later.", 500, {
      route: ROUTE_PATH,
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: error instanceof Error ? error.message : String(error)
    });
  }
} 