/**
 * groqClient.ts
 * Dedicated client for interacting with Groq's API using structured prompts
 */

import { ParsedRFQ, DEFAULT_RFQ, VALID_INDUSTRIES, CONFIDENCE_THRESHOLD, NormalizedRFQInput } from '@/types/ParsedRFQ';
import { MissingAPIKeyError, GroqParsingError, LowConfidenceError, ExternalServiceError } from './errors';
import logger from './logger';

// Component name for logging
const COMPONENT = 'groqClient';

/**
 * Current version of the parsing logic
 */
export const PARSING_VERSION = '1.2.0';

/**
 * Available Groq models for parsing
 */
export const GROQ_MODELS = {
  PRIMARY: 'llama-3.3-70b-versatile',
  FALLBACK: 'qwen-qwq-32b',
};

/**
 * Few-shot examples to guide Groq's understanding
 */
const fewShotExamples = [
  {
    input: "Need 50 brackets made from 6061 aluminum, 3\" x 2\" x 1\", with 2 mounting holes. Due May 15.",
    output: {
      material: "6061 Aluminum",
      material_confidence: 0.95,
      quantity: 50,
      dimensions: {length: 76.2, width: 50.8, height: 25.4},
      complexity: "low",
      deadline: "2023-05-15",
      industry: "metal fabrication",
      industry_confidence: 0.92,
      finish: null,
      tolerance: null
    }
  },
  {
    input: "We need a quote for 1000 plastic enclosures, ABS material, dimensions 150mm x 80mm x 30mm with snap-fit assembly. Surface finish must be matte black. Required by end of Q3.",
    output: {
      material: "ABS Plastic",
      material_confidence: 0.98,
      quantity: 1000,
      dimensions: {length: 150, width: 80, height: 30},
      complexity: "medium",
      deadline: "2023-09-30",
      industry: "injection molding",
      industry_confidence: 0.94,
      finish: "matte black",
      tolerance: null
    }
  },
  {
    input: "RFQ for 25 steel enclosures, 304 stainless, 500mm x 300mm x 200mm, with cutouts for cable access. Brushed finish. Need ±0.1mm tolerance on critical dimensions. Delivery by January 2024.",
    output: {
      material: "304 Stainless Steel",
      material_confidence: 0.97,
      quantity: 25,
      dimensions: {length: 500, width: 300, height: 200},
      complexity: "medium",
      deadline: "2024-01-31",
      industry: "sheet metal",
      industry_confidence: 0.89,
      finish: "brushed",
      tolerance: "±0.1mm"
    }
  },
  // Example with challenging/ambiguous content
  {
    input: "Looking for a supplier for our circuit board assembly. Need 500 units with 20 components each. Testing required. Initial samples by August 15th, and full delivery by October.",
    output: {
      material: "PCB with components",
      material_confidence: 0.85,
      quantity: 500,
      dimensions: {length: 0, width: 0, height: 0},
      complexity: "high",
      deadline: "2023-10-31",
      industry: "electronics assembly",
      industry_confidence: 0.96,
      finish: null,
      tolerance: null
    }
  }
];

/**
 * System prompt defining the role and task for Groq
 */
const systemPrompt = `You are GendraRFQ, an expert manufacturing consultant specializing in extracting and structuring Request for Quote (RFQ) information with extreme precision. 
Your task is to analyze manufacturing specifications and convert unstructured RFQ text into structured data.`;

/**
 * Instructions for Groq on how to parse the RFQ text
 */
const instructionPrompt = `
Extract the following information from the RFQ text:

1. material (string): Precise material specification (e.g., "6061-T6 Aluminum", "304 Stainless Steel")
2. material_confidence (number): Your confidence in the material identification (0-1)
3. quantity (number): Exact number of units requested
4. dimensions (object): All measurements converted to millimeters (mm)
   - length: numeric value in mm
   - width: numeric value in mm 
   - height: numeric value in mm
5. complexity (string): Manufacturing complexity categorized as "low", "medium", or "high"
6. deadline (string): Date in ISO format (YYYY-MM-DD)
7. industry (string): Must be one of: "metal fabrication", "injection molding", "cnc machining", "sheet metal", "electronics assembly"
8. industry_confidence (number): Your confidence in the industry classification (0-1)
9. finish (string or null): Surface finish requirements
10. tolerance (string or null): Tolerance specifications

IMPORTANT RULES:
- ALL dimensions MUST be in millimeters (mm). Convert from inches if needed (1 inch = 25.4 mm)
- If the industry is unclear, use contextual clues from materials and processes mentioned
- If any field is completely absent from the text, use null instead of guessing
- Format response as valid JSON with no additional text

Here are indicators for industry classification:
- metal fabrication: involves welding, bending, cutting sheet metal, forming, metal joining
- injection molding: involves plastic parts, molds, resins, cavities, gates, runners
- cnc machining: involves precision milling, turning, complex 3D shapes from solid blocks
- sheet metal: involves thin metal sheets, bending, punching, forming, enclosures
- electronics assembly: involves PCBs, components, soldering, connectors, circuitry

Here is the RFQ to analyze:
`;

/**
 * Normalizes input text and metadata for more consistent parsing
 * 
 * @param input - Raw input text or normalized input object
 * @returns Normalized input object
 */
export function normalizeInput(input: string | NormalizedRFQInput): NormalizedRFQInput {
  // If input is already normalized, return it
  if (typeof input !== 'string') {
    return input;
  }
  
  // Normalize raw text input
  return {
    text: input.trim()
  };
}

/**
 * Generates the complete prompt for Groq with examples and instructions
 * 
 * @param input - The normalized input data
 * @returns The complete formatted prompt
 */
function generatePrompt(input: NormalizedRFQInput): string {
  let contextInfo = '';
  
  // Add file context if available
  if (input.fileContext) {
    contextInfo += '\nFile context:';
    if (input.fileContext.filename) contextInfo += `\n- Filename: ${input.fileContext.filename}`;
    if (input.fileContext.fileType) contextInfo += `\n- File type: ${input.fileContext.fileType}`;
    if (input.fileContext.sheetName) contextInfo += `\n- Sheet name: ${input.fileContext.sheetName}`;
  }
  
  // Add user context if available (helps with industry selection)
  if (input.userContext?.preferredIndustry && VALID_INDUSTRIES.includes(input.userContext.preferredIndustry)) {
    contextInfo += `\n\nNote: The user typically works in the "${input.userContext.preferredIndustry}" industry.`;
  }
  
  // Format few-shot examples
  const examplesText = fewShotExamples
    .map(example => `Input RFQ:\n"${example.input}"\n\nOutput:\n${JSON.stringify(example.output, null, 2)}`)
    .join('\n\n---\n\n');
  
  return `${instructionPrompt}${contextInfo}\n\n${input.text}\n\nBefore responding, review these examples to ensure your output follows the same format:\n\n${examplesText}`;
}

/**
 * Validates the Groq response against expected schema
 * 
 * @param parsedData - The parsed data from Groq
 * @returns The validated data or throws an error
 */
function validateGroqResponse(parsedData: any): ParsedRFQ {
  // Basic structure validation
  if (!parsedData) {
    throw new GroqParsingError('Received empty response from Groq');
  }
  
  logger.info(COMPONENT, 'Validating Groq response', {
    hasData: !!parsedData,
    fields: Object.keys(parsedData).join(',')
  });
  
  // Required fields validation
  const requiredFields = ['material', 'quantity', 'dimensions', 'complexity', 'deadline', 'industry'];
  for (const field of requiredFields) {
    if (parsedData[field] === undefined) {
      throw new GroqParsingError(`Missing required field: ${field}`);
    }
  }
  
  // Dimensions validation and repair if needed
  if (!parsedData.dimensions || typeof parsedData.dimensions !== 'object') {
    // Try to create a default dimensions object
    logger.warn(COMPONENT, 'Creating default dimensions object', {
      originalDimensions: parsedData.dimensions
    });
    parsedData.dimensions = { length: 0, width: 0, height: 0 };
  } else {
    // Ensure dimensions has all required properties
    if (parsedData.dimensions.length === undefined) {
      logger.warn(COMPONENT, 'Missing length dimension, defaulting to 0');
      parsedData.dimensions.length = 0;
    }
    
    if (parsedData.dimensions.width === undefined) {
      logger.warn(COMPONENT, 'Missing width dimension, defaulting to 0');
      parsedData.dimensions.width = 0;
    }
    
    if (parsedData.dimensions.height === undefined) {
      logger.warn(COMPONENT, 'Missing height dimension, defaulting to 0');
      parsedData.dimensions.height = 0;
    }
  }
  
  // Type validations and conversions
  if (typeof parsedData.material !== 'string') {
    throw new GroqParsingError('Material must be a string');
  }
  
  if (typeof parsedData.quantity !== 'number') {
    // Try to convert to number if it's a string
    const numQuantity = Number(parsedData.quantity);
    if (isNaN(numQuantity)) {
      throw new GroqParsingError('Quantity must be a number');
    }
    parsedData.quantity = numQuantity;
  }
  
  // Validate dimensions are numbers
  ['length', 'width', 'height'].forEach(dim => {
    if (typeof parsedData.dimensions[dim] !== 'number') {
      const numDim = Number(parsedData.dimensions[dim]);
      if (isNaN(numDim)) {
        logger.warn(COMPONENT, `Invalid dimension ${dim}, defaulting to 0`, {
          providedValue: parsedData.dimensions[dim]
        });
        parsedData.dimensions[dim] = 0;
      } else {
        parsedData.dimensions[dim] = numDim;
      }
    }
  });
  
  // Validate complexity
  if (!['low', 'medium', 'high'].includes(String(parsedData.complexity).toLowerCase())) {
    logger.warn(COMPONENT, 'Invalid complexity value, defaulting to "medium"', {
      providedComplexity: parsedData.complexity
    });
    parsedData.complexity = 'medium';
  } else {
    parsedData.complexity = String(parsedData.complexity).toLowerCase();
  }
  
  // Validate industry
  if (!VALID_INDUSTRIES.includes(String(parsedData.industry).toLowerCase())) {
    throw new GroqParsingError(`Industry must be one of: ${VALID_INDUSTRIES.join(', ')}`);
  } else {
    parsedData.industry = String(parsedData.industry).toLowerCase();
  }
  
  // Validate confidence scores
  if (typeof parsedData.material_confidence !== 'number' || 
      parsedData.material_confidence < 0 || 
      parsedData.material_confidence > 1) {
    logger.warn(COMPONENT, 'Invalid material confidence, defaulting to 0.5', {
      providedConfidence: parsedData.material_confidence
    });
    parsedData.material_confidence = 0.5;
  }
  
  if (typeof parsedData.industry_confidence !== 'number' || 
      parsedData.industry_confidence < 0 || 
      parsedData.industry_confidence > 1) {
    logger.warn(COMPONENT, 'Invalid industry confidence, defaulting to 0.5', {
      providedConfidence: parsedData.industry_confidence
    });
    parsedData.industry_confidence = 0.5;
  }
  
  // Check confidence thresholds
  if (parsedData.material_confidence < CONFIDENCE_THRESHOLD || 
      parsedData.industry_confidence < CONFIDENCE_THRESHOLD) {
    throw new LowConfidenceError(
      `Confidence scores below threshold (${CONFIDENCE_THRESHOLD})`,
      parsedData,
      {
        material: parsedData.material_confidence,
        industry: parsedData.industry_confidence,
        threshold: CONFIDENCE_THRESHOLD
      }
    );
  }
  
  // Clean null/undefined values and convert to expected types
  const result: ParsedRFQ = {
    material: parsedData.material,
    quantity: parsedData.quantity,
    dimensions: {
      length: parsedData.dimensions.length,
      width: parsedData.dimensions.width,
      height: parsedData.dimensions.height,
    },
    complexity: parsedData.complexity as 'low' | 'medium' | 'high',
    deadline: parsedData.deadline,
    industry: parsedData.industry,
    material_confidence: parsedData.material_confidence,
    industry_confidence: parsedData.industry_confidence,
    // Optional fields
    finish: parsedData.finish || undefined,
    tolerance: parsedData.tolerance || undefined,
  };
  
  return result;
}

/**
 * Options for the parseRFQ function
 */
export interface ParseRFQOptions {
  /** API key override */
  apiKey?: string;
  /** Timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Whether to retry with fallback model if primary fails */
  useModelFallback?: boolean;
}

/**
 * Parses an RFQ text and returns structured data using Groq's API
 * 
 * @param input - The text or normalized input object to parse
 * @param options - Optional configuration options
 * @returns A promise resolving to the parsed RFQ data
 * @throws {MissingAPIKeyError} If the API key is missing
 * @throws {GroqParsingError} If parsing fails
 * @throws {LowConfidenceError} If confidence scores are below threshold
 * @throws {ExternalServiceError} If the Groq API fails
 */
export async function parseRFQ(
  input: string | NormalizedRFQInput,
  options: ParseRFQOptions = {}
): Promise<ParsedRFQ> {
  // Start timing for performance tracking
  const startTime = Date.now();
  
  // Normalize input
  const normalizedInput = normalizeInput(input);
  
  // Check for API key
  const groqApiKey = options.apiKey || process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    throw new MissingAPIKeyError();
  }
  
  // Set up abort controller for timeout
  const timeout = options.timeout || 30000; // 30-second default timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    logger.info(COMPONENT, 'Starting RFQ parsing', {
      textLength: normalizedInput.text.length,
      hasFileContext: !!normalizedInput.fileContext,
      hasUserContext: !!normalizedInput.userContext,
    });
    
    // Generate prompt
    const prompt = generatePrompt(normalizedInput);
    const model = GROQ_MODELS.PRIMARY;
    
    // Call the primary model
    const response = await callGroqModel(
      model,
      prompt,
      groqApiKey,
      controller.signal
    );
    
    // Parse and validate the response
    const validatedData = validateGroqResponse(response);
    
    // Enrich with metadata
    const result: ParsedRFQ = {
      ...validatedData,
      modelUsed: model,
      parsing_version: PARSING_VERSION,
      timestamp: new Date().toISOString(),
      is_reviewed: false,
    };
    
    // Log performance metrics
    logger.info(COMPONENT, 'RFQ parsing completed successfully', {
      model,
      processingTime: Date.now() - startTime,
      material_confidence: result.material_confidence,
      industry_confidence: result.industry_confidence,
    });
    
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle abort error (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      logger.error(COMPONENT, 'Request to Groq API timed out', error, {
        timeout,
        model: GROQ_MODELS.PRIMARY,
      });
      throw new ExternalServiceError('Groq API', 'Request timed out', { timeout });
    }
    
    // Try fallback model if enabled and error wasn't low confidence
    if (
      options.useModelFallback === true && 
      !(error instanceof LowConfidenceError) &&
      !(error instanceof MissingAPIKeyError)
    ) {
      logger.warn(COMPONENT, 'Primary model failed, attempting fallback', {
        error: error instanceof Error ? error.message : String(error),
        fallbackModel: GROQ_MODELS.FALLBACK,
      });
      
      try {
        return await attemptWithFallbackModel(normalizedInput, groqApiKey, options);
      } catch (fallbackError) {
        logger.error(COMPONENT, 'Fallback model also failed', fallbackError);
        // Continue to general error handling
      }
    }
    
    // Rethrow known errors
    if (
      error instanceof GroqParsingError || 
      error instanceof LowConfidenceError || 
      error instanceof MissingAPIKeyError ||
      error instanceof ExternalServiceError
    ) {
      throw error;
    }
    
    // Wrap unknown errors
    logger.error(COMPONENT, 'Unexpected error during RFQ parsing', error);
    throw new ExternalServiceError(
      'Groq API',
      error instanceof Error ? error.message : String(error)
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Core function to call the Groq API
 */
async function callGroqModel(
  model: string,
  prompt: string,
  apiKey: string,
  signal: AbortSignal
): Promise<any> {
  try {
    logger.info(COMPONENT, `Sending request to Groq API with model ${model}`);
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Lower temperature for more consistent output
        max_completion_tokens: 1024,
        top_p: 0.95,
        response_format: { type: "json_object" },
      }),
      signal,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail;
      
      try {
        errorDetail = JSON.parse(errorText);
        
        // Direct fix for the tolerance error in the failed_generation
        if (
          errorDetail?.error?.code === 'json_validate_failed' &&
          errorDetail?.error?.failed_generation
        ) {
          const failedJson = errorDetail.error.failed_generation;
          
          // Try to extract and fix any JSON from the failed generation
          const fixedJson = attemptToFixJson(failedJson);
          if (fixedJson) {
            logger.info(COMPONENT, 'Successfully fixed failed_generation JSON');
            return fixedJson;
          }
        }
      } catch (jsonError) {
        errorDetail = errorText;
      }
      
      logger.error(COMPONENT, `Groq API error (${response.status})`, null, {
        statusCode: response.status,
        errorDetail,
      });
      
      throw new ExternalServiceError(
        'Groq API',
        `Error ${response.status}: ${response.statusText}`,
        errorDetail
      );
    }
    
    const data = await response.json();
    
    // Check if response has the expected structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new GroqParsingError('Unexpected response format from Groq API');
    }
    
    const jsonContent = data.choices[0].message.content;
    
    try {
      // Parse the JSON content
      return JSON.parse(jsonContent);
    } catch (jsonError) {
      logger.error(COMPONENT, 'Failed to parse JSON from Groq response', jsonError, {
        responseContent: jsonContent,
      });
      
      // Try to fix common JSON errors before giving up
      const fixedJson = attemptToFixJson(jsonContent);
      if (fixedJson) {
        logger.info(COMPONENT, 'Successfully fixed malformed JSON from Groq');
        return fixedJson;
      }
      
      // If we can't fix the JSON but we have a valid response with choices,
      // try to create a minimal valid response based on text analysis
      try {
        const extractedData = extractDataFromText(jsonContent);
        if (extractedData) {
          logger.info(COMPONENT, 'Successfully extracted data from text response');
          return extractedData;
        }
      } catch (extractError) {
        logger.error(COMPONENT, 'Failed to extract data from text', extractError);
      }
      
      throw new GroqParsingError(`Failed to parse JSON response: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
    }
  } catch (error) {
    if (error instanceof GroqParsingError || error instanceof ExternalServiceError) {
      throw error;
    }
    
    throw new ExternalServiceError(
      'Groq API', 
      error instanceof Error ? error.message : String(error)
    );
  }
}

/**
 * Attempts to extract structured data from a text response when JSON parsing fails
 */
function extractDataFromText(text: string): any | null {
  try {
    // Create a minimal valid object
    const result: any = {
      material: 'Unknown material',
      quantity: 1,
      dimensions: {
        length: 0,
        width: 0,
        height: 0
      },
      complexity: 'medium',
      deadline: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
      industry: 'metal fabrication', // Default industry
      material_confidence: 0.6,
      industry_confidence: 0.6
    };
    
    // Try to extract material
    const materialMatch = text.match(/material[\"'\s:\-]+([^\"',\n\r}]+)/i);
    if (materialMatch && materialMatch[1]) {
      result.material = materialMatch[1].trim();
    }
    
    // Try to extract industry
    const industryMatch = text.match(/industry[\"'\s:\-]+([^\"',\n\r}]+)/i);
    if (industryMatch && industryMatch[1]) {
      const industry = industryMatch[1].trim().toLowerCase();
      if (VALID_INDUSTRIES.includes(industry)) {
        result.industry = industry;
      }
    }
    
    // Try to extract quantity
    const quantityMatch = text.match(/quantity[\"'\s:\-]+(\d+)/i);
    if (quantityMatch && quantityMatch[1]) {
      const quantity = parseInt(quantityMatch[1], 10);
      if (!isNaN(quantity)) {
        result.quantity = quantity;
      }
    }
    
    return result;
  } catch (error) {
    logger.error(COMPONENT, 'Error extracting data from text', error);
    return null;
  }
}

/**
 * Attempts to fix common JSON errors in model responses
 */
function attemptToFixJson(jsonString: string): any | null {
  try {
    // First try: direct parsing
    try {
      return JSON.parse(jsonString);
    } catch {
      // Continue to fixes if direct parsing fails
    }
    
    // Look for properly formatted JSON inside the string
    const jsonMatch = jsonString.match(/(\{[\s\S]*\})/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        // Continue to other fixes
      }
    }
    
    // Direct fix for the tolerance issue we've seen in the logs
    if (jsonString.includes('"tolerance": "±') && jsonString.includes('\n}')) {
      const fixedString = jsonString.replace(/("tolerance"\s*:\s*"[^"]+)\n\s*\}/, '$1"}');
      try {
        return JSON.parse(fixedString);
      } catch (e) {
        // If direct fix doesn't work, continue to general fixes
      }
    }
    
    // Try to fix unclosed quotes or missing closing braces
    let fixedString = jsonString
      .replace(/(\w+)(?=:)/g, '"$1"') // Add quotes around unquoted keys
      .replace(/:\s*([^",\{\}\[\]\s][^",\{\}\[\]\s]*)\s*([,\}])/g, ':"$1"$2') // Add quotes around unquoted values
      .replace(/,\s*\}/g, '}') // Remove trailing commas
      .replace(/\n(?=\s*\})/g, ''); // Remove newlines before closing braces
    
    // Fix malformed dimensions object
    if (fixedString.includes('"dimensions"')) {
      const dimensionsRegex = /"dimensions"\s*:\s*\{([^}]*)\}/;
      const match = fixedString.match(dimensionsRegex);
      
      if (match) {
        const dimensionsContent = match[1];
        // Check if dimensions has all required properties
        const hasLength = dimensionsContent.includes('"length"');
        const hasWidth = dimensionsContent.includes('"width"');
        const hasHeight = dimensionsContent.includes('"height"');
        
        let fixedDimensions = dimensionsContent;
        if (!hasLength) {
          fixedDimensions += ', "length": 0';
        }
        if (!hasWidth) {
          fixedDimensions += ', "width": 0';
        }
        if (!hasHeight) {
          fixedDimensions += ', "height": 0';
        }
        
        // Remove any leading commas
        fixedDimensions = fixedDimensions.replace(/^\s*,\s*/, '');
        
        // Replace the dimensions object
        fixedString = fixedString.replace(dimensionsRegex, `"dimensions": {${fixedDimensions}}`);
      }
    }
    
    try {
      return JSON.parse(fixedString);
    } catch {
      // Continue to more aggressive fixes
    }
    
    // Advanced fixing for specific patterns in the error logs
    // This pattern looks for the tolerance value with an unclosed string (as seen in the logs)
    const toleranceFixRegex = /("tolerance"\s*:\s*".+?)(?=\s*\n\s*\})/;
    if (toleranceFixRegex.test(jsonString)) {
      const fixed = jsonString.replace(toleranceFixRegex, '$1"');
      try {
        return JSON.parse(fixed);
      } catch {
        // If still failing, give up
        return null;
      }
    }
    
    return null; // Couldn't fix the JSON
  } catch (error) {
    logger.error(COMPONENT, 'Error attempting to fix JSON', error);
    return null;
  }
}

/**
 * Attempts to parse RFQ with a fallback model
 */
async function attemptWithFallbackModel(
  input: NormalizedRFQInput,
  apiKey: string,
  options: ParseRFQOptions
): Promise<ParsedRFQ> {
  logger.info(COMPONENT, `Attempting with fallback model: ${GROQ_MODELS.FALLBACK}`);
  
  // Generate prompt for fallback model - may need to be simpler
  const prompt = generatePrompt(input);
  
  // Set up abort controller for timeout
  const timeout = options.timeout || 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Call fallback model
    const model = GROQ_MODELS.FALLBACK;
    const response = await callGroqModel(
      model,
      prompt,
      apiKey,
      controller.signal
    );
    
    // Parse and validate response
    const validatedData = validateGroqResponse(response);
    
    // Enrich with metadata
    const result: ParsedRFQ = {
      ...validatedData,
      modelUsed: model,
      parsing_version: PARSING_VERSION,
      timestamp: new Date().toISOString(),
      is_reviewed: false,
    };
    
    logger.info(COMPONENT, 'Fallback model succeeded', {
      model,
      material_confidence: result.material_confidence,
      industry_confidence: result.industry_confidence,
    });
    
    return result;
  } catch (error) {
    // Check for decommissioned model error and suggest update
    if (
      error instanceof ExternalServiceError && 
      typeof error.details === 'object' && 
      error.details && 
      'error' in error.details &&
      typeof error.details.error === 'object' &&
      error.details.error &&
      'code' in error.details.error &&
      error.details.error.code === 'model_decommissioned'
    ) {
      logger.error(COMPONENT, 'Fallback model has been decommissioned', error, {
        model: GROQ_MODELS.FALLBACK,
        suggestion: 'Update the GROQ_MODELS.FALLBACK constant to use a currently supported model'
      });
      
      // Try with an emergency fallback option
      try {
        logger.info(COMPONENT, 'Attempting with emergency fallback model: deepseek-r1-distill-llama-70b');
        
        const emergencyResponse = await callGroqModel(
          'deepseek-r1-distill-llama-70b',
          prompt,
          apiKey,
          controller.signal
        );
        
        // Handle emergency fallback model response
        const emergencyValidatedData = validateGroqResponse(emergencyResponse);
        
        return {
          ...emergencyValidatedData,
          modelUsed: 'deepseek-r1-distill-llama-70b (emergency fallback)',
          parsing_version: PARSING_VERSION,
          timestamp: new Date().toISOString(),
          is_reviewed: false,
        };
      } catch (emergencyError) {
        logger.error(COMPONENT, 'Emergency fallback model also failed', emergencyError);
        throw error; // Rethrow original error
      }
    }
    
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
} 