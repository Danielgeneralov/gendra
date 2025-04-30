import { NextResponse } from 'next/server';
import { PYTHON_API_URL } from '@/app/config';

// Define types for industry config and form fields
interface FormFieldOption {
  value: string;
  label: string;
  factor?: number;
  costFactor?: number;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  options?: FormFieldOption[];
  required?: boolean;
}

interface IndustryConfig {
  id: string;
  name: string;
  basePriceCoefficient?: number;
  formFields?: FormField[];
  [key: string]: unknown;
}

// This is a placeholder for the actual FastAPI server URL
const FASTAPI_URL = PYTHON_API_URL || 'http://localhost:8000';

// Helper function to load JSON config files
async function loadIndustryConfig(industryId: string): Promise<IndustryConfig | null> {
  try {
    // Using dynamic import for ESM compatibility
    const configModule = await import(`@/app/models/industries/${industryId}.json`);
    return configModule.default || configModule;
  } catch (error) {
    console.error(`Failed to load industry config for ${industryId}:`, error);
    return null;
  }
}

// Handler for GET requests to /api/v1/industries
export async function GET(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/v1', '');
  
  try {
    // Extract the industry ID if it's in the path
    const industryMatch = path.match(/\/industries\/([^\/]+)/);
    
    if (path === '/industries') {
      // Demo implementation until FastAPI is connected
      return NextResponse.json({
        industries: [
          {
            id: "metal_fabrication",
            name: "Metal Fabrication",
            description: "Precision manufacturing of metal parts through cutting, bending, and assembling processes.",
            icon: "<svg class='w-4 h-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z'></path><path d='M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8'></path><path d='M15 2v5h5'></path></svg>"
          },
          {
            id: "injection_molding",
            name: "Injection Molding",
            description: "Production of plastic parts by injecting molten material into a mold cavity where it cools and hardens.",
            icon: "<svg class='w-4 h-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'></path><path d='M8 11h8'></path><path d='M8 14h8'></path><path d='M8 17h8'></path></svg>"
          }
        ]
      });
    } else if (industryMatch && industryMatch[1]) {
      const industryId = industryMatch[1];
      
      // Load the industry config from the local file
      const config = await loadIndustryConfig(industryId);
      
      if (config) {
        return NextResponse.json(config);
      } else {
        return NextResponse.json(
          { error: `Industry '${industryId}' not found` },
          { status: 404 }
        );
      }
    }
    
    // For any other API requests, forward to FastAPI (when connected)
    // const apiResponse = await fetch(`${FASTAPI_URL}${path}${url.search}`);
    // const data = await apiResponse.json();
    // return NextResponse.json(data, { status: apiResponse.status });
    
    return NextResponse.json(
      { error: "Not implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handler for POST requests to /api/v1/quote/:industry_id
export async function POST(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/v1', '');
  
  try {
    // Check if this is a quote calculation request
    const quoteMatch = path.match(/\/quote\/([^\/]+)/);
    
    if (quoteMatch && quoteMatch[1]) {
      const industryId = quoteMatch[1];
      const requestData = await request.json();
      
      // Mock quote calculation logic until FastAPI is connected
      let basePrice = 100;
      let complexityFactor = 1.0;
      let materialCost = 50;
      let quantityDiscount = 0;
      let complexity = "Medium";
      
      // Load industry config
      const config = await loadIndustryConfig(industryId);
      
      if (config) {
        basePrice = config.basePriceCoefficient || 100;
        
        // Get complexity factor if available
        if (requestData.complexity && config.formFields) {
          const complexityField = config.formFields.find((f: FormField) => f.id === 'complexity');
          if (complexityField && complexityField.options) {
            const complexityOption = complexityField.options.find(
              (o: FormFieldOption) => o.value === requestData.complexity
            );
            if (complexityOption) {
              complexityFactor = complexityOption.factor || 1.0;
              complexity = complexityOption.label || "Medium";
            }
          }
        }
        
        // Get material cost factor if available
        if (requestData.material && config.formFields) {
          const materialField = config.formFields.find((f: FormField) => f.id === 'material');
          if (materialField && materialField.options) {
            const materialOption = materialField.options.find(
              (o: FormFieldOption) => o.value === requestData.material
            );
            if (materialOption) {
              materialCost = basePrice * (materialOption.costFactor || 1.0);
            }
          }
        }
      }
      
      // Calculate quantity discount
      const quantity = parseInt(requestData.quantity) || 1;
      if (quantity > 100) {
        quantityDiscount = 0.15;
      } else if (quantity > 50) {
        quantityDiscount = 0.10;
      } else if (quantity > 20) {
        quantityDiscount = 0.05;
      }
      
      // Calculate final quote
      let quote = basePrice + materialCost;
      quote *= complexityFactor;
      quote *= quantity;
      quote *= (1 - quantityDiscount);
      
      // Calculate lead time
      let leadTimeDays = 7;
      if (complexityFactor > 1.3) leadTimeDays += 7;
      if (quantity > 50) leadTimeDays += 5;
      
      return NextResponse.json({
        quote: Math.round(quote * 100) / 100,
        leadTime: `${leadTimeDays} days`,
        complexity,
        basePrice,
        materialCost,
        complexityFactor,
        quantityDiscount
      });
    }
    
    // For other POST requests, forward to FastAPI (when connected)
    // const apiResponse = await fetch(`${FASTAPI_URL}${path}${url.search}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(await request.json()),
    // });
    // const data = await apiResponse.json();
    // return NextResponse.json(data, { status: apiResponse.status });
    
    return NextResponse.json(
      { error: "Not implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 