"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL, QUOTE_ENDPOINT } from '../../app/config';

type FormData = {
  material: string;
  quantity: number;
  volume: number;
  partWeight: number;
  complexity: 'low' | 'medium' | 'high';
  surfaceFinish: string;
  colorMatching: boolean;
  deadline: string;
};

// Configure the API endpoint 
const HEALTH_ENDPOINT = `${API_BASE_URL}/`;

// Add service type constant at the top after imports
const SERVICE_TYPE = 'injection_molding';  // TODO: Make this dynamic using route-based context

export default function InjectionMoldingForm() {
  const searchParams = useSearchParams();
  const isPrefill = searchParams.get('prefill') === 'true';
  
  const [formData, setFormData] = useState<FormData>({
    material: 'abs',
    quantity: 1000,
    volume: 0,
    partWeight: 0,
    complexity: 'low',
    surfaceFinish: 'standard',
    colorMatching: false,
    deadline: '',
  });
  
  const [showQuote, setShowQuote] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [leadTime, setLeadTime] = useState('');
  const [moldCost, setMoldCost] = useState(0);
  const [unitCost, setUnitCost] = useState(0);
  const [loading, setLoading] = useState(isPrefill);
  const [calculatingQuote, setCalculatingQuote] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Check if backend API is available
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(HEALTH_ENDPOINT, {
          method: 'GET',
          cache: 'no-cache',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(2000)
        });
        
        if (response.ok) {
          console.log('Backend API is available');
          setBackendStatus('online');
        } else {
          console.warn('Backend API returned error status:', response.status);
          setBackendStatus('offline');
        }
      } catch (error) {
        console.error('Backend API check failed:', error);
        setBackendStatus('offline');
      }
    };
    
    checkBackendStatus();
  }, []);

  // Fetch parsed RFQ data if prefill is requested
  useEffect(() => {
    if (isPrefill) {
      const fetchLastParsedRFQ = async () => {
        try {
          // For demonstration, we'll use sessionStorage
          const storedData = sessionStorage.getItem('lastParsedRFQ');
          
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            
            // Map the parsed RFQ data to our form fields
            setFormData(prevState => ({
              ...prevState,
              material: parsedData.material?.toLowerCase() || prevState.material,
              quantity: parsedData.quantity || prevState.quantity,
              // Other fields that might be available in parsed RFQ data
              complexity: parsedData.complexity as 'low' | 'medium' | 'high' || prevState.complexity,
              deadline: parsedData.deadline || prevState.deadline,
            }));
          }
        } catch (error) {
          console.error("Error prefilling form:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchLastParsedRFQ();
    }
  }, [isPrefill]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'number' ? parseFloat(value) : value,
      });
    }
  };

  // Function to map frontend complexity to a numerical value for the backend
  const mapComplexityToValue = (complexity: string): number => {
    switch (complexity) {
      case 'low': return 0.5;
      case 'medium': return 1.0;
      case 'high': return 1.5;
      default: return 1.0;
    }
  };

  // Perform a fallback calculation if the backend is unavailable
  const calculateFallbackQuote = (): { amount: number, leadTime: string, moldCost: number, unitCost: number } => {
    console.log('Performing fallback calculation for injection molding');
    
    // Base costs
    const baseMoldCost = 5000;
    const baseUnitCost = 1.0;
    
    // Material factors
    const materialFactors: Record<string, number> = {
      'abs': 1.0,
      'polypropylene': 0.9,
      'polyethylene': 0.85,
      'polycarbonate': 1.4,
      'nylon': 1.5,
      'pom': 1.3,
    };
    
    // Complexity factors
    const complexityFactors: Record<string, number> = {
      'low': 1.0,
      'medium': 1.5,
      'high': 2.2,
    };
    
    // Surface finish factors
    const finishFactors: Record<string, number> = {
      'standard': 1.0,
      'textured': 1.2,
      'high-gloss': 1.4,
      'matte': 1.15,
    };
    
    // Calculate mold cost
    let moldCost = baseMoldCost;
    moldCost *= complexityFactors[formData.complexity] || 1.0;
    moldCost *= formData.partWeight > 0 ? (1 + formData.partWeight * 0.01) : 1;
    
    // Calculate unit cost
    let unitCost = baseUnitCost;
    unitCost *= materialFactors[formData.material] || 1.0;
    unitCost *= finishFactors[formData.surfaceFinish] || 1.0;
    unitCost *= formData.partWeight > 0 ? (formData.partWeight * 0.5) : 1;
    
    // Additional costs
    if (formData.colorMatching) {
      unitCost *= 1.15; // 15% for color matching
    }
    
    // Quantity discounts for unit cost
    if (formData.quantity > 10000) {
      unitCost *= 0.7; // 30% discount for 10k+ units
    } else if (formData.quantity > 5000) {
      unitCost *= 0.8; // 20% discount for 5k+ units
    } else if (formData.quantity > 2000) {
      unitCost *= 0.9; // 10% discount for 2k+ units
    }
    
    // Calculate total quote
    const totalUnitCost = unitCost * formData.quantity;
    const totalQuote = moldCost + totalUnitCost;
    
    // Calculate lead time based on complexity and quantity
    let toolingTime = 15; // Base tooling time in days
    if (formData.complexity === 'medium') toolingTime += 5;
    if (formData.complexity === 'high') toolingTime += 10;
    
    const productionTime = Math.ceil(formData.quantity / 5000) * 5; // 5 days per 5000 units
    
    return {
      amount: Math.round(totalQuote * 100) / 100,
      moldCost: Math.round(moldCost * 100) / 100,
      unitCost: Math.round(unitCost * 100) / 100,
      leadTime: `${toolingTime + productionTime} days (estimate)`
    };
  };

  const calculateQuote = async () => {
    setCalculatingQuote(true);
    setQuoteError(null);
    
    try {
      // Get complexity value for backend
      const complexityValue = mapComplexityToValue(formData.complexity);
      
      // Prepare the request body with required backend fields
      const requestBody = {
        // Required fields for schema-based dispatch
        service_type: SERVICE_TYPE,
        material: formData.material,
        quantity: formData.quantity,
        complexity: complexityValue,
        
        // Additional parameters for injection molding calculation
        part_volume: formData.volume,
        part_weight: formData.partWeight,
        surface_finish: formData.surfaceFinish,
        color_matching: formData.colorMatching,
        
        // Optional metadata
        requested_deadline: formData.deadline || null
      };
      
      console.log('Sending request to backend:', requestBody);
      
      // Call the backend API
      const response = await fetch(QUOTE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Backend responded with status ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Backend response:', responseData);
      
      // Extract data from the API response
      setQuoteAmount(responseData.quote);
      
      // Set mold and unit costs if provided by backend
      if (responseData.moldCost !== undefined) {
        setMoldCost(responseData.moldCost);
      }
      
      if (responseData.unitCost !== undefined) {
        setUnitCost(responseData.unitCost);
      }
      
      // Use lead time from API if available, otherwise calculate it
      if (responseData.leadTime) {
        setLeadTime(responseData.leadTime);
      } else {
        // Calculate estimated lead time
        let toolingTime = 15; // Base tooling time in days
        if (formData.complexity === 'medium') toolingTime += 5;
        if (formData.complexity === 'high') toolingTime += 10;
        
        const productionTime = Math.ceil(formData.quantity / 5000) * 5; // 5 days per 5000 units
        
        setLeadTime(`${toolingTime + productionTime} days`);
      }
      
      // Update backend status to online since we had a successful call
      setBackendStatus('online');
      setShowQuote(true);
      
    } catch (error: unknown) {
      console.error('Error fetching quote from backend:', error);
      
      // Type guard to check if error is an Error object
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setQuoteError(errorMessage);
      
      // If backend is definitively offline, use fallback calculation
      if (backendStatus === 'offline' || 
          (error instanceof Error && 
           (error.message.includes('timeout') || error.message.includes('network')))) {
        const fallbackResult = calculateFallbackQuote();
        setQuoteAmount(fallbackResult.amount);
        setMoldCost(fallbackResult.moldCost);
        setUnitCost(fallbackResult.unitCost);
        setLeadTime(fallbackResult.leadTime);
        setShowQuote(true);
        // Set backend status to offline for future requests
        setBackendStatus('offline');
      } else {
        // Show error notification but don't show quote (handle transient API errors)
        alert(`Error getting quote: ${errorMessage}\n\nPlease try again.`);
      }
    } finally {
      setCalculatingQuote(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateQuote();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A6FA6]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300 mb-8">
        <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">Project Details</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Material
              </label>
              <select 
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              >
                <option value="abs">ABS</option>
                <option value="polypropylene">Polypropylene (PP)</option>
                <option value="polyethylene">Polyethylene (PE)</option>
                <option value="polycarbonate">Polycarbonate (PC)</option>
                <option value="nylon">Nylon (PA)</option>
                <option value="pom">POM (Acetal)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="500"
                step="100"
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Part Volume (cm³)
              </label>
              <input
                type="number"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Part Weight (g)
              </label>
              <input
                type="number"
                name="partWeight"
                value={formData.partWeight}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Complexity
              </label>
              <select
                name="complexity"
                value={formData.complexity}
                onChange={handleInputChange}
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              >
                <option value="low">Low - Simple geometry, few features</option>
                <option value="medium">Medium - Multiple features, moderate complexity</option>
                <option value="high">High - Complex features, undercuts, thin walls</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Surface Finish
              </label>
              <select
                name="surfaceFinish"
                value={formData.surfaceFinish}
                onChange={handleInputChange}
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              >
                <option value="standard">Standard</option>
                <option value="textured">Textured</option>
                <option value="high-gloss">High Gloss</option>
                <option value="matte">Matte</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-3 pt-6">
              <input
                type="checkbox"
                id="colorMatching"
                name="colorMatching"
                checked={formData.colorMatching}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#4A6FA6] focus:ring-[#4A6FA6] border-[#24334A] rounded"
              />
              <label htmlFor="colorMatching" className="text-[#E2E8F0] text-sm">
                Custom Color Matching Required
              </label>
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#94A3B8]">Backend Status:</span>
              {backendStatus === 'online' ? (
                <span className="text-sm text-green-500 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                  Connected to pricing engine
                </span>
              ) : backendStatus === 'offline' ? (
                <span className="text-sm text-red-500 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                  Using local calculation (backend unavailable)
                </span>
              ) : (
                <span className="text-sm text-yellow-500 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
                  Checking backend status...
                </span>
              )}
            </div>
            
            <button
              type="submit"
              disabled={calculatingQuote}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                calculatingQuote ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {calculatingQuote ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : (
                'Calculate Quote'
              )}
            </button>
          </div>
        </form>
      </div>
      
      {showQuote && (
        <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
          <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">Quote Summary</h2>
          
          {backendStatus === 'offline' && (
            <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-2 rounded-md mb-4 text-sm">
              Note: Using estimated pricing due to backend service unavailability. Contact sales for precise quotes.
            </div>
          )}
          
          {quoteError && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-2 rounded-md mb-4 text-sm">
              Error: {quoteError}
            </div>
          )}
          
          <div className="bg-[#141F30] p-4 rounded-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#94A3B8]">Total Price:</span>
              <span className="text-2xl font-bold text-[#F0F4F8]">${quoteAmount}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">Mold Cost:</span>
                <span className="text-lg font-medium text-[#F0F4F8]">${moldCost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">Unit Cost:</span>
                <span className="text-lg font-medium text-[#F0F4F8]">${unitCost} per part</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94A3B8]">Estimated Lead Time:</span>
              <span className="text-lg font-medium text-[#F0F4F8]">{leadTime}</span>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Proceed to Order
            </button>
            <button
              onClick={() => setShowQuote(false)}
              className="inline-flex items-center px-4 py-2 border border-[#24334A] text-sm font-medium rounded-md text-[#E2E8F0] bg-transparent hover:bg-[#141F30] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A6FA6]"
            >
              Modify Quote
            </button>
          </div>
        </div>
      )}
    </>
  );
} 