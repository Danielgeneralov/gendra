#!/usr/bin/env tsx

import { setTimeout } from 'node:timers/promises';
import chalk from 'chalk';
import { Command } from 'commander';

// Define CLI options
const program = new Command();
program
  .option('-b, --base <url>', 'Base URL for API endpoints', 'http://localhost:3000')
  .option('-v, --verbose', 'Show detailed log output', false)
  .option('-t, --timeout <ms>', 'Request timeout in milliseconds', '10000')
  .parse(process.argv);

const options = program.opts();

// Configuration
const BASE_URL = options.base;
const TIMEOUT_MS = parseInt(options.timeout, 10);
const VERBOSE = options.verbose;

// Test result tracking
type TestResult = {
  name: string;
  passed: boolean;
  status?: number;
  duration: number;
  error?: string;
  details?: Record<string, any>;
};

const results: TestResult[] = [];
let passCount = 0;
let failCount = 0;

// Helper functions
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(timeout, () => controller.abort());
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId as any);
    return response;
  } catch (error) {
    clearTimeout(timeoutId as any);
    throw error;
  }
}

function logTestResult(result: TestResult): void {
  const statusText = result.status ? ` (${result.status})` : '';
  const durationText = `${result.duration.toFixed(0)}ms`;
  
  if (result.passed) {
    console.log(`${chalk.green('✔️  [PASS]')} ${result.name}${statusText} - ${durationText}`);
  } else {
    console.log(`${chalk.red('❌ [FAIL]')} ${result.name}${statusText} - ${durationText}`);
    if (result.error) {
      console.log(`       ${chalk.yellow('Error:')} ${result.error}`);
    }
  }
  
  if (VERBOSE && result.details) {
    console.log(`       ${chalk.gray('Details:')} ${JSON.stringify(result.details, null, 2)}`);
  }
}

async function runTest(
  name: string,
  testFn: () => Promise<{ passed: boolean; status?: number; error?: string; details?: Record<string, any> }>
): Promise<TestResult> {
  console.log(`${chalk.blue('🔍 [TEST]')} ${name}...`);
  
  const startTime = Date.now();
  try {
    const result = await testFn();
    const duration = Date.now() - startTime;
    
    const testResult: TestResult = {
      name,
      ...result,
      duration
    };
    
    if (result.passed) passCount++;
    else failCount++;
    
    results.push(testResult);
    logTestResult(testResult);
    return testResult;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    const testResult: TestResult = {
      name,
      passed: false,
      duration,
      error: errorMessage
    };
    
    failCount++;
    results.push(testResult);
    logTestResult(testResult);
    return testResult;
  }
}

// Test cases
async function testRFQParsing() {
  try {
    // Sample RFQ text for testing - just detailed enough to parse, but not sensitive
    const sampleRFQ = `
      I need a quote for manufacturing 500 units of aluminum brackets.
      The dimensions are 100mm x 50mm x 25mm with a tolerance of ±0.1mm.
      We need these finished with anodizing and delivered within 4 weeks.
      This is for an aerospace application.
    `;
    
    const response = await fetchWithTimeout(
      `${BASE_URL}/api/v1/parse`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: sampleRFQ })
      },
      TIMEOUT_MS
    );
    
    const responseData = await response.json();
    
    // Validate that the response has the expected structure
    const isValidResponse = response.ok && 
      responseData && 
      typeof responseData.material === 'string' && 
      typeof responseData.quantity === 'number';
    
    return {
      passed: isValidResponse,
      status: response.status,
      details: {
        materialExtracted: !!responseData.material,
        quantityExtracted: responseData.quantity > 0,
        dimensionsExtracted: !!responseData.dimensions
      },
      error: isValidResponse ? undefined : 'Response missing expected RFQ data structure'
    };
  } catch (error) {
    return {
      passed: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function testInvalidRFQInput() {
  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}/api/v1/parse`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: "" }) // Empty text should be rejected
      },
      TIMEOUT_MS
    );
    
    // We expect a 400 Bad Request with an error message
    const responseData = await response.json();
    
    return {
      passed: response.status === 400 && responseData.error,
      status: response.status,
      details: {
        hasErrorMessage: !!responseData.error
      },
      error: response.status !== 400 ? `Expected 400, got ${response.status}` : undefined
    };
  } catch (error) {
    return {
      passed: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function testQuoteCalculation() {
  try {
    // Mock form data for quote calculation
    const mockQuoteData = {
      material: "Aluminum 6061",
      quantity: 100,
      complexity: "medium",
      dimensions: {
        length: 150,
        width: 75,
        height: 25
      }
    };
    
    const response = await fetchWithTimeout(
      `${BASE_URL}/api/v1/quote-calculate?industryId=cnc-machining`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockQuoteData)
      },
      TIMEOUT_MS
    );
    
    const responseData = await response.json();
    
    // We expect a quote object with an amount
    const isValidQuote = response.ok && 
      responseData && 
      (responseData.quote || responseData.quoteRange || responseData.amount);
    
    return {
      passed: isValidQuote,
      status: response.status,
      details: {
        calculatedBy: responseData.calculatedBy || 'unknown',
        hasQuoteData: isValidQuote
      },
      error: isValidQuote ? undefined : 'Response missing quote calculation data'
    };
  } catch (error) {
    return {
      passed: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function testQuoteSubmission() {
  try {
    // Mock data for quote submission
    const mockSubmissionData = {
      email: "test@example.com",
      industry: "cnc-machining",
      material: "Aluminum 6061",
      quantity: 100,
      complexity: "medium",
      surface_finish: "Anodized",
      lead_time_preference: "Standard",
      custom_fields: {
        project_name: "Synthetic Test"
      },
      full_quote_shown: true
    };
    
    const response = await fetchWithTimeout(
      `${BASE_URL}/api/v1/submit-quote`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockSubmissionData)
      },
      TIMEOUT_MS
    );
    
    const responseData = await response.json();
    
    // We expect a success message or similar confirmation
    const isSuccess = response.ok && 
      responseData && 
      (responseData.success === true || responseData.id || responseData.quoteId);
    
    return {
      passed: isSuccess,
      status: response.status,
      details: {
        success: responseData.success,
        hasQuoteRange: !!responseData.quote_range
      },
      error: isSuccess ? undefined : 'Quote submission failed or returned unexpected response'
    };
  } catch (error) {
    return {
      passed: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function testIndustryConfig() {
  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}/api/v1/quote-config/cnc-machining`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      TIMEOUT_MS
    );
    
    const responseData = await response.json();
    
    // We expect configuration data for the industry
    const hasExpectedFields = response.ok && 
      responseData && 
      (responseData.formFields || responseData.pricing || responseData.basePrice);
    
    return {
      passed: hasExpectedFields,
      status: response.status,
      details: {
        fieldsFound: Object.keys(responseData || {}).filter(k => k !== 'error')
      },
      error: hasExpectedFields ? undefined : 'Industry configuration missing expected fields'
    };
  } catch (error) {
    return {
      passed: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Main test runner
async function runAllTests() {
  console.log(`${chalk.blue('🚀 Starting Gendra API Synthetic Tests')}`);
  console.log(`${chalk.gray(`Base URL: ${BASE_URL}`)}`);
  console.log(`${chalk.gray(`Timeout: ${TIMEOUT_MS}ms`)}`);
  console.log('');
  
  await runTest('RFQ Parsing', testRFQParsing);
  await runTest('Invalid RFQ Input', testInvalidRFQInput);
  await runTest('Quote Calculation', testQuoteCalculation);
  await runTest('Quote Submission', testQuoteSubmission);
  await runTest('Industry Config Fetch', testIndustryConfig);
  
  // Print summary
  console.log('');
  console.log(chalk.blue('--- Synthetic Test Summary ---'));
  console.log(`${results.length} tests run | ${chalk.green(`${passCount} passed`)} | ${failCount > 0 ? chalk.red(`${failCount} failed`) : chalk.green('0 failed')}`);
  
  // Exit with appropriate code
  if (failCount > 0) {
    console.log(chalk.red('\n❌ Some tests failed'));
    process.exit(1);
  } else {
    console.log(chalk.green('\n✅ All tests passed'));
    process.exit(0);
  }
}

runAllTests().catch(error => {
  console.error(chalk.red('Error running test suite:'), error);
  process.exit(1);
}); 