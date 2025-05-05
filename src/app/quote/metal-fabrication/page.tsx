"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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

export default function MetalFabricationPage() {
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

  const calculateQuote = () => {
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
    
    // Set quote amount and lead time
    setQuoteAmount(Math.round(price * 100) / 100);
    
    // Calculate lead time based on complexity and quantity
    let leadTimeDays = 5;
    if (formData.complexity === 'medium') leadTimeDays += 2;
    if (formData.complexity === 'high') leadTimeDays += 5;
    if (formData.quantity > 20) leadTimeDays += 3;
    if (formData.quantity > 50) leadTimeDays += 7;
    
    setLeadTime(`${leadTimeDays} days`);
    setShowQuote(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateQuote();
  };

  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">Metal Fabrication Quote</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A6FA6]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">Metal Fabrication Quote</h1>
        <p className="text-lg text-[#CBD5E1] mb-8">
          Get an accurate quote for your metal fabrication project
        </p>

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
            
            <div className="mt-8">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Calculate Quote
              </button>
            </div>
          </form>
        </div>
        
        {showQuote && (
          <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">Quote Summary</h2>
            
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
      </div>
    </div>
  );
} 