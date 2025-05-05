"use client";

import { useState } from "react";

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
};

export default function ElectronicsAssemblyPage() {
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

  const calculateQuote = () => {
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
    
    // Set final values
    setUnitPrice(Math.round(baseUnitPrice * 100) / 100);
    setQuoteAmount(Math.round(totalPrice * 100) / 100);
    setLeadTime(`${baseDays} days`);
    setShowQuote(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateQuote();
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">Electronics Assembly Quote</h1>
        <p className="text-lg text-[#CBD5E1] mb-8">
          Get an accurate quote for your electronics manufacturing project
        </p>

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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#24334A] rounded"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#24334A] rounded"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#24334A] rounded"
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
      </div>
    </div>
  );
} 