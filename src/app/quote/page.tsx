"use client";

import { useState, FormEvent, useEffect } from "react";
import { supabase } from "../supabase";
import { fetchQuote } from "./api";
import { ScrollAnimation } from "../components/ScrollAnimation";
import { MotionButton } from "../components/MotionButton";

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
      <ScrollAnimation>
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
            <ScrollAnimation delay={0.1}>
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
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.2}>
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
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.3}>
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
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.4}>
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
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.5}>
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
            </ScrollAnimation>
            
            <ScrollAnimation delay={0.6}>
              <MotionButton
                type="submit"
                primary
                className="w-full"
                disabled={isQuoteLoading}
              >
                {isQuoteLoading ? "Calculating..." : "Generate Quote"}
              </MotionButton>
            </ScrollAnimation>
          </form>
          
          {quoteResult !== null && (
            <ScrollAnimation delay={0.1}>
              <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-md">
                <h2 className="text-lg font-medium text-green-800">Quote Result</h2>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {formatCurrency(quoteResult)}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  This quote is valid for 30 days and includes all manufacturing costs.
                </p>
              </div>
            </ScrollAnimation>
          )}
          
          {submitStatus.type && (
            <ScrollAnimation>
              <div 
                className={`p-4 rounded-md ${
                  submitStatus.type === "success" 
                    ? "bg-green-50 border border-green-100 text-green-700" 
                    : "bg-red-50 border border-red-100 text-red-700"
                }`}
              >
                <p className="text-sm font-medium">{submitStatus.message}</p>
              </div>
            </ScrollAnimation>
          )}
          
          {recentJobs.length > 0 && (
            <ScrollAnimation delay={0.3}>
              <div className="mt-8">
                <h2 className="text-lg font-medium text-slate-900">Recent Quotes</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Part</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Material</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Qty</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quote</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {recentJobs.map((job) => (
                        <tr key={job.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{job.part_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.material}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{job.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{formatCurrency(job.quote_amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollAnimation>
          )}
        </div>
      </ScrollAnimation>
    </div>
  );
} 