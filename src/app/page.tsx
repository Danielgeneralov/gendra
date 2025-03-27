"use client";

import { useState, FormEvent } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    partType: "",
    material: "",
    quantity: 1,
    complexity: "",
    deadline: ""
  });
  
  const [quoteResult, setQuoteResult] = useState<number | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 1 : value
    }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Calculate the quote
    const basePrice = formData.quantity * 100;
    const complexityMultiplier = formData.complexity === "high" ? 1.5 : 1;
    const totalPrice = basePrice * complexityMultiplier;
    
    setQuoteResult(totalPrice);
  };

  return (
    <div className="flex justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quote a Job</h1>
          <p className="mt-2 text-sm text-slate-500">Fill out the form below to get an instant quote for your job.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="partType" className="block text-sm font-medium text-slate-700">
              Part Type
            </label>
            <input
              type="text"
              id="partType"
              name="partType"
              placeholder="Enter part type"
              value={formData.partType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
            />
          </div>
          
          <div>
            <label htmlFor="material" className="block text-sm font-medium text-slate-700">
              Material
            </label>
            <input
              type="text"
              id="material"
              name="material"
              placeholder="Enter material"
              value={formData.material}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
            />
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="1"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
            />
          </div>
          
          <div>
            <label htmlFor="complexity" className="block text-sm font-medium text-slate-700">
              Complexity
            </label>
            <select
              id="complexity"
              name="complexity"
              value={formData.complexity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
            >
              <option value="">Select complexity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-slate-700">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-150 ease-in-out"
            />
          </div>
          
          <div className="pt-6 border-t border-slate-200">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out"
            >
              Get Quote
            </button>
          </div>
        </form>
        
        {quoteResult !== null && (
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-md">
            <h2 className="text-lg font-medium text-indigo-800">Your Quote</h2>
            <p className="mt-2 text-3xl font-bold text-indigo-900">${quoteResult.toFixed(2)}</p>
            <p className="mt-1 text-sm text-indigo-600">
              Based on {formData.quantity} units of {formData.complexity || "standard"} complexity
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Add interactivity to the quote form:
// - Use React useState to track form inputs: partType, material, quantity, complexity, deadline
// - Add a handleSubmit function (on form submit):
//   - Prevent default behavior
//   - Calculate a fake quote: quantity * 100 * (1.5 if complexity is High)
//   - Show the quote below the form using a <div> with the result
// - Keep the UI clean — show quote only after submission
// - Do not connect to Supabase yet


