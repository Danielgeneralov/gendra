"use client";

import { useState } from "react";

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

export default function InjectionMoldingPage() {
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
    
    // Set state values
    setMoldCost(Math.round(moldCost * 100) / 100);
    setUnitCost(Math.round(unitCost * 100) / 100);
    setQuoteAmount(Math.round(totalQuote * 100) / 100);
    
    // Calculate lead time based on complexity and quantity
    let toolingTime = 15; // Base tooling time in days
    if (formData.complexity === 'medium') toolingTime += 5;
    if (formData.complexity === 'high') toolingTime += 10;
    
    const productionTime = Math.ceil(formData.quantity / 5000) * 5; // 5 days per 5000 units
    
    setLeadTime(`${toolingTime + productionTime} days (${toolingTime} days tooling + ${productionTime} days production)`);
    setShowQuote(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateQuote();
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-black via-[#050C1C] to-[#0A1828]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">Injection Molding Quote</h1>
        <p className="text-lg text-[#CBD5E1] mb-8">
          Get an accurate quote for your injection molding project
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
                  <option value="low">Low - Simple shape, few features</option>
                  <option value="medium">Medium - Multiple features, some complex geometry</option>
                  <option value="high">High - Complex geometry, many features, tight tolerances</option>
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
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="colorMatching"
                  name="colorMatching"
                  checked={formData.colorMatching}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#24334A] rounded"
                />
                <label htmlFor="colorMatching" className="ml-2 block text-[#E2E8F0] text-sm font-medium">
                  Color Matching Required
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
                  <span className="text-[#94A3B8] block">Mold Cost:</span>
                  <span className="text-xl font-bold text-[#F0F4F8]">${moldCost}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] block">Unit Cost:</span>
                  <span className="text-lg font-medium text-[#F0F4F8]">${unitCost} per unit</span>
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