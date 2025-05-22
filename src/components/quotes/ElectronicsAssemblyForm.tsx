"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL, QUOTE_ENDPOINT } from '../../app/config';

type FormData = {
  assemblyType: string;
  quantity: number;
  componentCount: number;
  boardLayers: number; 
  hasSMT: boolean;
  hasTHT: boolean;
  testingRequired: boolean;
  complexity: 'low' | 'medium' | 'high';
  turntime: string;
  deadline: string;
  customerEmail?: string;
  customerName?: string;
  companyName?: string;
  additionalNotes?: string;
};

// Configure the API endpoint 
const HEALTH_ENDPOINT = `${API_BASE_URL}/`;

// Add service type constant at the top after imports
const SERVICE_TYPE = 'electronics_assembly';  // TODO: Make this dynamic using route-based context

export default function ElectronicsAssemblyForm() {
  const searchParams = useSearchParams();
  const isPrefill = searchParams.get('prefill') === 'true';
  
  const [formData, setFormData] = useState<FormData>({
    assemblyType: 'pcba',
    quantity: 10,
    componentCount: 0,
    boardLayers: 2,
    hasSMT: true,
    hasTHT: false,
    testingRequired: true,
    complexity: 'medium',
    turntime: 'standard',
    deadline: '',
  });
  
  const [showQuote, setShowQuote] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [leadTime, setLeadTime] = useState('');
  const [unitPrice, setUnitPrice] = useState(0);
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
              quantity: parsedData.quantity || prevState.quantity,
              componentCount: parsedData.componentCount || prevState.componentCount,
              complexity: parsedData.complexity as 'low' | 'medium' | 'high' || prevState.complexity,
              deadline: parsedData.deadline || prevState.deadline,
              // Keep defaults for electronics specific fields
              assemblyType: parsedData.assemblyType || prevState.assemblyType,
              boardLayers: prevState.boardLayers,
              hasSMT: prevState.hasSMT,
              hasTHT: prevState.hasTHT,
              testingRequired: prevState.testingRequired,
              turntime: prevState.turntime
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
  const calculateFallbackQuote = (): { amount: number, unitPrice: number, leadTime: string } => {
    console.log('Performing fallback calculation for electronics assembly');
    
    // Base cost calculation
    let baseUnitPrice = 50; // Starting point for a PCBA
    
    // Adjust base price by assembly type
    if (formData.assemblyType === 'cable-harness') {
      baseUnitPrice = 30;
    } else if (formData.assemblyType === 'box-build') {
      baseUnitPrice = 100;
    }
    
    // Component count cost
    baseUnitPrice += (formData.componentCount * 0.5);
    
    // SMT and THT premiums
    if (formData.hasSMT) baseUnitPrice *= 1.2;
    if (formData.hasTHT) baseUnitPrice *= 1.15;
    
    // Board layer complexity
    if (formData.boardLayers > 2) {
      baseUnitPrice *= (1 + ((formData.boardLayers - 2) * 0.1));
    }
    
    // Testing premium
    if (formData.testingRequired) baseUnitPrice *= 1.25;
    
    // Complexity factors
    const complexityFactors: Record<string, number> = {
      'low': 0.9,
      'medium': 1.0,
      'high': 1.4,
    };
    
    // Apply complexity factor
    baseUnitPrice *= complexityFactors[formData.complexity] || 1.0;
    
    // Turntime premiums
    const turntimeFactors: Record<string, number> = {
      'standard': 1.0,
      'expedited': 1.3,
      'rush': 1.7,
    };
    
    baseUnitPrice *= turntimeFactors[formData.turntime] || 1.0;
    
    // Quantity discounts
    let quantityDiscount = 1.0;
    if (formData.quantity >= 1000) {
      quantityDiscount = 0.6;
    } else if (formData.quantity >= 500) {
      quantityDiscount = 0.7;
    } else if (formData.quantity >= 100) {
      quantityDiscount = 0.8;
    } else if (formData.quantity >= 50) {
      quantityDiscount = 0.9;
    }
    
    baseUnitPrice *= quantityDiscount;
    
    // Minimum prices
    if (formData.assemblyType === 'pcba' && baseUnitPrice < 25) baseUnitPrice = 25;
    if (formData.assemblyType === 'cable-harness' && baseUnitPrice < 20) baseUnitPrice = 20;
    if (formData.assemblyType === 'box-build' && baseUnitPrice < 75) baseUnitPrice = 75;
    
    // Calculate total and lead time
    const totalPrice = baseUnitPrice * formData.quantity;
    
    // Lead time calculation
    let baseDays = 15; // Standard lead time
    
    if (formData.turntime === 'expedited') {
      baseDays = 8;
    } else if (formData.turntime === 'rush') {
      baseDays = 4;
    }
    
    // Adjust for complexity and quantity
    if (formData.complexity === 'high') baseDays += 5;
    if (formData.quantity > 500) baseDays += 7;
    else if (formData.quantity > 100) baseDays += 3;
    
    // Testing adds time
    if (formData.testingRequired) baseDays += 2;
    
    return {
      amount: Math.round(totalPrice * 100) / 100,
      unitPrice: Math.round(baseUnitPrice * 100) / 100,
      leadTime: `${baseDays} days (estimate)`
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
        service_type: SERVICE_TYPE,
        material: formData.assemblyType, // Using assembly type as material type
        quantity: formData.quantity,
        complexity: complexityValue,
        component_count: formData.componentCount,
        board_layers: formData.boardLayers,
        assembly_options: {
          smt: formData.hasSMT,
          tht: formData.hasTHT,
          testing: formData.testingRequired
        },
        turnaround_time: formData.turntime,
        requested_deadline: formData.deadline || null,
        customer_email: formData.customerEmail || "",
        customer_name: formData.customerName || "",
        company_name: formData.companyName || "",
        additional_notes: formData.additionalNotes || ""
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
      
      // Set unit price if provided by backend
      if (responseData.unitPrice !== undefined) {
        setUnitPrice(responseData.unitPrice);
      }
      
      // Use lead time from API if available, otherwise calculate it
      if (responseData.leadTime) {
        setLeadTime(responseData.leadTime);
      } else {
        // Lead time calculation
        let baseDays = 15; // Standard lead time
        
        if (formData.turntime === 'expedited') {
          baseDays = 8;
        } else if (formData.turntime === 'rush') {
          baseDays = 4;
        }
        
        // Adjust for complexity and quantity
        if (formData.complexity === 'high') baseDays += 5;
        if (formData.quantity > 500) baseDays += 7;
        else if (formData.quantity > 100) baseDays += 3;
        
        // Testing adds time
        if (formData.testingRequired) baseDays += 2;
        
        setLeadTime(`${baseDays} days`);
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
        setUnitPrice(fallbackResult.unitPrice);
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
                Assembly Type
              </label>
              <select 
                name="assemblyType"
                value={formData.assemblyType}
                onChange={handleInputChange}
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
                title="Select assembly type"
              >
                <option value="pcba">PCB Assembly (PCBA)</option>
                <option value="cable-harness">Cable/Harness Assembly</option>
                <option value="box-build">Box Build Assembly</option>
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
                title="Enter quantity"
                placeholder="Enter quantity"
              />
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Component Count
              </label>
              <input
                type="number"
                name="componentCount"
                value={formData.componentCount}
                onChange={handleInputChange}
                min="0"
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
                title="Enter component count"
                placeholder="Component count"
              />
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Board Layers (PCBA only)
              </label>
              <select
                name="boardLayers"
                value={formData.boardLayers}
                onChange={handleInputChange}
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
                title="Select board layers"
              >
                <option value="2">2 Layer</option>
                <option value="4">4 Layer</option>
                <option value="6">6 Layer</option>
                <option value="8">8+ Layer</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasSMT"
                name="hasSMT"
                checked={formData.hasSMT}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#4A6FA6] focus:ring-[#4A6FA6] border-[#24334A] rounded"
              />
              <label htmlFor="hasSMT" className="ml-2 block text-[#E2E8F0] text-sm font-medium">
                Surface Mount Technology (SMT)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasTHT"
                name="hasTHT"
                checked={formData.hasTHT}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#4A6FA6] focus:ring-[#4A6FA6] border-[#24334A] rounded"
              />
              <label htmlFor="hasTHT" className="ml-2 block text-[#E2E8F0] text-sm font-medium">
                Through-Hole Technology (THT)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="testingRequired"
                name="testingRequired"
                checked={formData.testingRequired}
                onChange={handleInputChange}
                className="h-4 w-4 text-[#4A6FA6] focus:ring-[#4A6FA6] border-[#24334A] rounded"
              />
              <label htmlFor="testingRequired" className="ml-2 block text-[#E2E8F0] text-sm font-medium">
                Functional Testing Required
              </label>
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Assembly Complexity
              </label>
              <select
                name="complexity"
                value={formData.complexity}
                onChange={handleInputChange}
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
                title="Select assembly complexity"
              >
                <option value="low">Low - Simple assembly, few components</option>
                <option value="medium">Medium - Moderate complexity</option>
                <option value="high">High - Complex assembly, fine-pitch components</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                Turn Time
              </label>
              <select
                name="turntime"
                value={formData.turntime}
                onChange={handleInputChange}
                className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
                title="Select turn time"
              >
                <option value="standard">Standard (15+ days)</option>
                <option value="expedited">Expedited (8-14 days)</option>
                <option value="rush">Rush (3-7 days)</option>
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
                title="Select deadline"
                placeholder="Deadline"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-[#94A3B8] block">Unit Price:</span>
                <span className="text-lg font-medium text-[#F0F4F8]">${unitPrice} per unit</span>
              </div>
              <div>
                <span className="text-[#94A3B8] block">Quantity:</span>
                <span className="text-lg font-medium text-[#F0F4F8]">{formData.quantity} units</span>
              </div>
            </div>
            <div className="border-t border-[#24334A] pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#94A3B8]">Total Quote Amount:</span>
                <span className="text-2xl font-bold text-[#F0F4F8]">${quoteAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">Estimated Lead Time:</span>
                <span className="text-lg font-medium text-[#F0F4F8]">{leadTime}</span>
              </div>
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