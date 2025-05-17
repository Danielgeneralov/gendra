"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL, QUOTE_ENDPOINT } from '../../app/config';

type FormData = {
  material: string;
  quantity: number;
  thickness: number;
  length: number;
  width: number;
  complexity: 'low' | 'medium' | 'high';
  finishType: string;
  deadline: string;
};

// Configure the API endpoint 
const HEALTH_ENDPOINT = `${API_BASE_URL}/`;

export default function MetalFabricationForm() {
  const searchParams = useSearchParams();
  const isPrefill = searchParams.get('prefill') === 'true';
  
  const [formData, setFormData] = useState<FormData>({
    material: 'aluminum',
    quantity: 1,
    thickness: 1.0,
    length: 0,
    width: 0,
    complexity: 'low',
    finishType: 'none',
    deadline: '',
  });
  
  const [showQuote, setShowQuote] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [leadTime, setLeadTime] = useState('');
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
          // Here we would normally fetch the data from a storage mechanism
          // For demonstration, we'll use sessionStorage
          const storedData = sessionStorage.getItem('lastParsedRFQ');
          
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            
            // Map the parsed RFQ data to our form fields
            setFormData(prevState => ({
              ...prevState,
              material: parsedData.material?.toLowerCase() || prevState.material,
              quantity: parsedData.quantity || prevState.quantity,
              // Assume dimensions in mm for metal fabrication
              length: parsedData.dimensions?.length || prevState.length,
              width: parsedData.dimensions?.width || prevState.width,
              thickness: prevState.thickness, // Keep default as this might not be in parsed RFQ
              complexity: parsedData.complexity as 'low' | 'medium' | 'high' || prevState.complexity,
              finishType: prevState.finishType, // Keep default as this might not be in parsed RFQ
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
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
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
  const calculateFallbackQuote = (): { amount: number, leadTime: string } => {
    console.log('Performing fallback calculation for metal fabrication');
    
    // Base price calculation
    const basePrice = 50;
    
    // Material factors
    const materialFactors: Record<string, number> = {
      'aluminum': 1.0,
      'steel': 1.2,
      'stainless-steel': 1.5,
      'copper': 2.0,
    };
    
    // Complexity factors
    const complexityFactors: Record<string, number> = {
      'low': 1.0,
      'medium': 1.5,
      'high': 2.2,
    };
    
    // Finish type factors
    const finishFactors: Record<string, number> = {
      'none': 1.0,
      'painted': 1.3,
      'powder-coated': 1.4,
      'anodized': 1.5,
      'brushed': 1.2,
    };
    
    // Calculate surface area and volume
    const surfaceArea = formData.length * formData.width;
    const volume = surfaceArea * formData.thickness;
    
    // Apply factors
    let price = basePrice;
    price *= materialFactors[formData.material] || 1.0;
    price *= complexityFactors[formData.complexity] || 1.0;
    price *= finishFactors[formData.finishType] || 1.0;
    
    // Volume-based pricing
    price += volume * 0.1;
    
    // Quantity discounts
    if (formData.quantity > 50) {
      price *= 0.8; // 20% discount for 50+ units
    } else if (formData.quantity > 20) {
      price *= 0.9; // 10% discount for 20+ units
    } else if (formData.quantity > 10) {
      price *= 0.95; // 5% discount for 10+ units
    }
    
    // Multiply by quantity
    price *= formData.quantity;
    
    // Calculate lead time based on complexity and quantity
    let leadTimeDays = 5;
    if (formData.complexity === 'medium') leadTimeDays += 2;
    if (formData.complexity === 'high') leadTimeDays += 5;
    if (formData.quantity > 20) leadTimeDays += 3;
    if (formData.quantity > 50) leadTimeDays += 7;
    
    return {
      amount: Math.round(price * 100) / 100,
      leadTime: `${leadTimeDays} days (estimate)`
    };
  };

  const calculateQuote = async () => {
    setCalculatingQuote(true);
    setQuoteError(null);
    
    try {
      // Get complexity value for backend
      const complexityValue = mapComplexityToValue(formData.complexity);
      
      // Prepare the request body with all relevant parameters
      const requestBody = {
        // Essential fields for machine learning model
        manufacturingProcess: 'metal-fabrication',
        material: formData.material,
        quantity: formData.quantity,
        complexity: complexityValue,
        
        // Metal-fabrication specific parameters
        dimensions: {
          length: formData.length,
          width: formData.width
        },
        thickness: formData.thickness,
        finishType: formData.finishType,
        
        // Optional metadata
        requestedDeadline: formData.deadline || null
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
      
      // Use lead time from API if available, otherwise calculate it
      if (responseData.leadTime) {
        setLeadTime(responseData.leadTime);
      } else {
        // Calculate lead time based on complexity and quantity
        let leadTimeDays = 5;
        if (formData.complexity === 'medium') leadTimeDays += 2;
        if (formData.complexity === 'high') leadTimeDays += 5;
        if (formData.quantity > 20) leadTimeDays += 3;
        if (formData.quantity > 50) leadTimeDays += 7;
        
        setLeadTime(`${leadTimeDays} days`);
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
                <option value="aluminum">Aluminum</option>
                <option value="steel">Steel</option>
                <option value="stainless-steel">Stainless Steel</option>
                <option value="copper">Copper</option>
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
                min="1"
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Thickness (mm)
              </label>
              <input
                type="number"
                name="thickness"
                value={formData.thickness}
                onChange={handleInputChange}
                step="0.1"
                min="0.1"
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Length (mm)
              </label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleInputChange}
                min="0"
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Width (mm)
              </label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleInputChange}
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
                <option value="low">Low - Simple cuts and bends</option>
                <option value="medium">Medium - Multiple features</option>
                <option value="high">High - Complex design with many features</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Finish Type
              </label>
              <select
                name="finishType"
                value={formData.finishType}
                onChange={handleInputChange}
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
              >
                <option value="none">None</option>
                <option value="painted">Painted</option>
                <option value="powder-coated">Powder Coated</option>
                <option value="anodized">Anodized</option>
                <option value="brushed">Brushed</option>
              </select>
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
              <span className="text-[#94A3B8]">Estimated Price:</span>
              <span className="text-2xl font-bold text-[#F0F4F8]">${quoteAmount}</span>
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