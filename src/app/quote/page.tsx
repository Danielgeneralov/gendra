"use client";

import { useState, FormEvent, useEffect } from "react";
import { supabase } from "../supabase";
import { fetchQuote } from "./api";

// Define the Job type
type Job = {
  id: string;
  part_type: string;
  material: string;
  quantity: number;
  complexity: string;
  deadline: string;
  quote_amount: number;
  created_at: string;
};

export default function QuotePage() {
  const [formData, setFormData] = useState({
    partType: "",
    material: "",
    quantity: 1,
    complexity: "",
    deadline: ""
  });
  
  const [quoteResult, setQuoteResult] = useState<number | null>(null);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Fetch recent jobs when component mounts
  useEffect(() => {
    async function fetchRecentJobs() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
          
        if (error) {
          console.error("Error fetching recent jobs:", error);
        } else {
          setRecentJobs(data || []);
        }
      } catch (err) {
        console.error("Exception during fetch:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRecentJobs();
  }, [quoteResult]); // Refetch when a new quote is generated
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) || 1 : value
    }));
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  };
  
  const validateForm = (): boolean => {
    // Check if all required fields are filled
    if (!formData.partType.trim()) {
      setValidationError("Please enter a part type");
      return false;
    }
    
    if (!formData.material.trim()) {
      setValidationError("Please enter a material");
      return false;
    }
    
    if (!formData.quantity || formData.quantity < 1) {
      setValidationError("Please enter a valid quantity (minimum 1)");
      return false;
    }
    
    if (!formData.complexity) {
      setValidationError("Please select a complexity level");
      return false;
    }
    
    if (!formData.deadline) {
      setValidationError("Please select a deadline");
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Reset status
    setSubmitStatus({ type: null, message: "" });
    setValidationError(null);
    setQuoteResult(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Start loading state
    setIsQuoteLoading(true);
    
    try {
      // Map complexity string to numeric value
      const complexityValue = 
        formData.complexity === 'high' ? 1.5 : 
        formData.complexity === 'medium' ? 1.0 : 
        formData.complexity === 'low' ? 0.5 : 1.0;
      
      // Call the modularized fetchQuote function
      const data = await fetchQuote(
        formData.material,
        formData.quantity,
        complexityValue
      );
      
      setQuoteResult(data.quote);
      
      // Insert data into Supabase
      try {
        // Check if Supabase is properly initialized
        if (!supabase) {
          console.error("Supabase client is not initialized");
          setSubmitStatus({
            type: "error",
            message: "Database connection not available"
          });
          return;
        }
        
        console.log("Attempting to insert data:", {
          part_type: formData.partType,
          material: formData.material,
          quantity: formData.quantity,
          complexity: formData.complexity,
          deadline: formData.deadline,
          quote_amount: data.quote
        });
        
        const { data: supabaseData, error } = await supabase
          .from("jobs")
          .insert({
            part_type: formData.partType,
            material: formData.material,
            quantity: formData.quantity,
            complexity: formData.complexity,
            deadline: formData.deadline,
            quote_amount: data.quote
          })
          .select();
        
        if (error) {
          console.error("Error inserting into Supabase:", error);
          setSubmitStatus({
            type: "error",
            message: `Failed to save quote: ${error.message || JSON.stringify(error)}`
          });
        } else {
          console.log("Successfully inserted quote into Supabase:", supabaseData);
          setSubmitStatus({
            type: "success",
            message: "Quote submitted successfully! Your job request has been saved."
          });
        }
      } catch (err) {
        console.error("Exception during Supabase insert:", err);
        setSubmitStatus({
          type: "error",
          message: `An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`
        });
      }
    } catch (err) {
      console.error("Error fetching quote from backend:", err);
      setSubmitStatus({
        type: "error", 
        message: "Error generating quote"
      });
    } finally {
      setIsQuoteLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Intelligent Quoting</h1>
          <p className="mt-2 text-sm text-slate-500">Generate accurate quotes in minutes with Gendra AI-powered pricing engine.</p>
        </div>
        
        {validationError && (
          <div className="p-3 rounded-md bg-red-50 border border-red-100 text-red-700">
            <p className="text-sm font-medium">{validationError}</p>
          </div>
        )}
        
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
              className={`mt-1 block w-full rounded-md shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-150 ease-in-out ${
                validationError && !formData.partType.trim() 
                  ? "border-red-300 focus:border-red-500" 
                  : "border-slate-300 focus:border-indigo-500"
              }`}
              required
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
              className={`mt-1 block w-full rounded-md shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-150 ease-in-out ${
                validationError && !formData.material.trim() 
                  ? "border-red-300 focus:border-red-500" 
                  : "border-slate-300 focus:border-indigo-500"
              }`}
              required
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
              className={`mt-1 block w-full rounded-md shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-150 ease-in-out ${
                validationError && (!formData.quantity || formData.quantity < 1)
                  ? "border-red-300 focus:border-red-500" 
                  : "border-slate-300 focus:border-indigo-500"
              }`}
              required
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
              className={`mt-1 block w-full rounded-md shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-150 ease-in-out ${
                validationError && !formData.complexity
                  ? "border-red-300 focus:border-red-500" 
                  : "border-slate-300 focus:border-indigo-500"
              }`}
              required
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
              className={`mt-1 block w-full rounded-md shadow-sm px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-150 ease-in-out ${
                validationError && !formData.deadline
                  ? "border-red-300 focus:border-red-500" 
                  : "border-slate-300 focus:border-indigo-500"
              }`}
              required
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
        
        {submitStatus.type && (
          <div className={`mt-4 p-4 rounded-md flex items-start ${
            submitStatus.type === "success" 
              ? "bg-green-50 border border-green-100 text-green-800" 
              : "bg-red-50 border border-red-100 text-red-800"
          }`}>
            <div className="flex-shrink-0">
              {submitStatus.type === "success" ? (
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{submitStatus.message}</p>
            </div>
          </div>
        )}
        
        {quoteResult !== null ? (
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-md">
            <h2 className="text-lg font-medium text-indigo-800">Your Quote</h2>
            <p className="mt-2 text-3xl font-bold text-indigo-900">{formatCurrency(quoteResult)}</p>
            <p className="mt-1 text-sm text-indigo-600">
              Based on {formData.quantity} units of {formData.complexity || "standard"} complexity
            </p>
          </div>
        ) : isQuoteLoading ? (
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-md">
            <h2 className="text-lg font-medium text-indigo-800">Generating Quote...</h2>
            <div className="mt-2 flex justify-center">
              <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* Recent Quotes Section */}
      <div className="max-w-2xl w-full mt-8 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Quotes</h2>
        
        {isLoading ? (
          <div className="text-center py-4 text-slate-500">Loading recent quotes...</div>
        ) : recentJobs.length === 0 ? (
          <div className="text-center py-4 text-slate-500">No quotes found. Create your first one!</div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Part Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Material
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Quote
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {recentJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      {job.part_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {job.material}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {job.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {formatCurrency(job.quote_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 