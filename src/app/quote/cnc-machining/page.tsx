"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type FormData = {
  material: string;
  quantity: number;
  length: number;
  width: number;
  height: number;
  tolerance: string;
  surfaceFinish: string;
  complexity: 'low' | 'medium' | 'high';
  deadline: string;
};

export default function CNCMachiningPage() {
  const [formData, setFormData] = useState<FormData>({
    material: 'aluminum',
    quantity: 1,
    length: 0,
    width: 0,
    height: 0,
    tolerance: 'standard',
    surfaceFinish: 'standard',
    complexity: 'low',
    deadline: '',
  });
  
  const [showQuote, setShowQuote] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [leadTime, setLeadTime] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const calculateQuote = () => {
    // Simple placeholder calculation
    const volume = formData.length * formData.width * formData.height;
    let basePrice = 100 + (volume * 0.2);
    
    // Apply material factor
    if (formData.material === 'aluminum') basePrice *= 1.0;
    else if (formData.material === 'steel') basePrice *= 1.3;
    else if (formData.material === 'stainless-steel') basePrice *= 1.5;
    else if (formData.material === 'titanium') basePrice *= 2.5;
    else if (formData.material === 'brass') basePrice *= 1.7;
    
    // Apply complexity factor
    if (formData.complexity === 'low') basePrice *= 1.0;
    else if (formData.complexity === 'medium') basePrice *= 1.5;
    else if (formData.complexity === 'high') basePrice *= 2.2;
    
    // Apply tolerance factor
    if (formData.tolerance === 'standard') basePrice *= 1.0;
    else if (formData.tolerance === 'tight') basePrice *= 1.3;
    else if (formData.tolerance === 'precision') basePrice *= 1.6;
    
    // Apply finish factor
    if (formData.surfaceFinish === 'standard') basePrice *= 1.0;
    else if (formData.surfaceFinish === 'polished') basePrice *= 1.2;
    else if (formData.surfaceFinish === 'anodized') basePrice *= 1.3;
    
    // Quantity discounts
    if (formData.quantity > 20) basePrice *= 0.85;
    else if (formData.quantity > 10) basePrice *= 0.9;
    else if (formData.quantity > 5) basePrice *= 0.95;
    
    // Total price
    const totalPrice = basePrice * formData.quantity;
    
    // Set lead time
    let baseDays = 5;
    if (formData.complexity === 'medium') baseDays += 2;
    if (formData.complexity === 'high') baseDays += 5;
    if (formData.tolerance === 'tight') baseDays += 1;
    if (formData.tolerance === 'precision') baseDays += 3;
    if (formData.quantity > 10) baseDays += 3;
    
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
        <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">CNC Machining Quote</h1>
        <p className="text-lg text-[#CBD5E1] mb-8">
          Get an accurate quote for your CNC machining project
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
                  <option value="titanium">Titanium</option>
                  <option value="brass">Brass</option>
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
                  Length (mm)
                </label>
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
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
                  step="0.1"
                  className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                  Height (mm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-[#E2E8F0] text-sm font-medium mb-2">
                  Tolerance
                </label>
                <select
                  name="tolerance"
                  value={formData.tolerance}
                  onChange={handleInputChange}
                  className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
                >
                  <option value="standard">Standard (±0.2mm)</option>
                  <option value="tight">Tight (±0.1mm)</option>
                  <option value="precision">Precision (±0.05mm)</option>
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
                  <option value="standard">Standard Machined</option>
                  <option value="polished">Polished</option>
                  <option value="anodized">Anodized (Aluminum Only)</option>
                </select>
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
                  <option value="high">High - Complex geometry, many features</option>
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