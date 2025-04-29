"use client";

import { useState, FormEvent, useEffect, useCallback } from "react";
import { supabase } from "../supabase";
import { fetchQuote } from "./api";
import { ScrollAnimation } from "../components/ScrollAnimation";
import { MotionButton } from "../components/MotionButton";
import { GatedQuote } from "../components/GatedQuote";
import { QuoteEmailModal } from "../components/QuoteEmailModal";

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

// Set this to true to use modal version, false to use inline version
const USE_MODAL = true;

// Add this cache object outside the component to cache quotes
const quoteCache = new Map<string, number>();

// In the QuotePage component, add a cacheKey generation function:
const generateCacheKey = (material: string, quantity: number, complexity: string): string => {
  return `${material}_${quantity}_${complexity}`.toLowerCase();
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
    type: "success" | "error" | "loading" | null;
    message: string;
  }>({ type: null, message: "" });
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [isRecentJobsLoading, setIsRecentJobsLoading] = useState(false);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Email modal state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  
  // Calculate quote range (±10%)
  const quoteRange = quoteResult
    ? {
        min: Math.floor(quoteResult * 0.9),
        max: Math.ceil(quoteResult * 1.1),
      }
    : null;
  
  // Fetch recent jobs when component mounts
  useEffect(() => {
    async function fetchRecentJobs() {
      setIsRecentJobsLoading(true);
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
        setIsRecentJobsLoading(false);
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
    setEmailSubmitted(false);
    
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
      
      // Generate cache key
      const cacheKey = generateCacheKey(formData.material, formData.quantity, formData.complexity);
      
      // Check if we have a cached result
      if (quoteCache.has(cacheKey)) {
        // Use cached quote
        const cachedQuote = quoteCache.get(cacheKey);
        console.log("Using cached quote:", cachedQuote);
        setQuoteResult(cachedQuote || 0);
        
        // Success notification 
        setSubmitStatus({
          type: "success",
          message: "Quote generated successfully!"
        });
        
        // If using modal, open it now
        if (USE_MODAL && !emailSubmitted) {
          setIsEmailModalOpen(true);
        }
      } else {
        // Show detailed loading message
        setSubmitStatus({
          type: "loading",
          message: "Connecting to quote engine... (may take up to 30 seconds on first request)"
        });
        
        // Call the modularized fetchQuote function
        const data = await fetchQuote(
          formData.material,
          formData.quantity,
          complexityValue
        );
        
        // Cache the result for future use
        quoteCache.set(cacheKey, data.quote);
        
        // Set the quote result but don't save it to Supabase yet
        // That will happen after email capture
        setQuoteResult(data.quote);
        
        // If using modal, open it now
        if (USE_MODAL && !emailSubmitted) {
          setIsEmailModalOpen(true);
        }
        
        // Success notification 
        setSubmitStatus({
          type: "success",
          message: "Quote generated successfully!"
        });
      }
    } catch (err) {
      console.error("Error fetching quote from backend:", err);
      setSubmitStatus({
        type: "error", 
        message: "Error generating quote. The server might be starting up - please try again."
      });
    } finally {
      setIsQuoteLoading(false);
    }
  };
  
  // Handle successful email submission
  const handleEmailSubmit = (email: string) => {
    setEmailSubmitted(true);
    
    // If we got the email through the modal, we need to insert the data to the jobs table now
    if (quoteResult && emailSubmitted) {
      insertJobToSupabase(quoteResult);
    }
  };
  
  // Insert job to Supabase once email is captured
  const insertJobToSupabase = async (quoteAmount: number) => {
    try {
      if (!supabase) {
        console.error("Supabase client is not initialized");
        return;
      }
      
      const { error } = await supabase
        .from("jobs")
        .insert({
          part_type: formData.partType,
          material: formData.material,
          quantity: formData.quantity,
          complexity: formData.complexity,
          deadline: formData.deadline,
          quote_amount: quoteAmount
        });
      
      if (error) {
        console.error("Error inserting job into Supabase:", error);
      } else {
        console.log("Successfully inserted job after email capture");
      }
    } catch (err) {
      console.error("Exception during Supabase job insert:", err);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  
  // Render quote result based on email submission status
  const renderQuoteResult = () => {
    if (!quoteResult) return null;
    
    if (USE_MODAL) {
      // In modal mode, we show the exact quote after email submit, otherwise just the range
      return (
        <ScrollAnimation delay={0.1}>
          {emailSubmitted ? (
            <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-md">
              <h2 className="text-lg font-medium text-green-800">Exact Quote</h2>
              <p className="text-3xl font-bold text-green-700 mt-2">
                {formatCurrency(quoteResult)}
              </p>
              <p className="text-sm text-green-600 mt-2">
                This quote is valid for 30 days and includes all manufacturing costs.
              </p>
              
              <div className="mt-4 p-3 rounded-md bg-green-100/50 border border-green-100">
                <h3 className="text-md font-medium text-green-800 mb-1">Production Timeline</h3>
                <p className="text-sm text-green-700">
                  Standard production: 7-10 business days
                </p>
                <p className="text-sm text-green-700">
                  Rush production available: 3-5 business days (25% premium)
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-md">
              <h2 className="text-lg font-medium text-indigo-800">Quote Range</h2>
              <p className="text-3xl font-bold text-indigo-700 mt-2">
                {formatCurrency(quoteRange?.min || 0)} – {formatCurrency(quoteRange?.max || 0)}
              </p>
              <p className="text-sm text-indigo-600 mt-2 mb-2">
                This estimated range is based on your specifications.
              </p>
              
              <MotionButton
                onClick={() => setIsEmailModalOpen(true)}
                primary
                className="w-full mt-4"
              >
                Get Exact Quote
              </MotionButton>
            </div>
          )}
        </ScrollAnimation>
      );
    } else {
      // In inline mode, use the GatedQuote component
      return (
        <ScrollAnimation delay={0.1}>
          <GatedQuote 
            quoteAmount={quoteResult}
            isLoading={isQuoteLoading}
            formData={formData}
          />
        </ScrollAnimation>
      );
    }
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
                {isQuoteLoading ? "Calculating Quote..." : "Generate Quote"}
              </MotionButton>
              {isQuoteLoading && (
                <p className="text-sm text-slate-500 mt-2 animate-pulse">
                  {submitStatus.type === "loading" ? 
                    submitStatus.message : 
                    "Calculating your quote, please wait..."}
                </p>
              )}
            </ScrollAnimation>
          </form>
          
          {/* Loading Message */}
          {submitStatus.type === "loading" && !isQuoteLoading && (
            <ScrollAnimation>
              <div className="p-4 rounded-md bg-blue-50 border border-blue-100 text-blue-700">
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm font-medium">{submitStatus.message}</p>
                </div>
              </div>
            </ScrollAnimation>
          )}
          
          {/* Quote Result Section */}
          {renderQuoteResult()}
          
          {/* Error Message */}
          {submitStatus.type === "error" && (
            <ScrollAnimation>
              <div 
                className="p-4 rounded-md bg-red-50 border border-red-100 text-red-700"
              >
                <p className="text-sm font-medium">{submitStatus.message}</p>
              </div>
            </ScrollAnimation>
          )}
          
          {/* Recent Jobs Table */}
          {recentJobs.length > 0 && (
            <ScrollAnimation delay={0.3}>
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-slate-900">Recent Quotes</h2>
                  {isRecentJobsLoading && (
                    <span className="text-xs text-slate-500">Loading...</span>
                  )}
                </div>
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
      
      {/* Email Modal */}
      <QuoteEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onEmailSubmit={handleEmailSubmit}
        quoteRange={quoteRange}
        formData={formData}
        quoteAmount={quoteResult}
      />
    </div>
  );
} 